import Link from "next/link";
import { products } from "@/lib/mock-data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Products", description: "Manage OddFinds product catalog.", path: "/admin/products" });
}

export default function AdminProductsPage() {
  return (
    <div className="text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-heading text-3xl">Products</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-secondary">
          Add Product
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-white/10">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">₹{product.price}</td>
                <td className="px-3 py-2">{product.inventory}</td>
                <td className="px-3 py-2">
                  <Link href={`/admin/products/${product.id}`} className="text-accent">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
