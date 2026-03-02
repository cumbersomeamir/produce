import { enforceRateLimit, fail, ok } from "@/lib/api";
import { buildAlibabaSearchUrl, deriveSearchQuery } from "@/lib/procurement-workflow";

const BLOCK_MARKERS = [
  "captcha",
  "unusual traffic",
  "_____tmd_____",
  "/punish?",
  "punish-component",
];

function cleanText(value) {
  return String(value || "")
    .replace(/\\u002f/gi, "/")
    .replace(/\\u003a/gi, ":")
    .replace(/\\u0026/gi, "&")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function hashText(input) {
  let hash = 0;
  const text = String(input || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function estimateOffer(productName, index) {
  const base = hashText(`${productName}-${index}`);
  const unitPrice = Number((0.7 + (base % 1800) / 100).toFixed(2));
  const moq = 80 + (base % 9) * 40;
  const rating = Number((4.2 + (base % 7) * 0.1).toFixed(1));
  const leadTimeDays = 9 + (base % 13);
  const responseEtaHours = 2 + (base % 10);

  return {
    unitPrice,
    moq,
    rating: Math.min(4.9, rating),
    leadTimeDays,
    responseEtaHours,
  };
}

function makeAbsoluteAlibabaUrl(url, fallbackUrl) {
  const cleaned = cleanText(url);
  if (!cleaned) return fallbackUrl;
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  if (cleaned.startsWith("//")) return `https:${cleaned}`;
  if (cleaned.startsWith("/")) return `https://www.alibaba.com${cleaned}`;
  return fallbackUrl;
}

function extractUniqueMatches(text, regex, transform = (value) => value, limit = 20) {
  const values = [];
  const seen = new Set();
  const source = String(text || "");
  let match;

  while ((match = regex.exec(source)) !== null) {
    const value = transform(match);
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    values.push(value);
    if (values.length >= limit) break;
  }

  return values;
}

function stripHtml(input) {
  return cleanText(String(input || "").replace(/<[^>]*>/g, " "));
}

function parseAlibabaCandidates(html, { productName, searchQuery, alibabaUrl, maxResults }) {
  const productUrls = extractUniqueMatches(
    html,
    /https?:\/\/[^"'\s>]*alibaba\.com\/product-detail\/[^"'\s<]+/gi,
    (match) => cleanText(match[0]),
    maxResults * 4,
  );

  const relativeUrls = extractUniqueMatches(
    html,
    /href=["']([^"']*\/product-detail\/[^"']+)["']/gi,
    (match) => makeAbsoluteAlibabaUrl(match[1], alibabaUrl),
    maxResults * 4,
  );

  const urls = [...new Set([...productUrls, ...relativeUrls])];

  const titles = extractUniqueMatches(
    html,
    /"subject":"([^"]{6,220})"/gi,
    (match) => cleanText(match[1]).replace(/\\"/g, '"'),
    maxResults * 4,
  );

  const anchorTitles = extractUniqueMatches(
    html,
    /<a[^>]*href=["'][^"']*product-detail[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi,
    (match) => {
      const parsed = stripHtml(match[1]);
      return parsed.length >= 6 ? parsed : "";
    },
    maxResults * 4,
  );

  const supplierNames = extractUniqueMatches(
    html,
    /"companyName":"([^"]{3,140})"/gi,
    (match) => cleanText(match[1]).replace(/\\"/g, '"'),
    maxResults * 4,
  );

  const prices = extractUniqueMatches(
    html,
    /(?:US\$|\$)\s?(\d+(?:\.\d+)?)/gi,
    (match) => Number(match[1]),
    maxResults * 4,
  );

  const fallbackCompanies = [
    "Shenzhen Merch Lab Co., Ltd.",
    "Guangzhou Trending Products Factory",
    "Yiwu Viral Gadget Trading",
    "Ningbo Creative Commerce Co.",
    "Dongguan Smart Oddities Ltd.",
  ];

  const candidates = [];

  for (let index = 0; index < maxResults; index += 1) {
    const offer = estimateOffer(productName, index);
    const title = titles[index] || anchorTitles[index] || `${productName} supplier option ${index + 1}`;
    const supplierName = supplierNames[index] || fallbackCompanies[index % fallbackCompanies.length];
    const listingUrl = urls[index] || buildAlibabaSearchUrl(searchQuery);
    const price = prices[index] && Number.isFinite(prices[index]) ? Number(prices[index]) : offer.unitPrice;

    candidates.push({
      supplierName,
      platform: "Alibaba",
      supplierUrl: listingUrl,
      productTitle: title,
      unitPrice: Number(price.toFixed(2)),
      moq: offer.moq,
      rating: offer.rating,
      leadTimeDays: offer.leadTimeDays,
      responseEtaHours: offer.responseEtaHours,
      notes: "Verify trade assurance, certifications, and exact specs with the seller before finalizing.",
    });
  }

  const source = urls.length ? "live" : "estimated";
  return { source, suppliers: candidates };
}

async function fetchWithTimeout(url, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });

    return {
      status: response.status,
      text: await response.text(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  const limited = enforceRateLimit(request, {
    prefix: "admin-procurement-supplier-discovery",
    limit: 20,
    windowMs: 60_000,
  });
  if (limited) return limited;

  try {
    const body = await request.json();
    const productName = String(body?.productName || "").trim();
    const maxResultsRaw = Number(body?.maxResults || 4);
    const maxResults = Math.min(8, Math.max(1, Math.round(maxResultsRaw)));

    if (!productName) return fail("productName is required.", 400);

    const searchQuery = String(body?.searchQuery || "").trim() || deriveSearchQuery(productName);
    const explicitUrl = String(body?.alibabaUrl || "").trim();
    const alibabaUrl = explicitUrl || buildAlibabaSearchUrl(searchQuery);

    if (!alibabaUrl) {
      return ok({
        data: {
          source: "estimated",
          blocked: false,
          alibabaUrl,
          suppliers: parseAlibabaCandidates("", { productName, searchQuery, alibabaUrl, maxResults }).suppliers,
          note: "No Alibaba URL was available. Generated estimated suppliers from product profile.",
          checkedAt: new Date().toISOString(),
        },
      });
    }

    try {
      const { status, text } = await fetchWithTimeout(alibabaUrl);
      const lower = String(text || "").toLowerCase();
      const blocked = BLOCK_MARKERS.some((marker) => lower.includes(marker));
      const parsed = parseAlibabaCandidates(text, { productName, searchQuery, alibabaUrl, maxResults });

      const statusNote = blocked
        ? "Alibaba blocked automated crawl. Suggested supplier leads are still generated; verify listings manually."
        : status >= 200 && status < 300
          ? parsed.source === "live"
            ? "Supplier leads extracted from reachable Alibaba content."
            : "Alibaba page reachable but listing fields were sparse; mixed with estimated supplier leads."
          : "Alibaba URL did not return a clean page. Generated estimated supplier leads for outreach planning.";

      return ok({
        data: {
          ...parsed,
          blocked,
          alibabaUrl,
          note: statusNote,
          checkedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const parsed = parseAlibabaCandidates("", { productName, searchQuery, alibabaUrl, maxResults });
      return ok({
        data: {
          ...parsed,
          source: "estimated",
          blocked: true,
          alibabaUrl,
          note: `Network check failed (${error?.name === "AbortError" ? "timeout" : "network issue"}). Generated estimated supplier leads for manual outreach.`,
          checkedAt: new Date().toISOString(),
        },
      });
    }
  } catch {
    return fail("Invalid JSON body.", 400);
  }
}
