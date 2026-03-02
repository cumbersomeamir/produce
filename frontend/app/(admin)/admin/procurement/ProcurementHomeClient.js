"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useProcurementWorkspace } from "@/components/admin/procurement/useProcurementWorkspace";
import { AvailabilityStatus } from "@/lib/procurement-workflow";

const tools = [
  ["Product Finder", "/admin/procurement/product-finder", "Find opportunities and verify availability."],
  ["Suppliers", "/admin/procurement/suppliers", "Capture supplier offers and shortlist leads."],
  ["Negotiations", "/admin/procurement/negotiations", "Set target MOQ/price and rank final quotes."],
  ["Landed Cost Calculator", "/admin/procurement/cost-calculator", "Compute landed cost and suggested sell price."],
];

export default function ProcurementHomeClient() {
  const { workspace } = useProcurementWorkspace();

  const stats = useMemo(() => {
    const products = workspace.products || [];
    const available = products.filter((item) => item.alibabaStatus === AvailabilityStatus.AVAILABLE).length;
    const needsReview = products.filter((item) => item.alibabaStatus === AvailabilityStatus.NEEDS_REVIEW).length;

    return {
      opportunities: products.length,
      available,
      needsReview,
      suppliers: (workspace.suppliers || []).length,
      negotiations: (workspace.negotiations || []).length,
      quotes: (workspace.quoteSummaries || []).length,
    };
  }, [workspace]);

  const latestQuote = workspace.quoteSummaries?.[0] || null;

  return (
    <div className="space-y-5 text-white">
      <h1 className="font-heading text-3xl">Procurement Center</h1>
      <p className="text-sm text-white/70">
        End-to-end sourcing flow: find products, discover suppliers, negotiate MOQ/price, then validate landed profitability.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Opportunities</p>
          <p className="mt-1 text-2xl font-semibold">{stats.opportunities}</p>
          <p className="mt-1 text-xs text-white/65">Available: {stats.available} · Needs review: {stats.needsReview}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Supplier Leads</p>
          <p className="mt-1 text-2xl font-semibold">{stats.suppliers}</p>
          <p className="mt-1 text-xs text-white/65">Run discovery from Product Finder for fast intake.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-white/60">Negotiation Runs</p>
          <p className="mt-1 text-2xl font-semibold">{stats.negotiations}</p>
          <p className="mt-1 text-xs text-white/65">Saved quotes: {stats.quotes}</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tools.map(([label, href, note]) => (
          <Link key={href} href={href} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
            <p className="text-lg font-semibold">{label}</p>
            <p className="mt-1 text-sm text-white/70">{note}</p>
          </Link>
        ))}
      </div>

      {latestQuote ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-wide text-emerald-200">Latest Saved Quote</p>
          <p className="mt-1 text-sm text-emerald-100">{latestQuote.summary}</p>
        </div>
      ) : null}
    </div>
  );
}
