import { createMetadata } from "@/lib/seo";
import { listProducts } from "@/lib/runtime/catalog-store";
import InventoryClient from "@/app/(admin)/admin/inventory/InventoryClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Inventory", description: "Manage stock levels and threshold alerts.", path: "/admin/inventory" });
}

export default function AdminInventoryPage() {
  const items = listProducts().map((product) => ({
    id: product.id,
    name: product.name,
    quantity: product.inventory,
    lowStockThreshold: product.lowStockThreshold,
  }));
  return <InventoryClient initialItems={items} />;
}
