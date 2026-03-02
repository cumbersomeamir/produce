import { createMetadata } from "@/lib/seo";
import ProductFinderClient from "@/app/(admin)/admin/procurement/product-finder/ProductFinderClient";

export function generateMetadata() {
  return createMetadata({ title: "Procurement Product Finder", description: "Find trending products and sourcing options.", path: "/admin/procurement/product-finder" });
}

export default function ProcurementProductFinderPage() {
  return <ProductFinderClient />;
}
