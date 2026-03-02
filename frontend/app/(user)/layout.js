import Link from "next/link";

const links = [
  { href: "/account", label: "Account" },
  { href: "/orders", label: "Orders" },
  { href: "/reviews", label: "Reviews" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function UserLayout({ children }) {
  return (
    <div className="container-main py-8">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-border bg-surface p-4">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-text-muted">Dashboard</p>
          <nav className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-surface-elevated">
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
