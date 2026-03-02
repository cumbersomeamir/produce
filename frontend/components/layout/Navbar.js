"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, SunMoon } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useCartStore } from "@/stores/cartStore";
import { useUiStore } from "@/stores/uiStore";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function Navbar() {
  const cartCount = useCartStore((state) => state.count());
  const openMobileMenu = useUiStore((state) => state.openMobileMenu);
  const openSearch = useUiStore((state) => state.openSearch);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="container-main flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={openMobileMenu} className="md:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <Link href="/" className="font-display text-2xl text-secondary">
            OddFinds
          </Link>
        </div>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={openSearch} aria-label="Search" className="rounded-lg p-2 hover:bg-surface-elevated">
            <Search size={18} />
          </button>
          <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-lg p-2 hover:bg-surface-elevated">
            <SunMoon size={18} />
          </button>
          <button type="button" onClick={openCartDrawer} aria-label="Open cart" className="relative rounded-lg p-2 hover:bg-surface-elevated">
            <ShoppingBag size={18} />
            {cartCount ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            ) : null}
          </button>
          <Link href="/login" className="hidden rounded-xl bg-secondary px-3 py-1.5 text-sm font-semibold text-white sm:inline-flex">
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
