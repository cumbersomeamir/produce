"use client";

import { formatCurrency } from "@/lib/utils";

export default function OrderSummary({ subtotal, shipping }) {
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <aside className="sticky top-24 rounded-2xl border border-border bg-surface p-4">
      <h2 className="font-heading text-2xl text-secondary">Order Summary</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-border bg-surface-elevated p-3 text-xs text-text-muted">
        🔒 256-bit SSL Encryption · ✅ 100% Secure Payment · 📦 Easy Returns
      </div>
    </aside>
  );
}
