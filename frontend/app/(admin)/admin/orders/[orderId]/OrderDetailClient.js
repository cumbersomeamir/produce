"use client";

import { useState } from "react";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function OrderDetailClient({ order }) {
  const [form, setForm] = useState({
    status: order.status || "PENDING",
    trackingNumber: order.trackingNumber || "",
    deliveryPartner: order.deliveryPartner || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function saveUpdates() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          ...form,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Could not update order.");
      setMessage("Order updated.");
    } catch (saveError) {
      setError(saveError.message || "Could not update order.");
    } finally {
      setSaving(false);
    }
  }

  async function markUnfulfillable() {
    setForm((current) => ({ ...current, status: "CANCELLED" }));
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.orderNumber,
          status: "CANCELLED",
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Could not cancel order.");
      setMessage("Order marked as cancelled.");
    } catch (saveError) {
      setError(saveError.message || "Could not cancel order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Order {order.orderNumber}</h1>
      <p className="text-sm text-white/70">Customer: {order.customerEmail} · Items: {order.items}</p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 font-semibold">Status Flow</p>
        <select
          value={form.status}
          onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
          className="w-full rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 text-sm"
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            value={form.trackingNumber}
            onChange={(event) => setForm((current) => ({ ...current, trackingNumber: event.target.value }))}
            placeholder="Tracking number"
            className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
          />
          <input
            value={form.deliveryPartner}
            onChange={(event) => setForm((current) => ({ ...current, deliveryPartner: event.target.value }))}
            placeholder="Assign delivery partner"
            className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={saveUpdates}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Updates"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={markUnfulfillable}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            Can&apos;t Fulfill (Mark Cancelled)
          </button>
        </div>
        {message ? <p className="mt-2 text-sm text-success">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
      </div>
    </div>
  );
}

