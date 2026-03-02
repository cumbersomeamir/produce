"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/stores/uiStore";

export default function SearchOverlay() {
  const isOpen = useUiStore((state) => state.isSearchOpen);
  const close = useUiStore((state) => state.closeSearch);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const response = await fetch("/api/products", { cache: "no-store" });
      const payload = await response.json();
      setProducts(payload?.data || []);
    }
    loadProducts();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.tags.some((tag) => tag.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query, products]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="mx-auto mt-10 w-full max-w-2xl rounded-2xl bg-surface p-5 shadow-elevated"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-heading text-lg">Search OddFinds</p>
              <button type="button" onClick={close} className="text-sm">
                Close
              </button>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for weird products"
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
            />
            <div className="mt-4 space-y-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={close}
                  className="block rounded-lg border border-border px-3 py-2 hover:bg-surface-elevated"
                >
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.shortDescription}</p>
                </Link>
              ))}
              {!results.length && query ? (
                <p className="text-sm text-text-muted">No matches found. Try another keyword.</p>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
