"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/lib/mock-data";

function updateParams(current, next) {
  const params = new URLSearchParams(current);
  Object.entries(next).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });
  return params.toString();
}

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      availability: searchParams.get("availability") || "",
      rating: searchParams.get("rating") || "",
    }),
    [searchParams],
  );

  const apply = (field, value) => {
    const query = updateParams(searchParams.toString(), { [field]: value, page: 1 });
    router.push(`${pathname}?${query}`);
  };

  return (
    <aside className="space-y-5 rounded-2xl border border-border bg-surface p-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Category</p>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => apply("category", "")}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${!active.category ? "bg-surface-elevated" : ""}`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => apply("category", category.slug)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${active.category === category.slug ? "bg-surface-elevated" : ""}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Availability</p>
        <div className="space-y-1 text-sm">
          <button
            type="button"
            onClick={() => apply("availability", "")}
            className={`block w-full rounded-lg px-3 py-2 text-left ${!active.availability ? "bg-surface-elevated" : ""}`}
          >
            Any
          </button>
          <button
            type="button"
            onClick={() => apply("availability", "in-stock")}
            className={`block w-full rounded-lg px-3 py-2 text-left ${active.availability === "in-stock" ? "bg-surface-elevated" : ""}`}
          >
            In stock
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Rating</p>
        <div className="space-y-1 text-sm">
          {[4, 3, 2].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => apply("rating", value)}
              className={`block w-full rounded-lg px-3 py-2 text-left ${active.rating === String(value) ? "bg-surface-elevated" : ""}`}
            >
              {value}+ Stars
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
