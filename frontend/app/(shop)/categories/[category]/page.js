import ProductCard from "@/components/product/ProductCard";
import { categories } from "@/lib/mock-data";
import { getCatalogProducts } from "@/lib/catalog-service";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const category = categories.find((item) => item.slug === categorySlug);
  return createMetadata({
    title: category ? `${category.name}` : "Category",
    description: category?.description || "OddFinds category products",
    path: `/categories/${categorySlug}`,
  });
}

export default async function CategoryDetailPage({ params }) {
  const { category } = await params;
  const products = await getCatalogProducts();
  const selected = categories.find((item) => item.slug === category);
  const list = products.filter((product) => product.category === category);

  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">{selected?.name || "Category"}</h1>
      <p className="mt-2 text-text-muted">{selected?.description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
