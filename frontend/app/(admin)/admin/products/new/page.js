import { createMetadata } from "@/lib/seo";
import { categories } from "@/lib/mock-data";
import ProductFormClient from "@/app/(admin)/admin/products/components/ProductFormClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Add Product", description: "Create a new product in OddFinds admin.", path: "/admin/products/new" });
}

export default function NewProductPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Add Product</h1>
      <ProductFormClient mode="create" categories={categories} />
    </div>
  );
}
