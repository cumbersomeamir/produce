import { createMetadata } from "@/lib/seo";
import { categories } from "@/lib/mock-data";
import { findProductById } from "@/lib/runtime/catalog-store";
import ProductFormClient from "@/app/(admin)/admin/products/components/ProductFormClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return createMetadata({ title: `Edit Product ${id}`, description: "Update product details.", path: `/admin/products/${id}` });
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = findProductById(id);

  if (!product) {
    return (
      <div className="text-white">
        <h1 className="font-heading text-3xl">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Edit Product {id}</h1>
      <ProductFormClient mode="edit" initialProduct={product} categories={categories} />
    </div>
  );
}
