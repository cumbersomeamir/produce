import { enforceRateLimit, fail, ok } from "@/lib/api";
import {
  AvailabilityStatus,
  buildAlibabaSearchUrl,
  deriveSearchQuery,
} from "@/lib/procurement-workflow";

const BLOCK_MARKERS = [
  "captcha",
  "unusual traffic",
  "_____tmd_____",
  "/punish?",
  "punish-component",
];

function classifyAlibabaResponse(statusCode, html) {
  const lower = String(html || "").toLowerCase();
  if (statusCode === 404 || lower.includes("404 not found")) {
    return {
      status: AvailabilityStatus.NOT_FOUND,
      note: "Alibaba listing was not found. Try a broader search query.",
    };
  }

  if (BLOCK_MARKERS.some((marker) => lower.includes(marker))) {
    return {
      status: AvailabilityStatus.NEEDS_REVIEW,
      note: "Alibaba anti-bot/captcha blocked automated validation. Open link manually and confirm listing.",
    };
  }

  if (statusCode >= 200 && statusCode < 300) {
    return {
      status: AvailabilityStatus.AVAILABLE,
      note: "Listing page was reachable. Validate supplier quality manually before negotiating.",
    };
  }

  return {
    status: AvailabilityStatus.UNKNOWN,
    note: "Automated check was inconclusive. Use manual verification.",
  };
}

async function fetchWithTimeout(url, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });

    const text = await response.text();
    return { status: response.status, text };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request) {
  const limited = enforceRateLimit(request, {
    prefix: "admin-procurement-alibaba-check",
    limit: 25,
    windowMs: 60_000,
  });
  if (limited) return limited;

  try {
    const body = await request.json();
    const productName = String(body?.productName || "").trim();
    const searchQuery = String(body?.searchQuery || "").trim() || deriveSearchQuery(productName);
    const explicitAlibabaUrl = String(body?.alibabaUrl || "").trim();
    const generatedSearchUrl = buildAlibabaSearchUrl(searchQuery);
    const alibabaUrl = explicitAlibabaUrl || generatedSearchUrl;

    if (!productName) {
      return fail("productName is required.", 400);
    }

    if (!alibabaUrl) {
      return ok({
        data: {
          status: AvailabilityStatus.UNKNOWN,
          alibabaUrl: generatedSearchUrl,
          checkedAt: new Date().toISOString(),
          note: "No Alibaba URL was provided. Generated a search link for manual validation.",
        },
      });
    }

    let classification = {
      status: AvailabilityStatus.UNKNOWN,
      note: "Check could not be completed.",
    };

    try {
      const { status, text } = await fetchWithTimeout(alibabaUrl);
      classification = classifyAlibabaResponse(status, text);
    } catch (error) {
      classification = {
        status: AvailabilityStatus.NEEDS_REVIEW,
        note: `Automated check failed: ${error?.name === "AbortError" ? "request timed out" : "network issue"}. Validate manually.`,
      };
    }

    return ok({
      data: {
        ...classification,
        alibabaUrl,
        searchQuery,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch {
    return fail("Invalid JSON body.", 400);
  }
}

