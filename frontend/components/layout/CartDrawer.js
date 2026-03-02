"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/stores/cartStore";
import { useUiStore } from "@/stores/uiStore";
import { formatCurrency } from "@/lib/utils";

export default function CartDrawer() {
  const isOpen = useUiStore((state) => state.isCartDrawerOpen);
  const close = useUiStore((state) => state.closeCartDrawer);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.aside
            className="absolute right-0 top-0 h-full w-full max-w-md bg-surface p-5 shadow-elevated"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-xl">Your Cart</h3>
              <button type="button" onClick={close} className="text-sm">
                Close
              </button>
            </div>

            <div className="max-h-[65vh] space-y-3 overflow-y-auto">
              {items.length ? (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 rounded-xl border border-border p-2">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={72}
                      height={72}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs text-text-muted">Qty {item.quantity}</p>
                      <p className="mt-1 text-sm font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted">Your cart is empty.</p>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <Link href="/cart" onClick={close} className="mb-2 block rounded-xl bg-secondary px-4 py-2 text-center text-sm font-semibold text-white">
                View Cart
              </Link>
              <Link href="/checkout" onClick={close} className="block rounded-xl bg-primary px-4 py-2 text-center text-sm font-semibold text-white">
                Checkout
              </Link>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
