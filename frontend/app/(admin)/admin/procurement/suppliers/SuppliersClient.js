"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AvailabilityBadge from "@/components/admin/procurement/AvailabilityBadge";
import { useProcurementWorkspace } from "@/components/admin/procurement/useProcurementWorkspace";
import { createManualSupplierLead } from "@/lib/procurement-workflow";
import { formatCurrency } from "@/lib/utils";

function sortSuppliers(suppliers) {
  return [...suppliers].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return a.unitPrice - b.unitPrice;
  });
}

function defaultForm(products) {
  return {
    productId: products[0]?.id || "",
    supplierName: "",
    platform: "Alibaba",
    supplierUrl: "",
    unitPrice: "",
    moq: "",
    rating: "4.5",
    leadTimeDays: "14",
    responseEtaHours: "8",
    notes: "",
  };
}

export default function SuppliersClient() {
  const { workspace, updateWorkspace } = useProcurementWorkspace();
  const products = workspace.products;
  const [form, setForm] = useState(() => defaultForm(products));
  const [filterProductId, setFilterProductId] = useState("all");
  const [discoveringProductId, setDiscoveringProductId] = useState("");
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const productsById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const filteredSuppliers = useMemo(() => {
    const base = filterProductId === "all" ? workspace.suppliers : workspace.suppliers.filter((supplier) => supplier.productId === filterProductId);
    return sortSuppliers(base);
  }, [workspace.suppliers, filterProductId]);

  useEffect(() => {
    if (initializedFromUrl) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("productId");
    if (productId && products.some((product) => product.id === productId)) {
      setFilterProductId(productId);
      setForm((current) => ({ ...current, productId }));
    }
    setInitializedFromUrl(true);
  }, [initializedFromUrl, products]);

  function handleFormChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleAddSupplier(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const product = productsById.get(form.productId);
    if (!product) {
      setError("Select a product before adding supplier.");
      return;
    }
    if (!form.supplierName.trim()) {
      setError("Supplier name is required.");
      return;
    }
    if (!form.unitPrice || Number(form.unitPrice) <= 0) {
      setError("Unit price must be greater than zero.");
      return;
    }
    if (!form.moq || Number(form.moq) <= 0) {
      setError("MOQ must be greater than zero.");
      return;
    }

    const lead = createManualSupplierLead({
      productId: product.id,
      productName: product.name,
      supplierName: form.supplierName.trim(),
      platform: form.platform.trim(),
      supplierUrl: form.supplierUrl.trim(),
      unitPrice: Number(form.unitPrice),
      moq: Number(form.moq),
      rating: Number(form.rating),
      leadTimeDays: Number(form.leadTimeDays),
      responseEtaHours: Number(form.responseEtaHours),
      notes: form.notes.trim(),
    });

    updateWorkspace((current) => ({
      ...current,
      suppliers: [lead, ...current.suppliers],
    }));
    setMessage(`${lead.supplierName} added for ${product.name}.`);
    setForm(defaultForm(products));
  }

  function handleDeleteSupplier(supplierId) {
    updateWorkspace((current) => ({
      ...current,
      suppliers: current.suppliers.filter((supplier) => supplier.id !== supplierId),
    }));
  }

  async function handleDiscoverForProduct() {
    const product = productsById.get(form.productId);
    if (!product) {
      setError("Select a product to discover suppliers.");
      return;
    }

    setError("");
    setMessage("");
    setDiscoveringProductId(product.id);
    try {
      const response = await fetch("/api/admin/procurement/supplier-discovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: product.name,
          searchQuery: product.searchQuery || product.name,
          alibabaUrl: product.alibabaUrl || "",
          maxResults: 5,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Could not discover suppliers.");
      const discovered = Array.isArray(payload?.data?.suppliers) ? payload.data.suppliers : [];

      updateWorkspace((current) => {
        const keySet = new Set(
          current.suppliers.map((item) => `${item.productId}::${String(item.supplierUrl || item.supplierName).toLowerCase()}`),
        );
        const mapped = discovered
          .map((entry, index) => ({
            id: `sup-discover-${Date.now()}-${index}-${product.id.slice(0, 12)}`,
            productId: product.id,
            productName: product.name,
            supplierName: entry.supplierName || `Alibaba Seller ${index + 1}`,
            platform: entry.platform || "Alibaba",
            supplierUrl: entry.supplierUrl || product.alibabaUrl || "",
            unitPrice: Number(entry.unitPrice || 0),
            moq: Math.max(1, Number(entry.moq || 1)),
            rating: Number(entry.rating || 4.5),
            leadTimeDays: Number(entry.leadTimeDays || 14),
            responseEtaHours: Number(entry.responseEtaHours || 8),
            notes: entry.notes || payload?.data?.note || "Discovered from Alibaba search.",
            createdAt: new Date().toISOString(),
          }))
          .filter((entry) => {
            const key = `${entry.productId}::${String(entry.supplierUrl || entry.supplierName).toLowerCase()}`;
            if (keySet.has(key)) return false;
            keySet.add(key);
            return true;
          });

        return {
          ...current,
          suppliers: [...mapped, ...current.suppliers],
        };
      });

      setFilterProductId(product.id);
      setMessage(`Supplier discovery finished for ${product.name}. ${payload?.data?.note || ""}`.trim());
    } catch (discoverError) {
      setError(discoverError.message || "Could not discover suppliers.");
    } finally {
      setDiscoveringProductId("");
    }
  }

  return (
    <div className="space-y-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl">Suppliers</h1>
        <a href="/admin/procurement/negotiations" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary hover:bg-accent-dark">
          Go to Negotiations
        </a>
      </div>

      <p className="text-sm text-white/70">
        Step 2 workflow: shortlist relevant suppliers from Alibaba and capture exact commercial terms so negotiations can run on real
        offer data.
      </p>

      <form onSubmit={handleAddSupplier} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <select
          value={form.productId}
          onChange={(event) => handleFormChange("productId", event.target.value)}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          value={form.supplierName}
          onChange={(event) => handleFormChange("supplierName", event.target.value)}
          placeholder="Supplier name"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.platform}
          onChange={(event) => handleFormChange("platform", event.target.value)}
          placeholder="Platform (Alibaba)"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.supplierUrl}
          onChange={(event) => handleFormChange("supplierUrl", event.target.value)}
          placeholder="Supplier / product URL"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-2"
        />
        <input
          value={form.unitPrice}
          onChange={(event) => handleFormChange("unitPrice", event.target.value)}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Unit price (USD)"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.moq}
          onChange={(event) => handleFormChange("moq", event.target.value)}
          type="number"
          min="1"
          placeholder="MOQ"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.rating}
          onChange={(event) => handleFormChange("rating", event.target.value)}
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Rating"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.leadTimeDays}
          onChange={(event) => handleFormChange("leadTimeDays", event.target.value)}
          type="number"
          min="1"
          placeholder="Lead time (days)"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.responseEtaHours}
          onChange={(event) => handleFormChange("responseEtaHours", event.target.value)}
          type="number"
          min="1"
          placeholder="Response ETA (hours)"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <textarea
          value={form.notes}
          onChange={(event) => handleFormChange("notes", event.target.value)}
          rows={2}
          placeholder="Quality notes, test reports, certifications, etc."
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-3"
        />
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary hover:bg-accent-dark md:col-span-3">
          Add Supplier Lead
        </button>
        <button
          type="button"
          onClick={handleDiscoverForProduct}
          disabled={!!discoveringProductId}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 disabled:opacity-60 md:col-span-3"
        >
          {discoveringProductId ? "Discovering Suppliers..." : "Discover Suppliers from Alibaba"}
        </button>
      </form>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="product-filter" className="text-xs uppercase tracking-wide text-white/60">
          Filter
        </label>
        <select
          id="product-filter"
          value={filterProductId}
          onChange={(event) => setFilterProductId(event.target.value)}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 text-sm"
        >
          <option value="all">All products</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-[1000px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Offer</th>
              <th className="px-3 py-2">Delivery</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => {
              const product = productsById.get(supplier.productId);
              return (
                <tr key={supplier.id} className="border-t border-white/10 align-top">
                  <td className="px-3 py-3">
                    <p className="font-semibold">{supplier.supplierName}</p>
                    <p className="mt-1 text-xs text-white/70">
                      {supplier.platform} • Rating {supplier.rating}/5
                    </p>
                    {supplier.supplierUrl ? (
                      <a href={supplier.supplierUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-xs text-accent hover:underline">
                        Open listing
                      </a>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <p>{supplier.productName}</p>
                    <div className="mt-2">
                      <AvailabilityBadge status={product?.alibabaStatus} />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-white/80">
                    <p>Unit: {formatCurrency(supplier.unitPrice, "USD")}</p>
                    <p>MOQ: {supplier.moq}</p>
                    <p>Response ETA: {supplier.responseEtaHours}h</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-white/80">
                    <p>Lead time: {supplier.leadTimeDays} days</p>
                    {supplier.notes ? <p className="mt-1 text-white/70">{supplier.notes}</p> : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/procurement/suppliers/${supplier.id}`}
                        className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-center text-xs font-semibold text-white/80 hover:bg-white/10"
                      >
                        Open Thread
                      </Link>
                      <Link
                        href={`/admin/procurement/negotiations?productId=${supplier.productId}`}
                        className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-center text-xs font-semibold text-white/80 hover:bg-white/10"
                      >
                        Negotiate
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        className="rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-400/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filteredSuppliers.length ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-sm text-white/60">
                  No suppliers for this filter. Add one from Alibaba listings above.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
