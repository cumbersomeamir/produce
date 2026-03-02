import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const suppliers = [
  ["sup-1", "Mumbai Oddities Pvt Ltd", "IndiaMART", "4/5"],
  ["sup-2", "Chaos Labs Export", "Alibaba", "5/5"],
  ["sup-3", "QuirkKart Source", "Local", "3/5"],
];

export function generateMetadata() {
  return createMetadata({ title: "Suppliers", description: "Supplier directory and communication threads.", path: "/admin/procurement/suppliers" });
}

export default function SuppliersPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Suppliers</h1>
      <div className="mt-4 space-y-2">
        {suppliers.map((supplier) => (
          <Link key={supplier[0]} href={`/admin/procurement/suppliers/${supplier[0]}`} className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
            <p className="font-semibold">{supplier[1]}</p>
            <p className="text-sm text-white/70">{supplier[2]} • Rating {supplier[3]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
