import RevenueChart from "@/app/(admin)/admin/dashboard/components/RevenueChart";
import { createMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/catalog-service";
import {
  listCustomers,
  listDeliveryPartners,
  listModerationReviews,
  listOrders,
} from "@/lib/runtime/admin-store";
import { formatCurrency } from "@/lib/utils";

export function generateMetadata() {
  return createMetadata({
    title: "Admin Dashboard",
    description: "OddFinds admin KPIs, revenue trends, recent orders, and operational alerts.",
    path: "/admin/dashboard",
  });
}

export default async function AdminDashboardPage() {
  const orders = listOrders();
  const customers = listCustomers();
  const products = await getCatalogProducts();
  const reviews = listModerationReviews();
  const deliveryPartners = listDeliveryPartners();

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
  const pendingReviews = reviews.filter((review) => review.status === "PENDING").length;
  const lowStock = products.filter((product) => product.inventory <= product.lowStockThreshold).length;
  const inStock = products.filter((product) => product.inventory > product.lowStockThreshold).length;
  const conversion = customers.length ? ((orders.length / (customers.length * 12)) * 100).toFixed(1) : "0.0";

  const weeklyRevenue = [
    { day: "Mon", revenue: Math.round(totalRevenue * 0.1) },
    { day: "Tue", revenue: Math.round(totalRevenue * 0.12) },
    { day: "Wed", revenue: Math.round(totalRevenue * 0.11) },
    { day: "Thu", revenue: Math.round(totalRevenue * 0.15) },
    { day: "Fri", revenue: Math.round(totalRevenue * 0.18) },
    { day: "Sat", revenue: Math.round(totalRevenue * 0.19) },
    { day: "Sun", revenue: Math.round(totalRevenue * 0.15) },
  ];

  return (
    <div className="space-y-6 text-white">
      <h1 className="font-heading text-3xl">Dashboard</h1>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Total Revenue", formatCurrency(totalRevenue, "INR")],
          ["Orders", String(orders.length)],
          ["Customers", String(customers.length)],
          ["Conversion Rate", `${conversion}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-white/60">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-accent">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 font-semibold">Revenue (Last 7 Days)</p>
        <RevenueChart data={weeklyRevenue} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Recent Orders</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {orders.slice(0, 5).map((order) => (
              <li key={order.orderNumber}>
                {order.orderNumber} • {order.status} • {formatCurrency(order.total, "INR")}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Alerts</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Pending orders: {pendingOrders}</li>
            <li>Pending reviews: {pendingReviews}</li>
            <li>Inventory split: {inStock} healthy / {lowStock} low stock</li>
            <li>Active delivery partners: {deliveryPartners.length}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
