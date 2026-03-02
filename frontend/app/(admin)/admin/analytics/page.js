import { createMetadata } from "@/lib/seo";
import { listProducts } from "@/lib/runtime/catalog-store";
import { listCustomers, listOrders } from "@/lib/runtime/admin-store";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Analytics", description: "Sales trends, funnel metrics, and performance analysis.", path: "/admin/analytics" });
}

export default function AdminAnalyticsPage() {
  const products = listProducts();
  const orders = listOrders();
  const customers = listCustomers();
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const inStock = products.filter((product) => product.inventory > 0).length;
  const lowStock = products.filter((product) => product.inventory <= product.lowStockThreshold).length;

  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Analytics</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/70">Total Revenue</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(revenue)}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/70">Orders</p>
          <p className="mt-1 text-2xl font-semibold">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/70">Customers</p>
          <p className="mt-1 text-2xl font-semibold">{customers.length}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/70">In Stock / Low Stock</p>
          <p className="mt-1 text-2xl font-semibold">
            {inStock} / {lowStock}
          </p>
        </div>
      </div>
    </div>
  );
}
