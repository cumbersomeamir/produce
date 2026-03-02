import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { listOrders } from "@/lib/runtime/admin-store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Orders", description: "Manage all store orders.", path: "/admin/orders" });
}

export default function AdminOrdersPage() {
  const orders = listOrders();
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Orders</h1>
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderNumber} className="border-t border-white/10">
                <td className="px-3 py-2">{order.orderNumber}</td>
                <td className="px-3 py-2">{order.status}</td>
                <td className="px-3 py-2">{formatCurrency(order.total)}</td>
                <td className="px-3 py-2">{order.payment}</td>
                <td className="px-3 py-2">
                  <Link href={`/admin/orders/${order.orderNumber}`} className="text-accent">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
