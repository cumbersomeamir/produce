"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { products as seedProducts } from "@/lib/mock-data";

function normalizeProducts(list = []) {
  return list.map((item, index) => ({
    ...item,
    id: String(item.id || `prod-upsell-${index}`),
    slug: String(item.slug || `product-${index}`),
    name: String(item.name || "Product"),
    shortDescription: String(item.shortDescription || "OddFinds product."),
    images: Array.isArray(item.images) && item.images.length
      ? item.images
      : [`https://picsum.photos/seed/upsell-${index}/1000/1000`],
    price: Number(item.price || 0),
    compareAtPrice: Number(item.compareAtPrice || item.price || 0),
    inventory: Number(item.inventory || 0),
    lowStockThreshold: Number(item.lowStockThreshold || 5),
    rating: Number(item.rating || 4.5),
    reviewCount: Number(item.reviewCount || 0),
    isFeatured: Boolean(item.isFeatured),
    isNew: Boolean(item.isNew),
    tags: Array.isArray(item.tags) ? item.tags : [],
  }));
}

function pickUpsells(products = []) {
  const normalized = normalizeProducts(products);
  const featured = normalized.filter(
    (item) => item.isFeatured || item.tags.includes("trending"),
  );
  const source = featured.length ? featured : normalized;
  return source.slice(0, 3);
}

export default function UpsellBanner() {
  const [products, setProducts] = useState(() => normalizeProducts(seedProducts));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (!response.ok) return;

        const payload = await response.json();
        if (!cancelled && Array.isArray(payload?.data) && payload.data.length) {
          setProducts(normalizeProducts(payload.data));
        }
      } catch {
        // Keep fallback seed data in the upsell if API is unavailable.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const picks = useMemo(() => pickUpsells(products), [products]);

  if (!picks.length) return null;

  return (
    <section className="mt-10">
      <h3 className="mb-4 font-heading text-2xl text-secondary">You might also like</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
