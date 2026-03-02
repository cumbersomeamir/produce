import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Procurement Product Finder", description: "Find trending products and sourcing options.", path: "/admin/procurement/product-finder" });
}

export default function ProcurementProductFinderPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">AI Product Finder</h1>
      <form className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input placeholder="Trend, niche, or category" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-2" />
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">Find Products</button>
      </form>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        Suggestions include estimated demand, margin, sourcing difficulty, and local/import tags.
      </div>
    </div>
  );
}
