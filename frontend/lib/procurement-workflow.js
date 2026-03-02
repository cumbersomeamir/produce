import { clamp, slugify } from "@/lib/utils";

export const PROCUREMENT_STORAGE_KEY = "oddfinds.procurement.workspace.v1";

export const AvailabilityStatus = {
  AVAILABLE: "available",
  NEEDS_REVIEW: "needs-review",
  NOT_FOUND: "not-found",
  UNKNOWN: "unknown",
};

const RAW_PRODUCT_REFERENCES = [
  {
    name: "Image printing bot",
    inspirationUrl: "https://www.instagram.com/p/DU4MJq-giQo/",
  },
  {
    name: "ring, bracelet - 2 in one",
    inspirationUrl: "https://www.instagram.com/p/DTVSzmfiMA3/",
    alibabaStatus: "Available",
    alibabaUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=ring%2C+bracelet+2+convertible&pro=true&from=pcHomeContent",
  },
  {
    name: "Car Alarm Clock",
    inspirationUrl: "https://www.instagram.com/p/DUn1B3Mk7Rn/",
    alibabaStatus: "Available",
    alibabaUrl:
      "https://www.alibaba.com/product-detail/Hypercar-Alarm-Clock-LED-Display-Realistic_1601688575767.html?spm=a2700.prosearch.normal_offer.d_image.4d0b67afmzSSIT&priceId=b88a2a183f484f94a2bd77e6d65d9b19",
  },
  {
    name: "Spider Web in real life",
    inspirationUrl: "https://www.instagram.com/p/DSKNv8YACB5/",
    alibabaStatus: "Available",
    alibabaUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=spiderman+web+shooter&pro=true&from=pcHomeContent",
  },
  {
    name: "Silicone Face Mask",
    inspirationUrl: "https://www.instagram.com/p/DUOIqIajY2-/",
    alibabaStatus: "Available but too much variety",
  },
  {
    name: "Gym at home",
    inspirationUrl: "https://www.instagram.com/p/DPvTZGdEV7c/",
  },
  {
    name: "Protein Roti",
    inspirationUrl: "https://www.instagram.com/p/DR4CDYrgDxK/",
  },
  {
    name: "Instgram Share using RFID locket",
    inspirationUrl: "https://www.instagram.com/p/DO5ft5FDrG8/",
    alibabaStatus: "Available",
    alibabaUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=Instgram+Share+using+RFID+locket&pro=true&from=pcHomeContent",
  },
  {
    name: "Influencer POVs holder",
    inspirationUrl: "https://www.instagram.com/p/DQuL2JDgLzh/",
  },
  {
    name: "Emo Robot",
    inspirationUrl: "https://www.youtube.com/watch?v=IKS2vNOcZ7A&list=LL&index=12",
    alibabaStatus: "Available",
    alibabaUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=talking+robot&pro=true&from=pcHomeContent",
  },
  {
    name: "Miniature Building Construction",
    inspirationUrl: "https://www.youtube.com/watch?v=tZnbyx5Rv40&list=LL&index=19",
    alibabaStatus: "Can't find",
  },
  {
    name: "Cup with Candle to provide heat from below",
    inspirationUrl: "https://www.youtube.com/watch?v=4XYjIGbDhUs&list=LL&index=86",
    alibabaStatus: "Can't find",
  },
  {
    name: "Digital Microscope with screen",
    inspirationUrl: "https://www.youtube.com/watch?v=cAFXQSb8v_w&list=LL&index=92",
    alibabaStatus: "Available",
    alibabaUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=handheld+Digital+Microscope+with+screen&pro=true&from=pcHomeContent",
  },
  {
    name: "Bitcoin Miner",
    inspirationUrl: "https://www.youtube.com/watch?v=zDNFxEpirgY&list=LL&index=161",
  },
];

const SEARCH_QUERY_OVERRIDES = {
  "ring, bracelet - 2 in one": "ring bracelet 2 in 1 convertible",
  "Spider Web in real life": "spiderman web shooter",
  "Instgram Share using RFID locket": "instagram rfid locket social sharing",
  "Influencer POVs holder": "phone pov holder tripod wearable",
  "Cup with Candle to provide heat from below": "candle coffee mug warmer cup",
};

