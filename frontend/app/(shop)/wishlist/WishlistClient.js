"use client";

import ProductCard from "@/components/product/ProductCard";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function WishlistClient() {
  const items = useWishlistStore((state) => state.items);

  if (!items.length) {
    return <p className="text-text-muted">No saved products yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
