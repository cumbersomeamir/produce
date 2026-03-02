"use client";

import { useState } from "react";

export default function DeliveryClient({ initialPartners }) {
  const [partners, setPartners] = useState(initialPartners || []);
  const [form, setForm] = useState({ orderNumber: "", partner: "Shiprocket", trackingNumber: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function assignOrder(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Assignment failed.");
      setMessage(`Assigned ${form.orderNumber} to ${form.partner}.`);
      setForm({ orderNumber: "", partner: form.partner, trackingNumber: "" });
      const refreshed = await fetch("/api/admin/delivery");
      const data = await refreshed.json();
      setPartners(data?.data || []);
    } catch (assignError) {
      setError(assignError.message || "Assignment failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Delivery Management</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">Delivery Partners</p>
        <ul className="mt-2 space-y-1 text-sm">
          {partners.map((partner) => (
            <li key={partner.partner}>
              {partner.partner}: {partner.activeShipments} active shipments
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={assignOrder} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input
          placeholder="Order number"
          value={form.orderNumber}
          onChange={(event) => setForm((current) => ({ ...current, orderNumber: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
          required
        />
        <select
          value={form.partner}
          onChange={(event) => setForm((current) => ({ ...current, partner: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        >
          {partners.map((partner) => (
            <option key={partner.partner}>{partner.partner}</option>
          ))}
        </select>
        <input
          placeholder="Tracking number"
          value={form.trackingNumber}
          onChange={(event) => setForm((current) => ({ ...current, trackingNumber: event.target.value }))}
          className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
        />
        <button disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-3">
          {saving ? "Assigning..." : "Assign Order"}
        </button>
      </form>

      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}
    </div>
  );
}

