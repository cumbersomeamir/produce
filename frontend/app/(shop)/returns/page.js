import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Returns & Refunds",
    description: "OddFinds 7-day return policy, return steps, and refund timelines.",
    path: "/returns",
  });
}

export default function ReturnsPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Returns & Refunds</h1>
      <div className="mt-4 space-y-3 text-text-muted">
        <p>Eligible products can be returned within 7 days of delivery in unused condition with original packaging.</p>
        <p>To start a return: open your order page, select the item, choose a reason, and submit pickup details.</p>
        <p>After quality check, refunds are initiated to the original payment source within 5-7 business days.</p>
        <p>Final sale and hygiene-sensitive products may be non-returnable. Such terms are marked on product pages.</p>
      </div>
    </div>
  );
}
