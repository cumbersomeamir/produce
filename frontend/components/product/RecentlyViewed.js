"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const raw = localStorage.getItem("oddfinds-recent") || "[]";
      const ids = JSON.parse(raw);
      const response = await fetch("/api/products", { cache: "no-store" });
      const payload = await response.json();
      const products = payload?.data || [];
      setItems(products.filter((product) => ids.includes(product.id)).slice(0, 4));
    }
    load();
  }, []);

  if (!items.length) return null;

  return (
    <section className="mt-12">
      <h3 className="mb-4 font-heading text-2xl text-secondary">Recently Viewed</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
