import { addHours, format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Eye } from "lucide-react";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import StarRating from "@/components/ui/StarRating";
import ImageZoom from "@/components/product/ImageZoom";
import ProductCard from "@/components/product/ProductCard";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import JsonLd from "@/components/seo/JsonLd";
import ProductDetailsTabs from "@/app/(shop)/products/[slug]/ProductDetailsTabs";
import PurchaseToast from "@/app/(shop)/products/[slug]/PurchaseToast";
import TrackRecentlyViewed from "@/app/(shop)/products/[slug]/TrackRecentlyViewed";
import { reviews } from "@/lib/mock-data";
import { getCatalogProducts } from "@/lib/catalog-service";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";
import { calculateSavings, formatCurrency, percentOff, randomInt } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const products = await getCatalogProducts();
  const product = products.find((item) => item.slug === slug) || products[0];

  if (!product) {
    return createMetadata({
      title: "Product not found",
      description: "Product not found.",
      path: "/products",
    });
  }

  return createMetadata({
    title: `${product.name} — Buy Online`,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.images[0],
  });
}

function selectUrgency(product) {
  const blocks = [];

  if (product.inventory <= product.lowStockThreshold) {
    blocks.push({
      key: "stock",
      content: `⚡ Only ${product.inventory} left in stock — order soon`,
      tone: "danger",
    });
  }

  const viewers = product.fakeViewers + randomInt(1, 5);
  blocks.push({
    key: "viewers",
    content: `${viewers} people are viewing this right now`,
    tone: "warning",
    icon: <Eye size={14} />,
  });

  const cutoff = addHours(new Date(), 6);
  blocks.push({
    key: "delivery",
    content: `🚚 Order within 6 hours for delivery by ${format(addHours(new Date(), 4), "EEE, dd MMM")}`,
    tone: "default",
    date: cutoff.toISOString(),
  });

  blocks.push({
    key: "sold",
    content: `📦 ${product.sold24h} sold in the last 24 hours`,
    tone: "default",
  });

  return blocks.slice(0, 3);
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const products = await getCatalogProducts();
  const product = products.find((item) => item.slug === slug) || null;

  if (!product) {
    return (
      <div className="container-main py-14">
        <h1 className="h1 text-secondary">Product not found</h1>
      </div>
    );
  }

  const productReviews = reviews.filter((review) => review.productId === product.id);
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const urgencyBlocks = selectUrgency(product);
  const salePercent = percentOff(product.price, product.compareAtPrice);
  const savings = calculateSavings(product.price, product.compareAtPrice);
  const soldPercent = Math.min(95, Math.max(20, Math.round((product.sold24h / (product.sold24h + product.inventory)) * 100)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inventory > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/products/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="container-main py-8">
      <JsonLd data={jsonLd} />
      <JsonLd
        data={
          breadcrumbJsonLd([
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ])
        }
      />

      <TrackRecentlyViewed productId={product.id} />
      <PurchaseToast productName={product.name} />

      <Breadcrumbs items={[{ name: "Products", path: "/products" }, { name: product.name, path: "#", current: true }]} />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <ImageZoom src={product.images[0]} alt={product.name} />
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <Image
                key={`${image}-${index}`}
                src={image}
                alt={`${product.name} ${index + 1}`}
                width={180}
                height={180}
                className="aspect-square rounded-xl object-cover"
              />
            ))}
          </div>
        </div>

        <div>
          <Badge tone="accent">Trusted by 3,800+ happy customers</Badge>
          <h1 className="mt-3 h1 text-secondary">{product.name}</h1>
          <p className="mt-2 text-text-muted">{product.shortDescription}</p>

          <div className="mt-4 flex items-center gap-3">
            <p className="font-mono text-3xl font-bold text-secondary">{formatCurrency(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-lg text-text-muted line-through">{formatCurrency(product.compareAtPrice)}</p>
            ) : null}
          </div>

          {salePercent > 0 ? (
            <p className="mt-1 text-sm text-success">
              You save {formatCurrency(savings)} ({salePercent}%)
            </p>
          ) : null}

          <div className="mt-3">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          <div className="mt-5 space-y-2">
            {urgencyBlocks.map((block) => (
              <p
                key={block.key}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  block.tone === "danger" ? "bg-error/10 text-error" : block.tone === "warning" ? "bg-warning/20" : "bg-surface-elevated"
                }`}
              >
                {block.icon || null}
                {block.content}
              </p>
            ))}
            <ProgressBar value={soldPercent} label={`${soldPercent}% sold`} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button className="min-w-40">Add to Cart</Button>
            <Button variant="ghost" className="min-w-40 border border-border">
              Add to Wishlist
            </Button>
            <Button as={Link} href="/checkout" variant="secondary" className="min-w-40">
              Buy Now
            </Button>
          </div>

          <p className="mt-4 text-sm text-text-muted">SKU: {product.sku}</p>
        </div>
      </div>

      <ProductDetailsTabs product={product} reviews={productReviews} />

      <section className="mt-12">
        <h2 className="h2 mb-4 text-secondary">Related Products</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </div>
  );
}
