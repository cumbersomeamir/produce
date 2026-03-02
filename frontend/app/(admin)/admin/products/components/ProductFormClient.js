"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const defaultProduct = {
  id: "",
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "tech-oddities",
  inventory: "",
  lowStockThreshold: "",
  sku: "",
  image: "",
  isNew: true,
  isFeatured: false,
};

function normalizeInitial(initial) {
  if (!initial) return defaultProduct;
  return {
    ...defaultProduct,
    ...initial,
    image: initial.images?.[0] || "",
  };
}

export default function ProductFormClient({ mode = "create", initialProduct, categories }) {
  const router = useRouter();
  const [form, setForm] = useState(() => normalizeInitial(initialProduct));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submitLabel = useMemo(() => (mode === "edit" ? "Update Product" : "Create Product"), [mode]);

  function onChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        compareAtPrice: Number(form.compareAtPrice || 0),
        inventory: Number(form.inventory || 0),
        lowStockThreshold: Number(form.lowStockThreshold || 0),
      };

      const response = await fetch("/api/admin/products", {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Could not save product.");
      }

      const data = await response.json();
      const productId = data?.data?.id || form.id;
      setMessage("Product saved successfully.");
      router.refresh();
      if (mode === "create" && productId) {
        router.push(`/admin/products/${productId}`);
      }
    } catch (submitError) {
      setError(submitError.message || "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:grid-cols-2">
      <input
        placeholder="Product name"
        value={form.name}
        onChange={(event) => onChange("name", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        required
      />
      <input
        placeholder="Slug"
        value={form.slug}
        onChange={(event) => onChange("slug", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      />
      <input
        placeholder="Price"
        value={form.price}
        onChange={(event) => onChange("price", event.target.value)}
        type="number"
        min="0"
        step="0.01"
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      />
      <input
        placeholder="Compare-at Price"
        value={form.compareAtPrice}
        onChange={(event) => onChange("compareAtPrice", event.target.value)}
        type="number"
        min="0"
        step="0.01"
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      />
      <select
        value={form.category}
        onChange={(event) => onChange("category", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      >
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(event) => onChange("sku", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      />
      <input
        placeholder="Inventory"
        value={form.inventory}
        onChange={(event) => onChange("inventory", event.target.value)}
        type="number"
        min="0"
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      />
      <input
        placeholder="Low stock threshold"
        value={form.lowStockThreshold}
        onChange={(event) => onChange("lowStockThreshold", event.target.value)}
        type="number"
        min="0"
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
      />
      <input
        placeholder="Primary image URL"
        value={form.image}
        onChange={(event) => onChange("image", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 lg:col-span-2"
      />
      <input
        placeholder="Short description"
        value={form.shortDescription}
        onChange={(event) => onChange("shortDescription", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 lg:col-span-2"
      />
      <textarea
        placeholder="Description"
        rows={5}
        value={form.description}
        onChange={(event) => onChange("description", event.target.value)}
        className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 lg:col-span-2"
      />
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(form.isNew)}
          onChange={(event) => onChange("isNew", event.target.checked)}
        />
        Mark as new
      </label>
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={Boolean(form.isFeatured)}
          onChange={(event) => onChange("isFeatured", event.target.checked)}
        />
        Mark as featured
      </label>
      <div className="lg:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
      {error ? <p className="text-sm text-error lg:col-span-2">{error}</p> : null}
      {message ? <p className="text-sm text-success lg:col-span-2">{message}</p> : null}
    </form>
  );
}

