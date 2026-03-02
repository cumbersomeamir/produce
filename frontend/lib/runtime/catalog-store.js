import { categories, products as seedProducts } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";

const CATALOG_KEY = "__ODDFINDS_RUNTIME_CATALOG__";

function clone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function getStore() {
  if (!globalThis[CATALOG_KEY]) {
    globalThis[CATALOG_KEY] = {
      products: clone(seedProducts),
      updatedAt: new Date().toISOString(),
    };
  }
  return globalThis[CATALOG_KEY];
}

function ensureUniqueSlug(slug, excludeId = "") {
  const store = getStore();
  const base = slugify(slug || "product") || "product";
  let attempt = base;
  let index = 1;

  while (store.products.some((product) => product.slug === attempt && product.id !== excludeId)) {
    index += 1;
    attempt = `${base}-${index}`;
  }
  return attempt;
}

function normalizeCategory(categorySlug) {
  const exists = categories.some((category) => category.slug === categorySlug);
  return exists ? categorySlug : categories[0]?.slug || "tech-oddities";
}

function normalizeProductInput(input = {}, existing = null) {
  const basePrice = Number(input.price ?? existing?.price ?? 0);
  const price = Number.isFinite(basePrice) ? Math.max(0, basePrice) : 0;
  const compareAtPriceRaw = Number(input.compareAtPrice ?? existing?.compareAtPrice ?? price);
  const compareAtPrice = Number.isFinite(compareAtPriceRaw) ? Math.max(price, compareAtPriceRaw) : price;
  const inventoryRaw = Number(input.inventory ?? existing?.inventory ?? 0);
  const inventory = Number.isFinite(inventoryRaw) ? Math.max(0, Math.round(inventoryRaw)) : 0;
  const lowStockRaw = Number(input.lowStockThreshold ?? existing?.lowStockThreshold ?? 5);
  const lowStockThreshold = Number.isFinite(lowStockRaw) ? Math.max(0, Math.round(lowStockRaw)) : 5;

  const name = String(input.name ?? existing?.name ?? "").trim() || "Untitled Product";
  const shortDescription =
    String(input.shortDescription ?? existing?.shortDescription ?? "").trim() || `${name} from OddFinds.`;
  const description =
    String(input.description ?? existing?.description ?? "").trim() || shortDescription;
  const category = normalizeCategory(String(input.category ?? existing?.category ?? ""));
  const sku = String(input.sku ?? existing?.sku ?? "").trim() || `ODF-${Date.now()}`;
  const imageUrl = String(input.image ?? "").trim();
  const images = Array.isArray(input.images) && input.images.length
    ? input.images
    : imageUrl
      ? [imageUrl, imageUrl]
      : existing?.images?.length
        ? existing.images
        : [
            `https://picsum.photos/seed/${slugify(name)}-1/1000/1000`,
            `https://picsum.photos/seed/${slugify(name)}-2/1000/1000`,
          ];

  const tags = Array.isArray(input.tags)
    ? input.tags
    : String(input.tags ?? existing?.tags?.join(",") ?? "")
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

  return {
    ...existing,
    name,
    slug: ensureUniqueSlug(String(input.slug ?? existing?.slug ?? name), existing?.id || ""),
    shortDescription,
    description,
    price,
    compareAtPrice,
    sku,
    images,
    category,
    tags,
    inventory,
    lowStockThreshold,
    rating: Number(existing?.rating ?? 4.5),
    reviewCount: Number(existing?.reviewCount ?? 0),
    fakeViewers: Number(existing?.fakeViewers ?? 12),
    sold24h: Number(existing?.sold24h ?? 0),
    isFeatured: Boolean(input.isFeatured ?? existing?.isFeatured ?? false),
    isNew: Boolean(input.isNew ?? existing?.isNew ?? true),
    weight: Number(input.weight ?? existing?.weight ?? 250),
    dimensions: existing?.dimensions || { length: 10, width: 10, height: 10 },
  };
}

export function listProducts() {
  return clone(getStore().products);
}

export function findProductById(id) {
  const product = getStore().products.find((item) => item.id === id);
  return product ? clone(product) : null;
}

export function findProductBySlug(slug) {
  const product = getStore().products.find((item) => item.slug === slug);
  return product ? clone(product) : null;
}

export function createProduct(input) {
  const store = getStore();
  const product = normalizeProductInput(input);
  const created = {
    ...product,
    id: `prod-${Date.now()}`,
  };
  store.products.unshift(created);
  store.updatedAt = new Date().toISOString();
  return clone(created);
}

export function updateProduct(id, input) {
  const store = getStore();
  const index = store.products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  const current = store.products[index];
  const next = normalizeProductInput(input, current);
  store.products[index] = next;
  store.updatedAt = new Date().toISOString();
  return clone(next);
}

export function updateProductInventory(id, quantity) {
  const store = getStore();
  const index = store.products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  const normalized = Math.max(0, Math.round(Number(quantity || 0)));
  store.products[index] = {
    ...store.products[index],
    inventory: normalized,
  };
  store.updatedAt = new Date().toISOString();
  return clone(store.products[index]);
}

export function categoryList() {
  return clone(categories);
}

