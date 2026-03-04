import { createMetadata } from "@/lib/seo";
import { categories } from "@/lib/mock-data";
import { getCatalogProductById } from "@/lib/catalog-service";
import ProductFormClient from "@/app/(admin)/admin/products/components/ProductFormClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return createMetadata({ title: `Edit Product ${id}`, description: "Update product details.", path: `/admin/products/${id}` });
}

async function loadProduct(id) {
  const backendBase = process.env.BACKEND_API_URL || "http://localhost:4000";
  try {
    const response = await fetch(`${backendBase}/api/admin/products?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const payload = await response.json();
      if (payload?.data) return payload.data;
    }
  } catch {
    // Fall back to runtime seed data if backend is unavailable.
  }
  return getCatalogProductById(id);
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const product = await loadProduct(id);

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
