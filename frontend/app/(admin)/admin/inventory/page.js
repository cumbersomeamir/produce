import { createMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/lib/catalog-service";
import InventoryClient from "@/app/(admin)/admin/inventory/InventoryClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Inventory", description: "Manage stock levels and threshold alerts.", path: "/admin/inventory" });
}

async function loadInventory() {
  const backendBase = process.env.BACKEND_API_URL || "http://localhost:4000";
  try {
    const response = await fetch(`${backendBase}/api/admin/inventory`, { cache: "no-store" });
    if (response.ok) {
      const payload = await response.json();
      if (Array.isArray(payload?.data)) return payload.data;
    }
  } catch {
    // Fall back to the catalog endpoint if backend inventory route fails.
  }

  const products = await getCatalogProducts();
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    quantity: product.inventory,
    lowStockThreshold: product.lowStockThreshold,
  }));
}

export default async function AdminInventoryPage() {
  const items = await loadInventory();
  return <InventoryClient initialItems={items} />;
}
