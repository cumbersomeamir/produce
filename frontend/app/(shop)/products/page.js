import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/app/(shop)/products/components/FilterSidebar";
import SortDropdown from "@/app/(shop)/products/components/SortDropdown";
import { categories, products } from "@/lib/mock-data";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export function generateMetadata({ searchParams }) {
  const category = searchParams?.category;
  const selected = categories.find((item) => item.slug === category);
  return createMetadata({
    title: selected ? `${selected.name} Products` : "Shop All Products",
    description:
      "Browse the full OddFinds catalog: quirky gadgets, absurd gifts, and viral products with premium checkout.",
    path: "/products",
  });
}

function sortProducts(list, sortBy) {
  const items = [...list];
  if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
  if (sortBy === "newest") items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
  if (sortBy === "reviewed") items.sort((a, b) => b.reviewCount - a.reviewCount);
  if (sortBy === "popular") items.sort((a, b) => b.sold24h - a.sold24h);
  return items;
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const page = Number(params?.page || 1);
  const pageSize = 8;
  const sort = params?.sort || "popular";

  let filtered = [...products];
  if (params?.category) filtered = filtered.filter((item) => item.category === params.category);
  if (params?.availability === "in-stock") filtered = filtered.filter((item) => item.inventory > 0);
  if (params?.rating) filtered = filtered.filter((item) => item.rating >= Number(params.rating));

  const sorted = sortProducts(filtered, sort);
  const paged = sorted.slice(0, page * pageSize);

  const hasMore = paged.length < sorted.length;
  const nextParams = new URLSearchParams(params || {});
  nextParams.set("page", String(page + 1));

  return (
    <div className="container-main py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Products", path: "/products" },
        ])}
      />

      <header className="mb-8">
        <h1 className="h1 text-secondary">Shop Weird Finds</h1>
        <p className="mt-2 max-w-2xl text-text-muted">
          Curated outlandish products with real quality, fast shipping, and prices in INR.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar />

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">{sorted.length} products found</p>
            <SortDropdown />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore ? (
            <div className="mt-6 text-center">
              <Link
                href={`/products?${nextParams.toString()}`}
                className="inline-flex rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-elevated"
              >
                Load More
              </Link>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
