import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Negotiations", description: "AI-drafted supplier negotiation workflows.", path: "/admin/procurement/negotiations" });
}

export default function ProcurementNegotiationsPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Negotiations</h1>
      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-white/70">Generate professional negotiation drafts with MOQ, pricing, terms, and sample requests.</p>
      </div>
    </div>
  );
}
