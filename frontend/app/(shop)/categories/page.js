import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/mock-data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Product Categories",
    description: "Explore OddFinds categories: desk gadgets, kitchen chaos, gift ideas, prank kits, and more.",
    path: "/categories",
  });
}

export default function CategoriesPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 mb-6 text-secondary">Categories</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <Image src={category.image} alt={category.name} width={700} height={450} className="h-52 w-full object-cover" />
            <div className="p-4">
              <h2 className="font-heading text-xl text-secondary">{category.name}</h2>
              <p className="text-sm text-text-muted">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
