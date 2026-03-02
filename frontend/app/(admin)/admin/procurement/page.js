import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const tools = [
  ["Product Finder", "/admin/procurement/product-finder"],
  ["Landed Cost Calculator", "/admin/procurement/cost-calculator"],
  ["Suppliers", "/admin/procurement/suppliers"],
  ["Negotiations", "/admin/procurement/negotiations"],
];

export function generateMetadata() {
  return createMetadata({ title: "Procurement Center", description: "AI-powered sourcing and procurement workflows.", path: "/admin/procurement" });
}

export default function ProcurementHomePage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Procurement Center</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {tools.map(([label, href]) => (
          <Link key={href} href={href} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
