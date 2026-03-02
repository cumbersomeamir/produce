"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { useUiStore } from "@/stores/uiStore";

export default function MobileMenu() {
  const isOpen = useUiStore((state) => state.isMobileMenuOpen);
  const close = useUiStore((state) => state.closeMobileMenu);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.aside
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="h-full w-72 bg-surface p-5"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-xl">OddFinds</p>
              <button type="button" onClick={close} className="text-sm">
                Close
              </button>
            </div>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={close} className="rounded-lg px-3 py-2 hover:bg-surface-elevated">
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
