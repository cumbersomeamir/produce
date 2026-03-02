import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Contact OddFinds",
    description: "Contact OddFinds support for orders, returns, partnerships, and wholesale inquiries.",
    path: "/contact",
  });
}

export default function ContactPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Contact Us</h1>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <form className="space-y-3 rounded-2xl border border-border bg-surface p-4">
          <input placeholder="Name" className="w-full rounded-xl border border-border px-3 py-2" />
          <input placeholder="Email" type="email" className="w-full rounded-xl border border-border px-3 py-2" />
          <textarea placeholder="How can we help?" rows={5} className="w-full rounded-xl border border-border px-3 py-2" />
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 font-semibold text-white">
            Send Message
          </button>
        </form>
        <aside className="rounded-2xl border border-border bg-surface p-4 text-sm text-text-muted">
          <p><strong>Email:</strong> hello@oddfinds.com</p>
          <p className="mt-2"><strong>Phone:</strong> +91 98765 43210</p>
          <p className="mt-2"><strong>Business Address:</strong> 42 Curio Lane, Bengaluru, Karnataka 560001, India</p>
          <p className="mt-4">Support hours: Monday to Saturday, 10:00 AM to 7:00 PM IST.</p>
        </aside>
      </div>
    </div>
  );
}
