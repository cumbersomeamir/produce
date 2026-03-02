import { createMetadata } from "@/lib/seo";

export function generateMetadata({ params }) {
  return createMetadata({ title: `Edit Product ${params.id}`, description: "Update product details.", path: `/admin/products/${params.id}` });
}

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Edit Product {id}</h1>
      <form className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:grid-cols-2">
        <input defaultValue="Sample Product" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input defaultValue="ACTIVE" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input defaultValue="25" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input defaultValue="10" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">Update Product</button>
      </form>
    </div>
  );
}
