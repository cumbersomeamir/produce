import ProductCard from "@/components/product/ProductCard";
import CountdownTimer from "@/components/ui/CountdownTimer";
import Badge from "@/components/ui/Badge";
import { deals } from "@/lib/mock-data";
import { getCatalogProducts, getTrendingProducts } from "@/lib/catalog-service";
import { createMetadata } from "@/lib/seo";
import { percentOff } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({
    title: "Flash Deals & Daily Drops",
    description: "Limited-time flash deals, daily drop specials, and bundle offers on OddFinds.",
    path: "/deals",
  });
}

export default async function DealsPage() {
  const products = await getCatalogProducts();
  const dealProducts = deals
    .map((deal) => ({ ...deal, product: products.find((product) => product.slug === deal.productSlug) }))
    .filter((deal) => deal.product);
  const clearanceProducts = getTrendingProducts(products, 4, { fallbackToAll: true });

  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Deals</h1>
      <p className="mt-2 text-text-muted">Real countdown timers. No fake resets.</p>

      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        {dealProducts.map((deal) => {
          const off = percentOff(deal.product.price, deal.product.compareAtPrice);
          return (
            <article key={deal.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-heading text-2xl text-secondary">{deal.product.name}</h2>
                <Badge tone="danger">{off}% OFF</Badge>
              </div>
              <CountdownTimer targetDate={deal.dealEndsAt} className="rounded-lg bg-surface-elevated px-3 py-2" />
              <div className="mt-4">
                <ProductCard product={deal.product} />
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-10">
        <h2 className="h2 mb-4 text-secondary">Clearance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clearanceProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
