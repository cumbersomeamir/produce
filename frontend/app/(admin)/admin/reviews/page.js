import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Reviews", description: "Moderate reviews and generate AI reviews.", path: "/admin/reviews" });
}

export default function AdminReviewsPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Reviews</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">AI Review Generator</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <input placeholder="Product" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
          <input placeholder="Quantity (e.g. 15)" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">Generate</button>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">Moderation Queue</p>
        <p className="mt-2 text-sm text-white/70">Approve, reject, and bulk publish generated reviews.</p>
      </div>
    </div>
  );
}
