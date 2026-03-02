"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = [...get().items];
        const existing = items.find((item) => item.product.id === product.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          items.push({ product, quantity });
        }
        set({ items });
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items
          .map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          )
          .filter((item) => item.quantity > 0);
        set({ items });
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
      },
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
      count: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "oddfinds-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