const DEMAND_KEYWORDS = [
  "robot",
  "alarm",
  "clock",
  "rfid",
  "miner",
  "microscope",
  "printing",
  "spider",
  "holder",
  "gym",
];

const MARGIN_KEYWORDS = [
  "bot",
  "robot",
  "rfid",
  "microscope",
  "miner",
  "clock",
  "bracelet",
  "web",
  "mask",
];

const DIFFICULTY_HIGH_KEYWORDS = [
  "rfid",
  "miner",
  "microscope",
  "robot",
  "printing",
  "construction",
];

const DIFFICULTY_LOW_KEYWORDS = [
  "bracelet",
  "mask",
  "holder",
  "cup",
  "clock",
  "roti",
];

const SEED_SUPPLIER_TEMPLATES = [
  {
    id: "sup-ring-1",
    productSlug: "ring-bracelet-2-in-one",
    supplierName: "Shenzhen Charm Accessories Co., Ltd.",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=ring%2C+bracelet+2+convertible&pro=true&from=pcHomeContent",
    unitPrice: 1.35,
    moq: 300,
    rating: 4.8,
    leadTimeDays: 12,
    responseEtaHours: 6,
    notes: "Convertible ring-bracelet with logo customization and gift-box packaging.",
  },
  {
    id: "sup-ring-2",
    productSlug: "ring-bracelet-2-in-one",
    supplierName: "Yiwu Trendmetal Fashion Factory",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=ring%2C+bracelet+2+convertible&pro=true&from=pcHomeContent",
    unitPrice: 1.55,
    moq: 180,
    rating: 4.6,
    leadTimeDays: 10,
    responseEtaHours: 9,
    notes: "Lower MOQ option with fewer color variants.",
  },
  {
    id: "sup-clock-1",
    productSlug: "car-alarm-clock",
    supplierName: "Dongguan Creative Gadget Works",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/product-detail/Hypercar-Alarm-Clock-LED-Display-Realistic_1601688575767.html?spm=a2700.prosearch.normal_offer.d_image.4d0b67afmzSSIT&priceId=b88a2a183f484f94a2bd77e6d65d9b19",
    unitPrice: 8.9,
    moq: 120,
    rating: 4.7,
    leadTimeDays: 14,
    responseEtaHours: 4,
    notes: "Hypercar-style alarm clock with custom startup sound.",
  },
  {
    id: "sup-web-1",
    productSlug: "spider-web-in-real-life",
    supplierName: "Guangzhou Action Toy Lab",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=spiderman+web+shooter&pro=true&from=pcHomeContent",
    unitPrice: 2.75,
    moq: 500,
    rating: 4.5,
    leadTimeDays: 15,
    responseEtaHours: 8,
    notes: "Foam-string shooter toy, CE test report available.",
  },
  {
    id: "sup-rfid-1",
    productSlug: "instgram-share-using-rfid-locket",
    supplierName: "Ningbo Smart NFC Products",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=Instgram+Share+using+RFID+locket&pro=true&from=pcHomeContent",
    unitPrice: 1.95,
    moq: 400,
    rating: 4.9,
    leadTimeDays: 16,
    responseEtaHours: 5,
    notes: "NTAG213 chipset, supports URL writes before dispatch.",
  },
  {
    id: "sup-robot-1",
    productSlug: "emo-robot",
    supplierName: "Shenzhen AI Companion Robotics",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=talking+robot&pro=true&from=pcHomeContent",
    unitPrice: 23.5,
    moq: 80,
    rating: 4.7,
    leadTimeDays: 25,
    responseEtaHours: 12,
    notes: "Voice interaction model with English prompt pack preloaded.",
  },
  {
    id: "sup-micro-1",
    productSlug: "digital-microscope-with-screen",
    supplierName: "Fujian Optics Instrument Co.",
    platform: "Alibaba",
    supplierUrl:
      "https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=handheld+Digital+Microscope+with+screen&pro=true&from=pcHomeContent",
    unitPrice: 17.2,
    moq: 100,
    rating: 4.8,
    leadTimeDays: 13,
    responseEtaHours: 6,
    notes: "4.3-inch display microscope with rechargeable battery pack.",
  },
];

