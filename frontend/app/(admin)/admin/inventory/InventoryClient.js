"use client";

import { useMemo, useState } from "react";

export default function InventoryClient({ initialItems }) {
  const [items, setItems] = useState(initialItems || []);
  const [savingId, setSavingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const lowCount = useMemo(
    () => items.filter((item) => item.quantity <= item.lowStockThreshold).length,
    [items],
  );

  function updateQuantity(id, value) {
    const numeric = Number(value || 0);
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: Number.isFinite(numeric) ? numeric : item.quantity } : item)),
    );
  }

  async function saveItem(id) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    setSavingId(id);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity: item.quantity }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Could not save quantity.");
      setMessage(`Saved inventory for ${item.name}.`);
    } catch (saveError) {
      setError(saveError.message || "Could not save quantity.");
    } finally {
      setSavingId("");
    }
  }

  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Inventory</h1>
      <p className="mt-2 text-sm">Low stock products: {lowCount}</p>

      {message ? <p className="mt-3 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="mt-3 rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="mt-4 space-y-2">
        {items.map((product) => (
          <div
            key={product.id}
            className={`rounded-xl border p-3 ${
              product.quantity <= product.lowStockThreshold ? "border-red-400 bg-red-500/10" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p>{product.name}</p>
                <p className="text-xs text-white/70">Threshold: {product.lowStockThreshold}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={product.quantity}
                  onChange={(event) => updateQuantity(product.id, event.target.value)}
                  className="w-24 rounded border border-white/20 bg-[#0f1022] px-2 py-1 text-sm"
                  type="number"
                  min="0"
                />
                <button
                  type="button"
                  disabled={savingId === product.id}
                  onClick={() => saveItem(product.id)}
                  className="rounded bg-accent px-3 py-1 text-xs font-semibold text-secondary disabled:opacity-60"
                >
                  {savingId === product.id ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

