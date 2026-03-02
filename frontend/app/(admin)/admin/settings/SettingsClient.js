"use client";

import { useState } from "react";

export default function SettingsClient({ initialSettings }) {
  const [form, setForm] = useState(() => ({
    storeName: initialSettings?.storeName || "OddFinds",
    supportEmail: initialSettings?.supportEmail || "",
    freeShippingThreshold: String(initialSettings?.freeShippingThreshold ?? 999),
    defaultGstPercent: String(initialSettings?.defaultGstPercent ?? 18),
    defaultCurrency: initialSettings?.defaultCurrency || "INR",
    procurementBudgetUsd: String(initialSettings?.procurementBudgetUsd ?? 5000),
  }));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          freeShippingThreshold: Number(form.freeShippingThreshold || 0),
          defaultGstPercent: Number(form.defaultGstPercent || 0),
          procurementBudgetUsd: Number(form.procurementBudgetUsd || 0),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Could not save settings.");
      setMessage("Settings saved.");
    } catch (submitError) {
      setError(submitError.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Settings</h1>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
        <input value={form.storeName} onChange={(event) => updateField("storeName", event.target.value)} placeholder="Store name" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.supportEmail} onChange={(event) => updateField("supportEmail", event.target.value)} placeholder="Support email" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.freeShippingThreshold} onChange={(event) => updateField("freeShippingThreshold", event.target.value)} placeholder="Free shipping threshold" type="number" min="0" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input value={form.defaultGstPercent} onChange={(event) => updateField("defaultGstPercent", event.target.value)} placeholder="Default GST %" type="number" min="0" step="0.1" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <select value={form.defaultCurrency} onChange={(event) => updateField("defaultCurrency", event.target.value)} className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2">
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="CNY">CNY</option>
        </select>
        <input value={form.procurementBudgetUsd} onChange={(event) => updateField("procurementBudgetUsd", event.target.value)} placeholder="Procurement budget (USD)" type="number" min="0" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <button disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary disabled:opacity-60 md:col-span-2">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {message ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">{error}</p> : null}
    </div>
  );
}
