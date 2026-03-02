import { createMetadata } from "@/lib/seo";
import { listCustomers } from "@/lib/runtime/admin-store";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Customers", description: "View and manage customer accounts.", path: "/admin/customers" });
}

export default function AdminCustomersPage() {
  const customers = listCustomers();
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Customers</h1>
      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Tier</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-white/10">
                <td className="px-3 py-2">{customer.name}</td>
                <td className="px-3 py-2">{customer.email}</td>
                <td className="px-3 py-2">{customer.tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
