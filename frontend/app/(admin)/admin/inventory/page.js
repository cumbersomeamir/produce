import { products } from "@/lib/mock-data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Inventory", description: "Manage stock levels and threshold alerts.", path: "/admin/inventory" });
}

export default function AdminInventoryPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Inventory</h1>
      <div className="mt-4 space-y-2">
        {products.map((product) => (
          <div
            key={product.id}
            className={`rounded-xl border p-3 ${
              product.inventory <= product.lowStockThreshold ? "border-red-400 bg-red-500/10" : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p>{product.name}</p>
              <input defaultValue={product.inventory} className="w-20 rounded border border-white/20 bg-[#0f1022] px-2 py-1 text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
