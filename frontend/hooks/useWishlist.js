"use client";

import { useWishlistStore } from "@/stores/wishlistStore";

export function useWishlist() {
  const items = useWishlistStore((state) => state.items);
  const toggle = useWishlistStore((state) => state.toggle);
  const has = useWishlistStore((state) => state.has);

  return { items, toggle, has };
}
