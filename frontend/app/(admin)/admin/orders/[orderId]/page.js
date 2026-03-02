import { createMetadata } from "@/lib/seo";

export function generateMetadata({ params }) {
  return createMetadata({ title: `Order ${params.orderId}`, description: "Update status and delivery assignment.", path: `/admin/orders/${params.orderId}` });
}

export default async function AdminOrderDetailPage({ params }) {
  const { orderId } = await params;

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Order {orderId}</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 font-semibold">Status Flow</p>
        <select className="w-full rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 text-sm">
          <option>PENDING</option>
          <option>CONFIRMED</option>
          <option>PROCESSING</option>
          <option>SHIPPED</option>
          <option>OUT_FOR_DELIVERY</option>
          <option>DELIVERED</option>
        </select>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input placeholder="Tracking number" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
          <input placeholder="Assign delivery partner" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">Save Updates</button>
          <button className="rounded-lg bg-red-500 px-4 py-2 text-sm">Can&apos;t Fulfill (Auto Refund)</button>
        </div>
      </div>
    </div>
  );
}
