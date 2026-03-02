"use client";

import { useCartStore } from "@/stores/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = useCartStore((state) => state.subtotal());
  const count = useCartStore((state) => state.count());

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    subtotal,
    count,
  };
}
