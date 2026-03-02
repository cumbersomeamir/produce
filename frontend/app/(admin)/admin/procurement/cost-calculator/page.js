import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Landed Cost Calculator", description: "Compute CIF, duties, and suggested pricing.", path: "/admin/procurement/cost-calculator" });
}

export default function ProcurementCostCalculatorPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Landed Cost Calculator</h1>
      <form className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
        <input placeholder="Product description" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 md:col-span-2" />
        <input placeholder="HS Code" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="FOB Price" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Weight (g)" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Origin Country" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-2">Calculate</button>
      </form>
    </div>
  );
}
