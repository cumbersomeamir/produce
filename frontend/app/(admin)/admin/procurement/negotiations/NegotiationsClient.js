"use client";

import { useEffect, useMemo, useState } from "react";
import { useProcurementWorkspace } from "@/components/admin/procurement/useProcurementWorkspace";
import { buildNegotiationInput, simulateSupplierNegotiation } from "@/lib/procurement-workflow";
import { formatCurrency } from "@/lib/utils";

function getStatusClass(status) {
  if (status === "agreed") return "text-emerald-300";
  return "text-amber-300";
}

export default function NegotiationsClient() {
  const { workspace, updateWorkspace } = useProcurementWorkspace();
  const products = workspace.products;
  const [selectedProductId, setSelectedProductId] = useState("");
  const [targetUnitPrice, setTargetUnitPrice] = useState("5");
  const [targetMoq, setTargetMoq] = useState("200");
  const [currency, setCurrency] = useState("USD");
  const [results, setResults] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [running, setRunning] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  useEffect(() => {
    if (initializedFromUrl) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hintedProductId = params.get("productId") || "";

    if (hintedProductId && products.some((product) => product.id === hintedProductId)) {
      setSelectedProductId(hintedProductId);
      setInitializedFromUrl(true);
      return;
    }
    if (!selectedProductId && products.length) {
      setSelectedProductId(products[0].id);
      setInitializedFromUrl(true);
    }
  }, [products, selectedProductId, initializedFromUrl]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId],
  );

  const suppliers = useMemo(
    () => workspace.suppliers.filter((supplier) => supplier.productId === selectedProductId),
    [workspace.suppliers, selectedProductId],
  );

  const bestQuote = results[0] || null;

  function runNegotiation() {
    setMessage("");
    setError("");
    setDrafts({});

    if (!selectedProduct) {
      setError("Select a product first.");
      return;
    }
    if (!suppliers.length) {
      setError("No suppliers found for selected product. Add suppliers first.");
      return;
    }

    const targetPrice = Number(targetUnitPrice);
    const targetQty = Number(targetMoq);
    if (!targetPrice || targetPrice <= 0) {
      setError("Target unit price must be greater than zero.");
      return;
    }
    if (!targetQty || targetQty <= 0) {
      setError("Target MOQ must be greater than zero.");
      return;
    }

    setRunning(true);
    try {
      const simulated = suppliers
        .map((supplier) =>
          simulateSupplierNegotiation({
            productName: selectedProduct.name,
            supplier,
            targetUnitPrice: targetPrice,
            targetMoq: targetQty,
            currency,
          }),
        )
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.totalQuote - b.totalQuote;
        });

      setResults(simulated);
      setMessage(`Negotiation simulation completed for ${suppliers.length} suppliers.`);

      updateWorkspace((current) => ({
        ...current,
        negotiations: [
          {
            id: `neg-${Date.now()}`,
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            currency,
            targetUnitPrice: targetPrice,
            targetMoq: targetQty,
            results: simulated,
            createdAt: new Date().toISOString(),
          },
          ...current.negotiations,
        ].slice(0, 30),
      }));
    } finally {
      setRunning(false);
    }
  }

  async function generateDrafts() {
    setMessage("");
    setError("");
    if (!results.length || !selectedProduct) {
      setError("Run negotiation first to generate seller outreach drafts.");
      return;
    }

    setDraftLoading(true);
    try {
      const limitedResults = results.slice(0, 3);
      const draftEntries = await Promise.all(
        limitedResults.map(async (result) => {
          const supplier = suppliers.find((item) => item.id === result.supplierId);
          if (!supplier) return [result.supplierId, ""];

          const response = await fetch("/api/ai/negotiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              buildNegotiationInput({
                productName: selectedProduct.name,
                supplier,
                targetUnitPrice: Number(targetUnitPrice),
                targetMoq: Number(targetMoq),
                currency,
              }),
            ),
          });

          if (!response.ok) {
            return [result.supplierId, "Draft generation failed. Please retry."];
          }

          const payload = await response.json();
          return [result.supplierId, payload?.data?.response || "No draft returned."];
        }),
      );

      const nextDrafts = Object.fromEntries(draftEntries);
      setDrafts(nextDrafts);
      setMessage("AI outreach drafts generated for top supplier options.");
    } catch (draftError) {
      setError(draftError.message || "Could not generate drafts.");
    } finally {
      setDraftLoading(false);
    }
  }

  return (
    <div className="space-y-5 text-white">
      <h1 className="font-heading text-3xl">Negotiations</h1>
      <p className="text-sm text-white/70">
        Step 3 workflow: set target MOQ and unit price, run supplier negotiation simulation, then use outreach drafts to contact sellers.
        Direct Alibaba chat automation is not enabled in this app, so messages are prepared for copy/send.
      </p>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-5">
        <select
          value={selectedProductId}
          onChange={(event) => setSelectedProductId(event.target.value)}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-2"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={targetUnitPrice}
          onChange={(event) => setTargetUnitPrice(event.target.value)}
          placeholder="Target unit price"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <input
          type="number"
          min="1"
          value={targetMoq}
          onChange={(event) => setTargetMoq(event.target.value)}
          placeholder="Target MOQ"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2">
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="CNY">CNY</option>
        </select>
        <button
          type="button"
          onClick={runNegotiation}
          disabled={running}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary hover:bg-accent-dark disabled:opacity-60 md:col-span-2"
        >
          {running ? "Running..." : "Run Negotiation"}
        </button>
        <button
          type="button"
          onClick={generateDrafts}
          disabled={draftLoading || !results.length}
          className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10 disabled:opacity-60 md:col-span-3"
        >
          {draftLoading ? "Generating drafts..." : "Generate AI Drafts (Top 3)"}
        </button>
      </div>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/70">Suppliers in scope: {suppliers.length}</p>
        {selectedProduct ? (
          <p className="mt-1 text-sm text-white/70">
            Product: <span className="font-semibold text-white">{selectedProduct.name}</span>
          </p>
        ) : null}
      </div>

      {bestQuote ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-200">Best Final Quote</p>
          <p className="mt-1 text-xl font-semibold text-white">{bestQuote.supplierName}</p>
          <p className="mt-1 text-sm text-emerald-100">
            {formatCurrency(bestQuote.finalUnitPrice, currency)} per unit • MOQ {bestQuote.finalMoq} • Total {formatCurrency(bestQuote.totalQuote, currency)}
          </p>
          <p className="mt-1 text-xs text-emerald-200">Score: {bestQuote.score}/100</p>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-[980px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/60">
            <tr>
              <th className="px-3 py-2">Supplier</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Final Offer</th>
              <th className="px-3 py-2">Operations</th>
              <th className="px-3 py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.supplierId} className="border-t border-white/10 align-top">
                <td className="px-3 py-3">
                  <p className="font-semibold">{result.supplierName}</p>
                  <div className="mt-2 space-y-1 text-xs text-white/70">
                    {result.rounds.map((round) => (
                      <p key={`${result.supplierId}-${round.round}`}>
                        R{round.round}: {round.supplierCounter}
                      </p>
                    ))}
                  </div>
                </td>
                <td className={`px-3 py-3 text-xs font-semibold uppercase tracking-wide ${getStatusClass(result.status)}`}>{result.status}</td>
                <td className="px-3 py-3 text-xs text-white/80">
                  <p>{formatCurrency(result.finalUnitPrice, currency)} per unit</p>
                  <p>MOQ: {result.finalMoq}</p>
                  <p>Total: {formatCurrency(result.totalQuote, currency)}</p>
                </td>
                <td className="px-3 py-3 text-xs text-white/80">
                  <p>Lead time: {result.leadTimeDays} days</p>
                  <p>Response ETA: {result.responseEtaHours}h</p>
                  {drafts[result.supplierId] ? (
                    <textarea
                      value={drafts[result.supplierId]}
                      readOnly
                      rows={5}
                      className="mt-2 w-full rounded-lg border border-white/15 bg-[#0f1022] px-2 py-2 text-xs text-white/80"
                    />
                  ) : (
                    <p className="mt-2 text-white/50">AI draft not generated yet.</p>
                  )}
                </td>
                <td className="px-3 py-3 text-sm font-semibold">{result.score}/100</td>
              </tr>
            ))}
            {!results.length ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-sm text-white/60">
                  Run negotiation to see ranked supplier quotes.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
