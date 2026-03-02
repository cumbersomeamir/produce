"use client";

import { useEffect, useMemo, useState } from "react";
import { useProcurementWorkspace } from "@/components/admin/procurement/useProcurementWorkspace";
import { formatCurrency } from "@/lib/utils";

const EMPTY_FORM = {
  product: "",
  currency: "USD",
  unitPrice: "",
  moq: "",
  shippingCost: "80",
  dutyPercent: "12",
  gstPercent: "18",
  packagingPerUnit: "0.3",
  marketingPerUnit: "0.8",
  platformFeePercent: "7",
  targetMarginPercent: "35",
};

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export default function CostCalculatorClient() {
  const { workspace, updateWorkspace } = useProcurementWorkspace();
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  useEffect(() => {
    if (initializedFromUrl) return;
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const product = params.get("product") || "";
    const unitPrice = params.get("unitPrice") || "";
    const moq = params.get("moq") || "";
    const currency = params.get("currency") || "USD";

    if (product || unitPrice || moq) {
      setForm((current) => ({
        ...current,
        product: product || current.product,
        unitPrice: unitPrice || current.unitPrice,
        moq: moq || current.moq,
        currency: ["USD", "INR", "CNY"].includes(currency) ? currency : "USD",
      }));
    }

    setInitializedFromUrl(true);
  }, [initializedFromUrl]);

  const calculation = useMemo(() => {
    const unitPrice = Math.max(0, toNumber(form.unitPrice, 0));
    const moq = Math.max(1, Math.round(toNumber(form.moq, 1)));
    const shippingCost = Math.max(0, toNumber(form.shippingCost, 0));
    const dutyPercent = Math.max(0, toNumber(form.dutyPercent, 0)) / 100;
    const gstPercent = Math.max(0, toNumber(form.gstPercent, 0)) / 100;
    const packagingPerUnit = Math.max(0, toNumber(form.packagingPerUnit, 0));
    const marketingPerUnit = Math.max(0, toNumber(form.marketingPerUnit, 0));
    const platformFeePercent = Math.max(0, toNumber(form.platformFeePercent, 0)) / 100;
    const targetMarginPercent = Math.max(0, toNumber(form.targetMarginPercent, 0)) / 100;

    const shippingPerUnit = shippingCost / moq;
    const dutyPerUnit = unitPrice * dutyPercent;
    const gstPerUnit = (unitPrice + shippingPerUnit + dutyPerUnit) * gstPercent;
    const landedPerUnit = unitPrice + shippingPerUnit + dutyPerUnit + gstPerUnit + packagingPerUnit + marketingPerUnit;

    const denominator = Math.max(0.05, 1 - platformFeePercent - targetMarginPercent);
    const suggestedSellPrice = landedPerUnit / denominator;
    const platformFeePerUnit = suggestedSellPrice * platformFeePercent;
    const expectedProfitPerUnit = suggestedSellPrice - landedPerUnit - platformFeePerUnit;

    return {
      unitPrice,
      moq,
      shippingPerUnit,
      dutyPerUnit,
      gstPerUnit,
      landedPerUnit,
      suggestedSellPrice,
      expectedProfitPerUnit,
      totalProcurementCost: landedPerUnit * moq,
      expectedTotalProfit: expectedProfitPerUnit * moq,
    };
  }, [form]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event) {
    event.preventDefault();

    const entry = {
      id: `cost-${Date.now()}`,
      product: form.product || "Untitled product",
      currency: form.currency,
      unitPrice: calculation.unitPrice,
      moq: calculation.moq,
      landedPerUnit: Number(calculation.landedPerUnit.toFixed(2)),
      suggestedSellPrice: Number(calculation.suggestedSellPrice.toFixed(2)),
      expectedProfitPerUnit: Number(calculation.expectedProfitPerUnit.toFixed(2)),
      totalProcurementCost: Number(calculation.totalProcurementCost.toFixed(2)),
      expectedTotalProfit: Number(calculation.expectedTotalProfit.toFixed(2)),
      createdAt: new Date().toISOString(),
    };

    updateWorkspace((current) => ({
      ...current,
      costCalculations: [entry, ...(current.costCalculations || [])].slice(0, 30),
    }));

    setMessage("Cost snapshot saved to procurement workspace.");
  }

  const history = (workspace.costCalculations || []).slice(0, 5);

  return (
    <div className="space-y-5 text-white">
      <h1 className="font-heading text-3xl">Landed Cost Calculator</h1>
      <p className="text-sm text-white/70">
        Compute landed unit cost, suggested selling price, and expected margin before finalizing supplier quotes.
      </p>

      <form onSubmit={handleSave} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          value={form.product}
          onChange={(event) => updateField("product", event.target.value)}
          placeholder="Product description"
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-3"
        />
        <select value={form.currency} onChange={(event) => updateField("currency", event.target.value)} className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2">
          <option value="USD">USD</option>
          <option value="INR">INR</option>
          <option value="CNY">CNY</option>
        </select>
        <input value={form.unitPrice} onChange={(event) => updateField("unitPrice", event.target.value)} placeholder="Supplier unit price" type="number" min="0" step="0.01" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.moq} onChange={(event) => updateField("moq", event.target.value)} placeholder="MOQ" type="number" min="1" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />

        <input value={form.shippingCost} onChange={(event) => updateField("shippingCost", event.target.value)} placeholder="Shipping (total)" type="number" min="0" step="0.01" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.dutyPercent} onChange={(event) => updateField("dutyPercent", event.target.value)} placeholder="Duty %" type="number" min="0" step="0.1" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.gstPercent} onChange={(event) => updateField("gstPercent", event.target.value)} placeholder="Tax/GST %" type="number" min="0" step="0.1" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />

        <input value={form.packagingPerUnit} onChange={(event) => updateField("packagingPerUnit", event.target.value)} placeholder="Packaging per unit" type="number" min="0" step="0.01" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.marketingPerUnit} onChange={(event) => updateField("marketingPerUnit", event.target.value)} placeholder="Marketing per unit" type="number" min="0" step="0.01" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.platformFeePercent} onChange={(event) => updateField("platformFeePercent", event.target.value)} placeholder="Platform fee %" type="number" min="0" step="0.1" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />

        <input value={form.targetMarginPercent} onChange={(event) => updateField("targetMarginPercent", event.target.value)} placeholder="Target margin %" type="number" min="1" step="0.1" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-2">
          Save Cost Snapshot
        </button>
      </form>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Landed Per Unit</p>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(calculation.landedPerUnit, form.currency)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Suggested Sell Price</p>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(calculation.suggestedSellPrice, form.currency)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Expected Profit / Unit</p>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(calculation.expectedProfitPerUnit, form.currency)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Total Procurement Cost</p>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(calculation.totalProcurementCost, form.currency)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold">Recent Saved Calculations</p>
        {history.length ? (
          <ul className="mt-2 space-y-1 text-xs text-white/75">
            {history.map((entry) => (
              <li key={entry.id}>
                {entry.product}: landed {formatCurrency(entry.landedPerUnit, entry.currency)} → sell {formatCurrency(entry.suggestedSellPrice, entry.currency)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-xs text-white/60">No saved calculations yet.</p>
        )}
      </div>
    </div>
  );
}
