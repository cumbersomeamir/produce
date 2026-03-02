"use client";

import { useMemo, useState } from "react";
import AvailabilityBadge from "@/components/admin/procurement/AvailabilityBadge";
import { useProcurementWorkspace } from "@/components/admin/procurement/useProcurementWorkspace";
import {
  AvailabilityStatus,
  buildAlibabaSearchUrl,
  createManualOpportunity,
  deriveSearchQuery,
  sourcingDifficultyLabel,
} from "@/lib/procurement-workflow";

function formatCheckedAt(value) {
  if (!value) return "Never";
  const date = new Date(value);
  return date.toLocaleString();
}

const emptyForm = {
  name: "",
  inspirationUrl: "",
};

export default function ProductFinderClient() {
  const { workspace, hydrated, updateWorkspace, resetWorkspace } = useProcurementWorkspace();
  const [form, setForm] = useState(emptyForm);
  const [checkingId, setCheckingId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const products = useMemo(
    () =>
      [...workspace.products].sort((a, b) => {
        if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
        return a.name.localeCompare(b.name);
      }),
    [workspace.products],
  );

  const summary = useMemo(() => {
    const total = workspace.products.length;
    const available = workspace.products.filter((product) => product.alibabaStatus === AvailabilityStatus.AVAILABLE).length;
    const needsReview = workspace.products.filter((product) => product.alibabaStatus === AvailabilityStatus.NEEDS_REVIEW).length;
    const notFound = workspace.products.filter((product) => product.alibabaStatus === AvailabilityStatus.NOT_FOUND).length;
    return { total, available, needsReview, notFound };
  }, [workspace.products]);

  function updateProduct(productId, patch) {
    updateWorkspace((current) => ({
      ...current,
      products: current.products.map((product) => (product.id === productId ? { ...product, ...patch } : product)),
    }));
  }

  function handleAddOpportunity(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    const newOpportunity = createManualOpportunity(form);
    updateWorkspace((current) => ({
      ...current,
      products: [newOpportunity, ...current.products],
    }));
    setForm(emptyForm);
    setMessage("Product opportunity added to sourcing queue.");
  }

  async function handleCheckAvailability(product) {
    setMessage("");
    setError("");
    setCheckingId(product.id);
    try {
      const response = await fetch("/api/admin/procurement/alibaba-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: product.name,
          searchQuery: product.searchQuery || deriveSearchQuery(product.name),
          alibabaUrl: product.alibabaUrl || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Availability check failed.");
      }

      const payload = await response.json();
      const result = payload?.data || {};
      updateProduct(product.id, {
        alibabaStatus: result.status || AvailabilityStatus.UNKNOWN,
        alibabaUrl: result.alibabaUrl || product.alibabaUrl,
        lastCheckedAt: result.checkedAt || new Date().toISOString(),
        notes: result.note || product.notes,
      });
      setMessage(`Availability checked for ${product.name}.`);
    } catch (checkError) {
      setError(checkError.message || "Could not run availability check.");
    } finally {
      setCheckingId("");
    }
  }

  function handleGenerateAlibabaUrl(product) {
    const searchQuery = product.searchQuery || deriveSearchQuery(product.name);
    const alibabaUrl = buildAlibabaSearchUrl(searchQuery);
    updateProduct(product.id, {
      searchQuery,
      alibabaUrl,
      notes: product.notes || "Generated Alibaba search URL. Open the link and shortlist exact supplier matches.",
    });
    setMessage(`Alibaba search URL prepared for ${product.name}.`);
  }

  return (
    <div className="space-y-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl">Product Finder</h1>
        <button
          type="button"
          onClick={resetWorkspace}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
        >
          Reset Seed Data
        </button>
      </div>

      <p className="text-sm text-white/70">
        Step 1 and 2 workflow: score product opportunities, create Alibaba search targets, and verify availability. Automated checks can
        be blocked by Alibaba captcha, so manual review links are included for every item.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-wide text-white/60">Opportunities</p>
          <p className="mt-1 text-2xl font-semibold">{summary.total}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-wide text-white/60">Available</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">{summary.available}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-wide text-white/60">Needs Review</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">{summary.needsReview}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs uppercase tracking-wide text-white/60">Not Found</p>
          <p className="mt-1 text-2xl font-semibold text-rose-300">{summary.notFound}</p>
        </div>
      </div>

      <form onSubmit={handleAddOpportunity} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="New product idea name"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          value={form.inspirationUrl}
          onChange={(event) => setForm((current) => ({ ...current, inspirationUrl: event.target.value }))}
          placeholder="Instagram / YouTube link"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary hover:bg-accent-dark">
          Add to Queue
        </button>
      </form>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-[1120px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Signals</th>
              <th className="px-3 py-2">Alibaba Status</th>
              <th className="px-3 py-2">Search Query</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-3">
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-1 text-xs text-white/60">Priority score: {product.priorityScore}</p>
                  {product.inspirationUrl ? (
                    <a
                      href={product.inspirationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex text-xs text-accent hover:underline"
                    >
                      Open reference
                    </a>
                  ) : null}
                </td>
                <td className="px-3 py-3 text-xs text-white/80">
                  <p>Demand: {product.demandScore}/100</p>
                  <p>Margin: {product.marginScore}/100</p>
                  <p>
                    Difficulty: {product.sourcingDifficultyScore}/100 ({sourcingDifficultyLabel(product.sourcingDifficultyScore)})
                  </p>
                </td>
                <td className="px-3 py-3">
                  <AvailabilityBadge status={product.alibabaStatus} />
                  <p className="mt-2 text-xs text-white/60">Checked: {formatCheckedAt(product.lastCheckedAt)}</p>
                  {product.notes ? <p className="mt-2 text-xs text-white/70">{product.notes}</p> : null}
                </td>
                <td className="px-3 py-3">
                  <input
                    value={product.searchQuery}
                    onChange={(event) => updateProduct(product.id, { searchQuery: event.target.value })}
                    className="w-full rounded-md border border-white/15 bg-[#0f1022] px-2 py-1.5 text-xs"
                  />
                  {product.alibabaUrl ? (
                    <a
                      href={product.alibabaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex text-xs text-accent hover:underline"
                    >
                      Open Alibaba Link
                    </a>
                  ) : null}
                </td>
                <td className="space-y-2 px-3 py-3">
                  <button
                    type="button"
                    onClick={() => handleGenerateAlibabaUrl(product)}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    Build Search URL
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCheckAvailability(product)}
                    disabled={checkingId === product.id}
                    className="w-full rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-secondary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {checkingId === product.id ? "Checking..." : "Check Availability"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!hydrated ? <p className="text-xs text-white/60">Syncing workspace...</p> : null}
    </div>
  );
}

