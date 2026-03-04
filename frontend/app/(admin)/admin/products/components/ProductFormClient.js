"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
const HOME_PLACEMENT_OPTIONS = [
  { value: "none", label: "None" },
  { value: "trending", label: "Trending" },
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "trending-new-arrivals", label: "Trending + New Arrivals" },
];

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
  images: [],
  videos: [],
  homePlacement: "none",
  isNew: false,
  isFeatured: false,
};

function inferHomePlacement(input = {}) {
  const isNew = Boolean(input.isNew);
  const isFeatured = Boolean(input.isFeatured);
  if (isNew && isFeatured) return "trending-new-arrivals";
  if (isFeatured) return "trending";
  if (isNew) return "new-arrivals";
  return "none";
}

function placementToFlags(value) {
  if (value === "trending") return { isFeatured: true, isNew: false };
  if (value === "new-arrivals") return { isFeatured: false, isNew: true };
  if (value === "trending-new-arrivals") return { isFeatured: true, isNew: true };
  return { isFeatured: false, isNew: false };
}

function uniqueUrls(values = []) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || "").trim())
        .filter((value) => value.startsWith("http://") || value.startsWith("https://")),
    ),
  );
}

function normalizeInitial(initial) {
  if (!initial) return defaultProduct;
  return {
    ...defaultProduct,
    ...initial,
    homePlacement: HOME_PLACEMENT_OPTIONS.some((option) => option.value === initial.homePlacement)
      ? initial.homePlacement
      : inferHomePlacement(initial),
    images: uniqueUrls(initial.images || (initial.image ? [initial.image] : [])),
    videos: uniqueUrls(initial.videos || []),
  };
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

export default function ProductFormClient({ mode = "create", initialProduct, categories }) {
  const router = useRouter();
  const [form, setForm] = useState(() => normalizeInitial(initialProduct));
  const [pendingFiles, setPendingFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submitLabel = useMemo(() => (mode === "edit" ? "Update Product" : "Create Product"), [mode]);

  function onChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function removeMedia(type, url) {
    setForm((current) => ({
      ...current,
      [type]: current[type].filter((item) => item !== url),
    }));
  }

  function removePendingFile(index) {
    setPendingFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function onMediaSelect(event) {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    const rejected = selected.find((file) => file.size > MAX_FILE_SIZE_BYTES);
    if (rejected) {
      setError(`File exceeds 100MB limit: ${rejected.name}`);
      return;
    }

    const invalidType = selected.find(
      (file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );
    if (invalidType) {
      setError(`Unsupported file type: ${invalidType.type || invalidType.name}`);
      return;
    }

    setError("");
    setPendingFiles((current) => [...current, ...selected]);
    event.target.value = "";
  }

  async function uploadPendingMedia() {
    if (!pendingFiles.length) return { images: [], videos: [] };

    const body = new FormData();
    pendingFiles.forEach((file) => body.append("files", file));

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body,
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.message || "Media upload failed.");
    }

    const uploadedFiles = Array.isArray(payload.files) ? payload.files : [];
    return uploadedFiles.reduce(
      (accumulator, file) => {
        if (String(file.type || "").startsWith("video/")) {
          accumulator.videos.push(file.url);
        } else {
          accumulator.images.push(file.url);
        }
        return accumulator;
      },
      { images: [], videos: [] },
    );
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const uploaded = await uploadPendingMedia();
      const mergedImages = uniqueUrls([...form.images, ...uploaded.images]);
      const mergedVideos = uniqueUrls([...form.videos, ...uploaded.videos]);
      const placementFlags = placementToFlags(form.homePlacement);

      const payload = {
        ...form,
        images: mergedImages,
        videos: mergedVideos,
        isFeatured: placementFlags.isFeatured,
        isNew: placementFlags.isNew,
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

      setForm((current) => ({
        ...current,
        images: mergedImages,
        videos: mergedVideos,
      }));
      setPendingFiles([]);
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

      <div className="rounded-lg border border-white/15 bg-white/5 p-3 lg:col-span-2">
        <p className="text-sm font-semibold">Product Media</p>
        <p className="mt-1 text-xs text-white/70">
          Upload multiple images or videos from your system. Max file size: 100MB each.
        </p>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={onMediaSelect}
          className="mt-3 w-full rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 text-sm"
        />

        {pendingFiles.length ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Pending Uploads</p>
            {pendingFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs">
                <span className="truncate">
                  {file.name} ({formatFileSize(file.size)})
                </span>
                <button
                  type="button"
                  onClick={() => removePendingFile(index)}
                  className="rounded border border-white/20 px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {form.images.length ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Images</p>
            {form.images.map((url) => (
              <div key={url} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs">
                <a href={url} target="_blank" rel="noreferrer" className="truncate text-accent hover:underline">
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() => removeMedia("images", url)}
                  className="rounded border border-white/20 px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {form.videos.length ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-white/70">Videos</p>
            {form.videos.map((url) => (
              <div key={url} className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs">
                <a href={url} target="_blank" rel="noreferrer" className="truncate text-accent hover:underline">
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() => removeMedia("videos", url)}
                  className="rounded border border-white/20 px-2 py-1 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

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
      <label className="space-y-1 text-sm">
        <span className="block text-xs uppercase tracking-[0.08em] text-white/70">Homepage Section</span>
        <select
          value={form.homePlacement}
          onChange={(event) => onChange("homePlacement", event.target.value)}
          className="w-full rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        >
          {HOME_PLACEMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
