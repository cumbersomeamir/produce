"use client";

import { useState } from "react";
import ReviewSection from "@/components/product/ReviewSection";

const tabs = ["Description", "Specifications", "Shipping Info", "Reviews"];

export default function ProductDetailsTabs({ product, reviews }) {
  const [active, setActive] = useState("Description");

  return (
    <section className="mt-10">
      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`rounded-lg px-3 py-1.5 text-sm ${active === tab ? "bg-secondary text-white" : "bg-surface-elevated"}`}
          >
            {tab === "Reviews" ? `Reviews (${reviews.length})` : tab}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
        {active === "Description" ? <p className="text-sm text-text-muted">{product.description}</p> : null}

        {active === "Specifications" ? (
          <ul className="space-y-1 text-sm text-text-muted">
            <li>SKU: {product.sku}</li>
            <li>Weight: {product.weight} grams</li>
            <li>
              Dimensions: {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
            </li>
          </ul>
        ) : null}

        {active === "Shipping Info" ? (
          <ul className="space-y-1 text-sm text-text-muted">
            <li>Domestic shipping in 2-5 business days.</li>
            <li>International shipping in 8-14 business days.</li>
            <li>Free domestic shipping above ₹999.</li>
          </ul>
        ) : null}

        {active === "Reviews" ? <ReviewSection reviews={reviews} /> : null}
      </div>
    </section>
  );
}
