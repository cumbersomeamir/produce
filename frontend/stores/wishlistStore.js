"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        if (exists) {
          set({ items: get().items.filter((item) => item.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },
      has: (productId) => get().items.some((item) => item.id === productId),
    }),
    {
      name: "oddfinds-wishlist",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
