"use client";

import { useState } from "react";

export default function DiscountsClient({ initialDiscounts }) {
  const [discounts, setDiscounts] = useState(initialDiscounts || []);
  const [form, setForm] = useState({ code: "", type: "PERCENTAGE", value: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value || 0),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Could not create coupon.");
      setDiscounts((current) => [payload.discount, ...current]);
      setForm({ code: "", type: "PERCENTAGE", value: "" });
      setMessage("Coupon created.");
    } catch (submitError) {
      setError(submitError.message || "Could not create coupon.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Discounts</h1>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          placeholder="Code"
          value={form.code}
          onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
          required
        />
        <select
          value={form.type}
          onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        >
          <option>PERCENTAGE</option>
          <option>FIXED_AMOUNT</option>
          <option>FREE_SHIPPING</option>
        </select>
        <input
          placeholder="Value"
          value={form.value}
          onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <button disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-3">
          {saving ? "Creating..." : "Create Coupon"}
        </button>
      </form>

      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Value</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id || discount.code} className="border-t border-white/10">
                <td className="px-3 py-2">{discount.code}</td>
                <td className="px-3 py-2">{discount.type}</td>
                <td className="px-3 py-2">{discount.value}</td>
                <td className="px-3 py-2">{discount.active ? "ACTIVE" : "INACTIVE"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

