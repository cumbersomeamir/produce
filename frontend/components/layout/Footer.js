import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-policy", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-elevated py-10">
      <div className="container-main grid gap-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-secondary">OddFinds</p>
          <p className="mt-2 text-sm text-text-muted">
            Premium weirdness delivered. Made with 🤪 in India.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary">
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <p className="text-sm font-semibold">Payments</p>
          <p className="mt-1 text-sm text-text-muted">UPI, Cards, Wallets, Razorpay, Stripe</p>
          <p className="mt-3 text-xs uppercase tracking-[0.08em] text-text-muted">3,847 happy weirdos served</p>
        </div>
      </div>
    </footer>
  );
}
