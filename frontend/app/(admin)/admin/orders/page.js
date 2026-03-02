import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const orders = [
  ["ODF-104932", "PENDING", "₹2,199", "CAPTURED"],
  ["ODF-104931", "PROCESSING", "₹699", "AUTHORIZED"],
  ["ODF-104930", "SHIPPED", "₹1,459", "CAPTURED"],
];

export function generateMetadata() {
  return createMetadata({ title: "Admin Orders", description: "Manage all store orders.", path: "/admin/orders" });
}

export default function AdminOrdersPage() {
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
              <tr key={order[0]} className="border-t border-white/10">
                <td className="px-3 py-2">{order[0]}</td>
                <td className="px-3 py-2">{order[1]}</td>
                <td className="px-3 py-2">{order[2]}</td>
                <td className="px-3 py-2">{order[3]}</td>
                <td className="px-3 py-2">
                  <Link href={`/admin/orders/${order[0]}`} className="text-accent">Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
