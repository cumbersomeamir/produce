import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "About OddFinds",
    description:
      "OddFinds exists to make the internet's most unexpected products accessible with trustworthy quality and service.",
    path: "/about",
  });
}

export default function AboutPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">About OddFinds</h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3 text-text-muted">
          <p>
            OddFinds started with one belief: weird products deserve a better shopping experience. We curate bizarre,
            delightful, and viral-worthy items from reliable makers and suppliers, then deliver them through a premium,
            transparent checkout and support process.
          </p>
          <p>
            Our mission is simple: make the internet&apos;s weirdest products accessible without compromising quality,
            shipping reliability, or trust.
          </p>
          <p>
            Every listing is reviewed for product quality, realistic fulfillment timelines, and clear return options so
            customers can buy with confidence, not chaos.
          </p>
        </div>
        <aside className="rounded-2xl border border-border bg-surface p-4">
          <h2 className="font-heading text-xl text-secondary">Our Values</h2>
          <ul className="mt-3 space-y-2 text-sm text-text-muted">
            <li>Curated over crowded</li>
            <li>Playful product, serious operations</li>
            <li>Clear pricing and clear policies</li>
            <li>Fast support and fair returns</li>
          </ul>
          <div className="mt-4 h-40 rounded-xl bg-surface-elevated" aria-label="Team photo placeholder" />
        </aside>
      </div>
    </div>
  );
}
