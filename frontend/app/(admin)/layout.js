"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_LINKS } from "@/lib/constants";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-shell min-h-screen bg-[#f4f8ff] text-[#123a86]">
      <div className="mx-auto max-w-[1480px] px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#b7c8ea] bg-white px-5 py-4 shadow-[0_10px_24px_rgba(18,58,134,0.12)]">
          <div>
            <p className="font-display text-2xl leading-none text-[#123a86]">OddFinds Admin</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#3a5f9e]">Operations Console</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link href="/" className="rounded-lg border border-[#b7c8ea] bg-white px-3 py-1.5 text-[#123a86] hover:bg-[#eef4ff]">
              Storefront
            </Link>
            <Link
              href="/admin/dashboard"
              className="admin-keep-white admin-solid-blue rounded-lg bg-[#123a86] px-3 py-1.5 font-semibold text-white hover:bg-[#0d2e6e]"
            >
              Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
          <aside className="rounded-2xl border border-[#b7c8ea] bg-white p-4 shadow-[0_10px_22px_rgba(18,58,134,0.1)]">
            <p className="px-2 text-xs uppercase tracking-[0.12em] text-[#5a77ad]">Control Center</p>
            <nav className="mt-3 flex flex-col gap-1.5 text-sm">
              {ADMIN_LINKS.map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-3 py-2.5 transition ${
                      active
                        ? "admin-keep-white admin-solid-blue bg-[#123a86] text-white shadow-[0_0_0_1px_rgba(18,58,134,0.3)]"
                        : "text-[#123a86] hover:bg-[#eef4ff]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="rounded-2xl border border-[#b7c8ea] bg-white p-6 shadow-[0_10px_22px_rgba(18,58,134,0.1)]">{children}</main>
        </div>
      </div>
    </div>
  );
}