function tokenize(input) {
  return String(input || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);
}

function countHits(tokens, words) {
  return words.reduce((count, word) => count + (tokens.includes(word) ? 1 : 0), 0);
}

export function normalizeAvailabilityStatus(input) {
  const text = String(input || "").trim().toLowerCase();
  if (!text) return AvailabilityStatus.UNKNOWN;
  if (text.includes("available") && text.includes("too much variety")) return AvailabilityStatus.NEEDS_REVIEW;
  if (text.includes("available")) return AvailabilityStatus.AVAILABLE;
  if (text.includes("can't find") || text.includes("not found")) return AvailabilityStatus.NOT_FOUND;
  if (text.includes("needs review")) return AvailabilityStatus.NEEDS_REVIEW;
  return AvailabilityStatus.UNKNOWN;
}

export function availabilityLabel(status) {
  switch (status) {
    case AvailabilityStatus.AVAILABLE:
      return "Available";
    case AvailabilityStatus.NEEDS_REVIEW:
      return "Needs Review";
    case AvailabilityStatus.NOT_FOUND:
      return "Not Found";
    default:
      return "Not Checked";
  }
}

export function availabilityBadgeClass(status) {
  switch (status) {
    case AvailabilityStatus.AVAILABLE:
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case AvailabilityStatus.NEEDS_REVIEW:
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case AvailabilityStatus.NOT_FOUND:
      return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    default:
      return "bg-white/10 text-white/70 border-white/15";
  }
}

export function buildAlibabaSearchUrl(query) {
  const text = String(query || "").trim();
  if (!text) return "";
  const encoded = encodeURIComponent(text);
  return `https://www.alibaba.com/search/page?spm=a2700.prosearch.the-new-header_fy23_pc_search_bar.keydown__Enter&SearchScene=proSearch&SearchText=${encoded}&pro=true&from=pcHomeContent`;
}

