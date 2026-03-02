import { createMetadata } from "@/lib/seo";

export function generateMetadata({ params }) {
  return createMetadata({
    title: `Order ${params.orderId}`,
    description: "Track shipment timeline and order details.",
    path: `/orders/${params.orderId}`,
  });
}

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;

  return (
    <div>
      <h1 className="h1 text-secondary">Order {orderId}</h1>
      <p className="mt-2 text-text-muted">Shipment status and item breakdown.</p>
      <div className="mt-5 rounded-2xl border border-border bg-surface p-4 text-sm">
        <p>Status: In Transit</p>
        <p className="mt-1">Tracking: TRK123456789</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-text-muted">
          <li>Order placed</li>
          <li>Confirmed</li>
          <li>Shipped</li>
          <li>Out for delivery</li>
        </ol>
      </div>
    </div>
  );
}
