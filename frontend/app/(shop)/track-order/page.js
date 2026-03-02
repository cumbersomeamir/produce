import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Track Order",
    description: "Track your OddFinds order with order number and email.",
    path: "/track-order",
  });
}

export default function TrackOrderPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Track Your Order</h1>
      <p className="mt-2 text-text-muted">Enter your order number and email to get live status updates.</p>
      <form className="mt-5 grid max-w-xl gap-3 rounded-2xl border border-border bg-surface p-4">
        <input placeholder="Order Number (ODF-XXXXXX)" className="rounded-xl border border-border px-3 py-2" />
        <input type="email" placeholder="Email" className="rounded-xl border border-border px-3 py-2" />
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">
          Track Order
        </button>
      </form>
    </div>
  );
}
