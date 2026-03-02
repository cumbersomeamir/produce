import Link from "next/link";
import { ADMIN_LINKS } from "@/lib/constants";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0f1022] text-white">
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 lg:grid-cols-[250px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-[#141739] p-4">
          <p className="font-display text-2xl text-accent">OddFinds Admin</p>
          <p className="mt-1 text-xs uppercase tracking-[0.08em] text-white/60">Control Center</p>
          <nav className="mt-5 flex flex-col gap-1 text-sm">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="rounded-2xl border border-white/10 bg-[#141739] p-6">{children}</div>
      </div>
    </div>
  );
}
