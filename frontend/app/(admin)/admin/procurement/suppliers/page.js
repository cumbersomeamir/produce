import { createMetadata } from "@/lib/seo";
import SuppliersClient from "@/app/(admin)/admin/procurement/suppliers/SuppliersClient";

export function generateMetadata() {
  return createMetadata({ title: "Suppliers", description: "Supplier directory and communication threads.", path: "/admin/procurement/suppliers" });
}

export default function SuppliersPage() {
  return <SuppliersClient />;
}
