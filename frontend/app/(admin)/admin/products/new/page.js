import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Add Product", description: "Create a new product in OddFinds admin.", path: "/admin/products/new" });
}

export default function NewProductPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Add Product</h1>
      <form className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 lg:grid-cols-2">
        <input placeholder="Product name" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Slug" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Price" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Compare-at Price" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <textarea placeholder="Description" rows={5} className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2 lg:col-span-2" />
        <button type="button" className="rounded-lg bg-secondary px-4 py-2 text-sm">✨ Generate Description</button>
        <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">Save Product</button>
      </form>
    </div>
  );
}
