import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/catalog-service";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Products", description: "Manage OddFinds product catalog.", path: "/admin/products" });
}

async function loadProducts() {
  const backendBase = process.env.BACKEND_API_URL || "http://localhost:4000";
  try {
    const response = await fetch(`${backendBase}/api/admin/products`, { cache: "no-store" });
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload?.data)) return payload.data;
    }
  } catch {
    // Fall back to runtime seed data if backend is unavailable.
  }
  return getCatalogProducts();
}

export default async function AdminProductsPage() {
  const products = await loadProducts();
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
