import { products as seedProducts } from "@/lib/mock-data";
import {
  findProductById as runtimeFindProductById,
  findProductBySlug as runtimeFindProductBySlug,
  listProducts as runtimeListProducts,
} from "@/lib/runtime/catalog-store";

const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4000";

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeMediaUrls(value, fallback = []) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  const urls = list
    .map((item) => String(item || "").trim())
    .filter((item) => item.startsWith("http://") || item.startsWith("https://"));

  if (!urls.length) return fallback;
  return Array.from(new Set(urls));
}

function normalizeTags(value = []) {
  const list = Array.isArray(value) ? value : String(value || "").split(",");
  return Array.from(
    new Set(
      list
        .map((item) => String(item || "").trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function defaultMedia(slug, suffix = "1") {
  return `https://picsum.photos/seed/${slug || "oddfinds"}-${suffix}/1000/1000`;
}

function normalizeProduct(input = {}, index = 0) {
  const safeName = String(input.name || `Product ${index + 1}`).trim() || `Product ${index + 1}`;
  const safeSlug =
    String(input.slug || "")
      .trim()
      .toLowerCase() ||
    `product-${index + 1}`;
  const images = normalizeMediaUrls(input.images || input.image, [
    defaultMedia(safeSlug, "1"),
    defaultMedia(safeSlug, "2"),
  ]);
  const videos = normalizeMediaUrls(input.videos, []);
  const tags = normalizeTags(input.tags);
  const basePrice = Math.max(0, toNumber(input.price, 0));
  const compareAt = Math.max(basePrice, toNumber(input.compareAtPrice, basePrice));

  return {
    ...input,
    id: String(input.id || `prod-${safeSlug || index + 1}`),
    name: safeName,
    slug: safeSlug,
    shortDescription:
      String(input.shortDescription || "").trim() || `${safeName} from OddFinds.`,
    description:
      String(input.description || "").trim() ||
      String(input.shortDescription || "").trim() ||
      `${safeName} from OddFinds.`,
    category: String(input.category || input.categorySlug || "tech-oddities"),
    categorySlug: String(input.categorySlug || input.category || "tech-oddities"),
    price: basePrice,
    compareAtPrice: compareAt,
    sku: String(input.sku || "").trim() || `ODF-${safeSlug || index + 1}`,
    images,
    videos,
    tags,
    inventory: Math.max(0, Math.round(toNumber(input.inventory, 0))),
    lowStockThreshold: Math.max(0, Math.round(toNumber(input.lowStockThreshold, 5))),
    rating: Math.min(5, Math.max(0, toNumber(input.rating, 4.5))),
    reviewCount: Math.max(0, Math.round(toNumber(input.reviewCount, 0))),
    fakeViewers: Math.max(0, Math.round(toNumber(input.fakeViewers, 12))),
    sold24h: Math.max(0, Math.round(toNumber(input.sold24h, 0))),
    isFeatured: toBoolean(input.isFeatured, false),
    isNew: toBoolean(input.isNew, false),
    weight: Math.max(0, toNumber(input.weight, 250)),
    dimensions: input.dimensions || { length: 10, width: 10, height: 10 },
    createdAt: input.createdAt || null,
    updatedAt: input.updatedAt || null,
  };
}

function normalizeProducts(list = []) {
  return list.map((item, index) => normalizeProduct(item, index));
}

function runtimeFallbackProducts() {
  try {
    return normalizeProducts(runtimeListProducts());
  } catch {
    return normalizeProducts(seedProducts);
  }
}

function applyProductFilters(list, options = {}) {
  const category = String(options.category || "").trim();
  const query = String(options.query || "").trim().toLowerCase();
  let products = [...list];

  if (category) products = products.filter((item) => item.category === category);
  if (query) products = products.filter((item) => item.name.toLowerCase().includes(query));

  return products;
}

export async function getCatalogProducts(options = {}) {
  const category = String(options.category || "").trim();
  const query = String(options.query || "").trim();

  try {
    const search = new URLSearchParams();
    if (category) search.set("category", category);
    if (query) search.set("query", query);

    const endpoint = `${BACKEND_API_URL}/api/products${search.toString() ? `?${search.toString()}` : ""}`;
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) throw new Error(`backend returned ${response.status}`);

    const payload = await response.json();
    if (Array.isArray(payload?.data)) {
      return normalizeProducts(payload.data);
    }
    throw new Error("invalid backend response shape");
  } catch {
    const fallback = runtimeFallbackProducts();
    return applyProductFilters(fallback, { category, query });
  }
}

export async function getCatalogProductBySlug(slug) {
  const safeSlug = String(slug || "").trim();
  if (!safeSlug) return null;

  const products = await getCatalogProducts();
  const fromList = products.find((item) => item.slug === safeSlug);
  if (fromList) return fromList;

  try {
    const fallback = runtimeFindProductBySlug(safeSlug);
    return fallback ? normalizeProduct(fallback) : null;
  } catch {
    return null;
  }
}

export async function getCatalogProductById(id) {
  const safeId = String(id || "").trim();
  if (!safeId) return null;

  const products = await getCatalogProducts();
  const fromList = products.find((item) => item.id === safeId);
  if (fromList) return fromList;

  try {
    const fallback = runtimeFindProductById(safeId);
    return fallback ? normalizeProduct(fallback) : null;
  } catch {
    return null;
  }
}

function byNewest(products = []) {
  return [...products].sort((a, b) => {
    const left = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const right = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return right - left;
  });
}

export function getTrendingProducts(products = [], limit = 8, options = {}) {
  const normalized = normalizeProducts(products);
  const explicitTrending = normalized.filter(
    (item) => item.isFeatured || item.tags.includes("trending"),
  );
  const fallbackToAll = Boolean(options.fallbackToAll);
  const source = explicitTrending.length ? explicitTrending : fallbackToAll ? normalized : [];
  return source.slice(0, Math.max(0, Number(limit) || 0));
}

export function getNewArrivalProducts(products = [], limit = 8, options = {}) {
  const normalized = normalizeProducts(products);
  const explicitNew = normalized.filter(
    (item) =>
      item.isNew || item.tags.includes("new") || item.tags.includes("new-arrivals"),
  );
  const fallbackToAll = Boolean(options.fallbackToAll);
  const source = explicitNew.length
    ? byNewest(explicitNew)
    : fallbackToAll
      ? byNewest(normalized)
      : [];
  return source.slice(0, Math.max(0, Number(limit) || 0));
}
