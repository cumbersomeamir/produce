"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function CartSummary({ subtotal }) {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 79;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <aside className="rounded-2xl border border-border bg-surface p-4">
      <h2 className="font-heading text-2xl text-secondary">Cart Summary</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
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

      <div className="mt-4 rounded-xl bg-surface-elevated p-3">
        {remaining > 0 ? (
          <p className="mb-2 text-sm text-text-muted">Add {formatCurrency(remaining)} more for FREE shipping!</p>
        ) : (
          <p className="mb-2 text-sm text-success">You unlocked FREE shipping.</p>
        )}
        <ProgressBar value={progress} />
      </div>

      <div className="mt-4 space-y-2">
        <input type="text" placeholder="Coupon code" className="h-10 w-full rounded-xl border border-border px-3 text-sm" />
        <Button className="w-full">Apply Coupon</Button>
        <Button as={Link} href="/checkout" variant="secondary" className="w-full">
          Secure Checkout
        </Button>
      </div>
    </aside>
  );
}
