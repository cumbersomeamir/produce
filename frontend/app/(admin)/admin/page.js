import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const quickLinks = [
  { href: "/admin/dashboard", label: "Dashboard", copy: "Revenue, orders, and operations KPIs." },
  { href: "/admin/products", label: "Products", copy: "Manage catalog and pricing." },
  { href: "/admin/orders", label: "Orders", copy: "Track status and fulfillment." },
  { href: "/admin/procurement", label: "Procurement", copy: "Source products and negotiate suppliers." },
];

export function generateMetadata() {
  return createMetadata({
    title: "Admin Home",
    description: "OddFinds admin control panel.",
    path: "/admin",
  });
}

export default function AdminHomePage() {
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-2xl border border-white/15 bg-white/5 p-5">
        <h1 className="font-heading text-3xl text-white">Admin Home</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Jump directly to the area you need. All sections now use high-contrast styling for easier readability.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/admin/dashboard" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-[#1b1464]">
            Open Dashboard
          </Link>
          <Link href="/" className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90">
            View Storefront
          </Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {quickLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border border-white/15 bg-white/5 p-4 hover:bg-white/10">
            <p className="text-lg font-semibold text-white">{item.label}</p>
            <p className="mt-1 text-sm text-white/75">{item.copy}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
