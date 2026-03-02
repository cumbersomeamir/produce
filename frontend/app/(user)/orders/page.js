import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const orders = [
  { id: "ODF-104921", status: "DELIVERED", total: "₹2,349", date: "2026-02-21" },
  { id: "ODF-104918", status: "SHIPPED", total: "₹1,099", date: "2026-02-28" },
];

export function generateMetadata() {
  return createMetadata({
    title: "My Orders",
    description: "View your OddFinds order history, statuses, and tracking details.",
    path: "/orders",
  });
}

export default function OrdersPage() {
  return (
    <div>
      <h1 className="h1 text-secondary">My Orders</h1>
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-secondary">{order.id}</p>
              <p className="text-sm text-text-muted">{order.date}</p>
            </div>
            <p className="mt-1 text-sm">Status: {order.status}</p>
            <p className="text-sm text-text-muted">Total: {order.total}</p>
            <Link href={`/orders/${order.id}`} className="mt-2 inline-block text-sm font-semibold text-primary">
              View Details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
