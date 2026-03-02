import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import CountdownTimer from "@/components/ui/CountdownTimer";
import ProgressBar from "@/components/ui/ProgressBar";
import ProductCard from "@/components/product/ProductCard";
import ProductCarousel from "@/components/product/ProductCarousel";
import SocialProofTicker from "@/components/product/SocialProofTicker";
import JsonLd from "@/components/seo/JsonLd";
import { categories, deals, reviews } from "@/lib/mock-data";
import { listProducts } from "@/lib/runtime/catalog-store";
import { createMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({
    title: "OddFinds — The Internet's Weirdest Store | Unique & Fun Products",
    description:
      "Ridiculously fun products you didn't know you needed. Shop curated weirdness with a premium checkout flow.",
    path: "/",
    keywords: ["quirky gifts", "viral products", "weird gadgets", "OddFinds"],
  });
}

export default function HomePage() {
  const products = listProducts();
  const trending = products.slice(0, 8);
  const newArrivals = products.filter((item) => item.isNew).concat(products.slice(0, 4)).slice(0, 8);
  const todaysDeal = products.find((item) => item.slug === deals[0].productSlug) || products[0];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <section className="hero-gradient relative overflow-hidden text-white">
        <div className="container-main grid min-h-[68vh] items-center gap-8 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Badge tone="accent" className="mb-4 text-secondary">
              Curated Marketplace
            </Badge>
            <h1 className="text-display">The Internet&apos;s Weirdest Store</h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">
              Ridiculously fun products you didn&apos;t know you needed. Premium shopping, chaotic finds.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button as={Link} href="/products" variant="accent">
                Shop the Weird →
              </Button>
              <Button as={Link} href="/account" variant="secondary">
                Customer Flow
              </Button>
              <Button as={Link} href="/admin/dashboard" variant="secondary">
                Admin Flow
              </Button>
              <Button as={Link} href="/deals" variant="ghost" className="border border-white/25 text-white hover:bg-white/10">
                View Daily Drops
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-12 -top-8 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur">
              <p className="text-caption text-accent">Trending Feature</p>
              <h2 className="mt-2 font-heading text-3xl">{trending[0].name}</h2>
              <p className="mt-2 text-sm text-white/85">{trending[0].shortDescription}</p>
              <Image
                src={trending[0].images[0]}
                alt={trending[0].name}
                width={450}
                height={450}
                className="mt-4 w-full rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-main py-14">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="h2 text-secondary">🔥 Trending Now</h2>
          <Link href="/products" className="text-sm font-semibold text-primary">
            Browse all
          </Link>
        </div>
        <ProductCarousel products={trending} />
      </section>

      <section className="container-main py-4">
        <h2 className="h2 mb-6 text-secondary">Shop by Weird Category</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="group relative overflow-hidden rounded-2xl border border-border">
              <Image
                src={category.image}
                alt={category.name}
                width={700}
                height={500}
                className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h3 className="font-heading text-xl">{category.name}</h3>
                <p className="text-sm text-white/85">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-main py-14">
        <div className="deal-gradient overflow-hidden rounded-3xl p-6 text-white sm:p-8">
          <p className="text-caption text-white/90">Today&apos;s Steal</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_260px]">
            <div>
              <h2 className="h2 text-white">{todaysDeal.name}</h2>
              <p className="mt-2 text-white/90">{todaysDeal.shortDescription}</p>
              <div className="mt-4 flex items-center gap-4">
                <CountdownTimer targetDate={deals[0].dealEndsAt} className="rounded-lg bg-black/20 px-3 py-2" />
                <Button as={Link} href={`/products/${todaysDeal.slug}`} variant="secondary">
                  Grab Deal
                </Button>
              </div>
              <div className="mt-4 max-w-md">
                <ProgressBar value={deals[0].claimedPercent} label={`${deals[0].claimedPercent}% claimed`} />
              </div>
            </div>
            <Image
              src={todaysDeal.images[0]}
              alt={todaysDeal.name}
              width={260}
              height={260}
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-main py-4">
        <h2 className="h2 mb-6 text-secondary">New Arrivals</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-main py-10">
        <SocialProofTicker />
      </section>

      <section className="container-main py-10">
        <h2 className="h2 mb-6 text-secondary">Why OddFinds?</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Curated Weirdness", "Only the most impulse-buyable oddities."],
            ["Fast Shipping", "Quick dispatch across India and beyond."],
            ["Easy Returns", "Simple 7-day return process."],
            ["Secure Payments", "Razorpay + Stripe trusted checkout."],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-2xl border border-border bg-surface p-4">
              <h3 className="font-heading text-lg text-secondary">{title}</h3>
              <p className="mt-1 text-sm text-text-muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container-main py-10">
        <h2 className="h2 mb-6 text-secondary">Customer Love</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review) => {
            const product = products.find((item) => item.id === review.productId);
            return (
              <article key={review.id} className="rounded-2xl border border-border bg-surface p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Image
                    src={product?.images?.[0] || "https://picsum.photos/seed/review/200/200"}
                    alt={product?.name || "Reviewed product"}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold">{review.authorName}</p>
                    <p className="text-xs text-text-muted">{review.authorLocation}</p>
                  </div>
                </div>
                <p className="font-medium text-secondary">{review.title}</p>
                <p className="mt-1 text-sm text-text-muted">{review.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="container-main py-14">
        <div className="rounded-3xl border border-border bg-surface p-8 text-center">
          <h2 className="h2 text-secondary">Get weird first. New drops in your inbox.</h2>
          <p className="mx-auto mt-2 max-w-xl text-text-muted">
            Exclusive weekly drops, flash deals, and oddities before they go viral.
          </p>
          <form className="mx-auto mt-5 flex max-w-lg flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-xl border border-border px-3"
              aria-label="Email"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>
    </>
  );
}
