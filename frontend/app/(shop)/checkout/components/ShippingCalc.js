"use client";

import { useMemo } from "react";
import { calculateShippingRate } from "@/lib/shipping";
import { formatCurrency } from "@/lib/utils";

export default function ShippingCalc({ country = "India", weight = 500, subtotal = 0 }) {
  const rate = useMemo(() => calculateShippingRate({ country, weight, subtotal }), [country, weight, subtotal]);

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-3 text-sm">
      <p className="font-semibold text-secondary">Shipping Estimate</p>
      <p className="mt-1 text-text-muted">
        {rate.carrier} • {rate.zone}
      </p>
      <p className="text-text-muted">ETA: {rate.etaDays} business days</p>
      <p className="mt-1 font-semibold">{rate.free ? "FREE" : formatCurrency(rate.rate)}</p>
    </div>
  );
}
