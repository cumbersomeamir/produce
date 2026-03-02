import RevenueChart from "@/app/(admin)/admin/dashboard/components/RevenueChart";
import { createMetadata } from "@/lib/seo";

const data = [
  { day: "Mon", revenue: 12000 },
  { day: "Tue", revenue: 14500 },
  { day: "Wed", revenue: 13200 },
  { day: "Thu", revenue: 18400 },
  { day: "Fri", revenue: 22500 },
  { day: "Sat", revenue: 24300 },
  { day: "Sun", revenue: 19600 },
];

export function generateMetadata() {
  return createMetadata({
    title: "Admin Dashboard",
    description: "OddFinds admin KPIs, revenue trends, recent orders, and operational alerts.",
    path: "/admin/dashboard",
  });
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 text-white">
      <h1 className="font-heading text-3xl">Dashboard</h1>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Today's Revenue", "₹2,43,200"],
          ["Orders", "184"],
          ["New Customers", "62"],
          ["Conversion Rate", "3.9%"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.08em] text-white/60">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-accent">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 font-semibold">Revenue (Last 7 Days)</p>
        <RevenueChart data={data} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Recent Orders</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>ODF-104932 • Processing • ₹2,199</li>
            <li>ODF-104931 • Pending • ₹699</li>
            <li>ODF-104930 • Shipped • ₹1,459</li>
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="font-semibold">Alerts</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li>Low stock: Portable Clouds Night Light</li>
            <li>Pending reviews: 12</li>
            <li>AI agents online: 5/5 core agents</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
