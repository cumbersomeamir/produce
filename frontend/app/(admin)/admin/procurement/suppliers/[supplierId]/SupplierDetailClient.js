"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProcurementWorkspace } from "@/components/admin/procurement/useProcurementWorkspace";
import { buildNegotiationInput } from "@/lib/procurement-workflow";
import { formatCurrency } from "@/lib/utils";

function formatTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}

export default function SupplierDetailClient({ supplierId }) {
  const { workspace, updateWorkspace } = useProcurementWorkspace();
  const supplier = useMemo(
    () => workspace.suppliers.find((item) => item.id === supplierId) || null,
    [workspace.suppliers, supplierId],
  );
  const product = useMemo(
    () => workspace.products.find((item) => item.id === supplier?.productId) || null,
    [workspace.products, supplier?.productId],
  );
  const messages = useMemo(
    () => (workspace.supplierMessages || []).filter((entry) => entry.supplierId === supplierId),
    [workspace.supplierMessages, supplierId],
  );

  const [direction, setDirection] = useState("outbound");
  const [text, setText] = useState("");
  const [draft, setDraft] = useState("");
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!supplier) {
    return (
      <div className="space-y-4 text-white">
        <h1 className="font-heading text-3xl">Supplier Thread</h1>
        <p className="text-sm text-white/70">Supplier not found in workspace.</p>
        <Link href="/admin/procurement/suppliers" className="inline-flex rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-sm font-semibold">
          Back to Suppliers
        </Link>
      </div>
    );
  }

  function addMessage(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!text.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    updateWorkspace((current) => ({
      ...current,
      supplierMessages: [
        {
          id: `msg-${Date.now()}`,
          supplierId,
          direction,
          body: text.trim(),
          createdAt: new Date().toISOString(),
        },
        ...(current.supplierMessages || []),
      ].slice(0, 200),
    }));

    setText("");
    setMessage("Message saved to supplier timeline.");
  }

  async function generateDraft() {
    if (!product) {
      setError("Product context missing for this supplier.");
      return;
    }

    setLoadingDraft(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/ai/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildNegotiationInput({
            productName: product.name,
            supplier,
            targetUnitPrice: Number(supplier.unitPrice || 0),
            targetMoq: Number(supplier.moq || 0),
            currency: "USD",
          }),
        ),
      });

      if (!response.ok) throw new Error("Draft generation failed.");
      const payload = await response.json();
      const nextDraft = payload?.data?.response || "No draft returned.";
      setDraft(nextDraft);
      setMessage("Negotiation draft generated.");
    } catch (draftError) {
      setError(draftError.message || "Draft generation failed.");
    } finally {
      setLoadingDraft(false);
    }
  }

  function saveDraftAsMessage() {
    if (!draft.trim()) return;
    updateWorkspace((current) => ({
      ...current,
      supplierMessages: [
        {
          id: `msg-${Date.now()}`,
          supplierId,
          direction: "outbound",
          body: draft.trim(),
          createdAt: new Date().toISOString(),
          generated: true,
        },
        ...(current.supplierMessages || []),
      ].slice(0, 200),
    }));
    setMessage("Draft added to timeline as outbound message.");
  }

  return (
    <div className="space-y-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl">Supplier Thread</h1>
        <Link href={`/admin/procurement/negotiations?productId=${supplier.productId}`} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">
          Open Negotiations
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-lg font-semibold">{supplier.supplierName}</p>
        <p className="mt-1 text-sm text-white/70">{supplier.platform} · Rating {supplier.rating}/5</p>
        <p className="mt-2 text-sm text-white/75">
          {product?.name || supplier.productName} · {formatCurrency(supplier.unitPrice, "USD")} per unit · MOQ {supplier.moq}
        </p>
        {supplier.supplierUrl ? (
          <a href={supplier.supplierUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs text-accent hover:underline">
            Open Alibaba listing
          </a>
        ) : null}
      </div>

      <form onSubmit={addMessage} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-5">
        <select value={direction} onChange={(event) => setDirection(event.target.value)} className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-1">
          <option value="outbound">Outbound</option>
          <option value="inbound">Inbound</option>
        </select>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={2}
          placeholder="Log supplier conversation notes, counter-offers, and MOQ updates"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-3"
        />
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-1">
          Save Log
        </button>
      </form>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">AI Negotiation Draft</p>
          <div className="flex gap-2">
            <button type="button" onClick={generateDraft} disabled={loadingDraft} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 disabled:opacity-60">
              {loadingDraft ? "Generating..." : "Generate Draft"}
            </button>
            <button type="button" onClick={saveDraftAsMessage} disabled={!draft.trim()} className="rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 disabled:opacity-60">
              Save to Timeline
            </button>
          </div>
        </div>
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={6} className="mt-3 w-full rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" placeholder="Generate a draft, adjust tone/price targets, then save it to timeline." />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">Communication Timeline</p>
        {messages.length ? (
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {messages.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <p className="text-xs uppercase tracking-wide text-white/60">{entry.direction} · {formatTime(entry.createdAt)}</p>
                <p className="mt-1">{entry.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-white/60">No messages yet. Start the conversation by logging an outbound message.</p>
        )}
      </div>
    </div>
  );
}
