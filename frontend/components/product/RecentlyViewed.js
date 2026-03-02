"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/mock-data";

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("oddfinds-recent") || "[]";
    const ids = JSON.parse(raw);
    setItems(products.filter((product) => ids.includes(product.id)).slice(0, 4));
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
