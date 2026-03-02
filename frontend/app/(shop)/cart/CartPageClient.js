"use client";

import Link from "next/link";
import CartItem from "@/app/(shop)/cart/components/CartItem";
import CartSummary from "@/app/(shop)/cart/components/CartSummary";
import UpsellBanner from "@/app/(shop)/cart/components/UpsellBanner";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/stores/cartStore";

export default function CartPageClient() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.subtotal());

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-10 text-center">
        <h2 className="font-heading text-3xl text-secondary">Your cart is lonely. Let&apos;s fix that.</h2>
        <p className="mt-2 text-text-muted">No weird finds yet. Browse today&apos;s top picks.</p>
        <Button as={Link} href="/products" className="mt-4">
          Shop Now →
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onRemove={removeItem}
              onQuantityChange={updateQuantity}
            />
          ))}
        </section>

        <CartSummary subtotal={subtotal} />
      </div>

      <UpsellBanner />
    </>
  );
}