export function deriveSearchQuery(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "";
  if (SEARCH_QUERY_OVERRIDES[trimmed]) return SEARCH_QUERY_OVERRIDES[trimmed];
  return trimmed
    .replace(/[,-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function deriveDiscoveryMetrics(name, status) {
  const tokens = tokenize(name);
  const demandHits = countHits(tokens, DEMAND_KEYWORDS);
  const marginHits = countHits(tokens, MARGIN_KEYWORDS);
  const hardHits = countHits(tokens, DIFFICULTY_HIGH_KEYWORDS);
  const easyHits = countHits(tokens, DIFFICULTY_LOW_KEYWORDS);

  const demandScore = clamp(44 + demandHits * 11 + (tokens.length > 3 ? 4 : 0), 25, 96);
  const marginScore = clamp(40 + marginHits * 10 + demandHits * 3, 20, 96);
  const sourcingDifficultyScore = clamp(32 + hardHits * 15 - easyHits * 7, 10, 95);
  const priorityScore = clamp(
    Math.round((demandScore + marginScore) / 2 - sourcingDifficultyScore * 0.28 + (status === AvailabilityStatus.AVAILABLE ? 8 : 0)),
    1,
    99,
  );

  return {
    demandScore,
    marginScore,
    sourcingDifficultyScore,
    priorityScore,
  };
}

export function sourcingDifficultyLabel(score) {
  const numeric = Number(score || 0);
  if (numeric <= 33) return "Easy";
  if (numeric <= 62) return "Medium";
  return "Hard";
}

function createOpportunity(raw, index) {
  const status = normalizeAvailabilityStatus(raw.alibabaStatus);
  const slug = slugify(raw.name) || `idea-${index + 1}`;
  const searchQuery = deriveSearchQuery(raw.name);
  const metrics = deriveDiscoveryMetrics(raw.name, status);

  return {
    id: `idea-${String(index + 1).padStart(3, "0")}-${slug.slice(0, 24)}`,
    slug,
    name: raw.name,
    inspirationUrl: raw.inspirationUrl,
    searchQuery,
    alibabaStatus: status,
    alibabaUrl: raw.alibabaUrl || (searchQuery ? buildAlibabaSearchUrl(searchQuery) : ""),
    notes: status === AvailabilityStatus.NEEDS_REVIEW ? "Multiple variants found. Manual product filtering is required." : "",
    lastCheckedAt: null,
    ...metrics,
  };
}

function buildSeedSuppliers(products) {
  const bySlug = new Map(products.map((product) => [product.slug, product]));
  return SEED_SUPPLIER_TEMPLATES.map((template) => {
    const product = bySlug.get(template.productSlug);
    if (!product) return null;
    return {
      id: template.id,
      productId: product.id,
      productName: product.name,
      supplierName: template.supplierName,
      platform: template.platform,
      supplierUrl: template.supplierUrl,
      unitPrice: template.unitPrice,
      moq: template.moq,
      rating: template.rating,
      leadTimeDays: template.leadTimeDays,
      responseEtaHours: template.responseEtaHours,
      notes: template.notes,
      createdAt: new Date().toISOString(),
    };
  }).filter(Boolean);
}

function mergeById(seedItems, existingItems) {
  const merged = new Map(seedItems.map((item) => [item.id, item]));
  existingItems.forEach((item) => {
    if (!item || !item.id) return;
    merged.set(item.id, { ...(merged.get(item.id) || {}), ...item });
  });
  return Array.from(merged.values());
}

export function createInitialProcurementWorkspace() {
  const products = RAW_PRODUCT_REFERENCES.map((raw, index) => createOpportunity(raw, index));
  const suppliers = buildSeedSuppliers(products);
  return {
    version: 1,
    products,
    suppliers,
    negotiations: [],
    quoteSummaries: [],
    costCalculations: [],
    supplierMessages: [],
    updatedAt: new Date().toISOString(),
  };
}

export function mergeProcurementWorkspace(stored) {
  const seed = createInitialProcurementWorkspace();
  if (!stored || typeof stored !== "object") {
    return seed;
  }

  const products = mergeById(seed.products, Array.isArray(stored.products) ? stored.products : []);
  const suppliers = mergeById(seed.suppliers, Array.isArray(stored.suppliers) ? stored.suppliers : []);
  const negotiations = Array.isArray(stored.negotiations) ? stored.negotiations : [];
  const quoteSummaries = Array.isArray(stored.quoteSummaries) ? stored.quoteSummaries : [];
  const costCalculations = Array.isArray(stored.costCalculations) ? stored.costCalculations : [];
  const supplierMessages = Array.isArray(stored.supplierMessages) ? stored.supplierMessages : [];

  return {
    ...seed,
    ...stored,
    products,
    suppliers,
    negotiations,
    quoteSummaries,
    costCalculations,
    supplierMessages,
    updatedAt: new Date().toISOString(),
  };
}

export function createManualOpportunity({ name, inspirationUrl }) {
  const baseName = String(name || "").trim();
  const baseUrl = String(inspirationUrl || "").trim();
  const slug = slugify(baseName) || `idea-${Date.now()}`;
  const searchQuery = deriveSearchQuery(baseName);
  const metrics = deriveDiscoveryMetrics(baseName, AvailabilityStatus.UNKNOWN);

  return {
    id: `idea-manual-${Date.now()}-${slug.slice(0, 18)}`,
    slug,
    name: baseName,
    inspirationUrl: baseUrl,
    searchQuery,
    alibabaStatus: AvailabilityStatus.UNKNOWN,
    alibabaUrl: searchQuery ? buildAlibabaSearchUrl(searchQuery) : "",
    notes: "",
    lastCheckedAt: null,
    ...metrics,
  };
}

export function createManualSupplierLead({
  productId,
  productName,
  supplierName,
  platform,
  supplierUrl,
  unitPrice,
  moq,
  rating,
  leadTimeDays,
  responseEtaHours,
  notes,
}) {
  return {
    id: `sup-manual-${Date.now()}-${slugify(supplierName).slice(0, 16)}`,
    productId,
    productName,
    supplierName,
    platform: platform || "Alibaba",
    supplierUrl: supplierUrl || "",
    unitPrice: Number(unitPrice || 0),
    moq: Number(moq || 1),
    rating: Number(rating || 4),
    leadTimeDays: Number(leadTimeDays || 14),
    responseEtaHours: Number(responseEtaHours || 24),
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };
}

export function buildNegotiationInput({ productName, supplier, targetUnitPrice, targetMoq, currency = "USD" }) {
  return {
    productName,
    supplierName: supplier.supplierName,
    supplierPlatform: supplier.platform || "Alibaba",
    currentOffer: {
      unitPrice: Number(supplier.unitPrice || 0),
      moq: Number(supplier.moq || 0),
      currency,
    },
    targetOffer: {
      unitPrice: Number(targetUnitPrice || 0),
      moq: Number(targetMoq || 0),
      currency,
    },
    notes: supplier.notes || "",
  };
}

export function simulateSupplierNegotiation({
  productName,
  supplier,
  targetUnitPrice,
  targetMoq,
  currency = "USD",
}) {
  const normalizedTargetPrice = Math.max(0.01, Number(targetUnitPrice || 0));
  const normalizedTargetMoq = Math.max(1, Math.round(Number(targetMoq || 1)));
  let currentPrice = Math.max(normalizedTargetPrice, Number(supplier.unitPrice || normalizedTargetPrice));
  let currentMoq = Math.max(normalizedTargetMoq, Math.round(Number(supplier.moq || normalizedTargetMoq)));
  const rounds = [];

  for (let round = 1; round <= 3; round += 1) {
    const priceGap = currentPrice - normalizedTargetPrice;
    const moqGap = currentMoq - normalizedTargetMoq;
    const canClose = priceGap <= normalizedTargetPrice * 0.06 && moqGap <= normalizedTargetMoq * 0.2;

    const buyerMessage = `Round ${round}: Requesting ${normalizedTargetMoq} units at ${currency} ${normalizedTargetPrice.toFixed(2)} per unit for ${productName}.`;
    if (canClose) {
      rounds.push({
        round,
        buyerMessage,
        supplierCounter: `We can close at ${currency} ${currentPrice.toFixed(2)} with MOQ ${currentMoq}.`,
      });
      break;
    }

    const priceConcession = priceGap > 0 ? Math.max(priceGap * 0.4, currentPrice * 0.03) : 0;
    const moqConcession = moqGap > 0 ? Math.max(Math.round(moqGap * 0.35), 5) : 0;

    currentPrice = Number(Math.max(normalizedTargetPrice * 0.94, currentPrice - priceConcession).toFixed(2));
    currentMoq = Math.max(Math.round(normalizedTargetMoq * 0.75), currentMoq - moqConcession);

    rounds.push({
      round,
      buyerMessage,
      supplierCounter: `Counter-offer: ${currency} ${currentPrice.toFixed(2)} per unit with MOQ ${currentMoq}.`,
    });
  }

  const status =
    currentPrice <= normalizedTargetPrice * 1.08 && currentMoq <= normalizedTargetMoq * 1.25
      ? "agreed"
      : "needs-follow-up";
  const orderQty = Math.max(normalizedTargetMoq, currentMoq);
  const totalQuote = Number((orderQty * currentPrice).toFixed(2));

  const pricePenalty = ((currentPrice - normalizedTargetPrice) / normalizedTargetPrice) * 45;
  const moqPenalty = ((currentMoq - normalizedTargetMoq) / normalizedTargetMoq) * 35;
  const ratingBonus = Math.max(0, (Number(supplier.rating || 4) - 3) * 8);
  const score = clamp(Math.round(100 - pricePenalty - moqPenalty + ratingBonus), 1, 100);

  return {
    supplierId: supplier.id,
    supplierName: supplier.supplierName,
    status,
    rounds,
    finalUnitPrice: currentPrice,
    finalMoq: currentMoq,
    totalQuote,
    score,
    leadTimeDays: Number(supplier.leadTimeDays || 0),
    responseEtaHours: Number(supplier.responseEtaHours || 0),
  };
}

export function buildBuyerQuoteSummary({ productName, supplierName, currency = "USD", unitPrice, moq, totalQuote }) {
  const safeUnit = Number(unitPrice || 0).toFixed(2);
  const safeTotal = Number(totalQuote || 0).toFixed(2);
  return `${productName}: ${supplierName} quoted ${currency} ${safeUnit}/unit at MOQ ${Number(moq || 0)} (total ${currency} ${safeTotal}).`;
}
