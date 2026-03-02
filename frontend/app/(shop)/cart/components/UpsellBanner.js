import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/mock-data";

export default function UpsellBanner() {
  const picks = products.slice(2, 5);

  return (
    <section className="mt-10">
      <h3 className="mb-4 font-heading text-2xl text-secondary">You might also like</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
