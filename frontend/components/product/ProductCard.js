"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import UrgencyBadge from "@/components/product/UrgencyBadge";
import { formatCurrency, percentOff } from "@/lib/utils";
import { useCartStore } from "@/stores/cartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const isLowStock = product.inventory <= product.lowStockThreshold;
  const salePercent = percentOff(product.price, product.compareAtPrice);

  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
    >
      <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {product.isNew ? <Badge className="absolute left-3 top-3" tone="accent">NEW</Badge> : null}
        {salePercent > 0 ? (
          <Badge className="absolute right-3 top-3" tone="success">
            {salePercent}% OFF
          </Badge>
        ) : null}
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <Link href={`/products/${product.slug}`} className="font-heading text-lg leading-tight hover:text-primary">
            {product.name}
          </Link>
          <p className="mt-1 text-sm text-text-muted">{product.shortDescription}</p>
        </div>

        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="flex items-center gap-2">
          <p className="font-mono text-lg font-bold text-secondary">{formatCurrency(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="text-sm text-text-muted line-through">{formatCurrency(product.compareAtPrice)}</p>
          ) : null}
        </div>

        {isLowStock ? <UrgencyBadge type="low-stock" value={product.inventory} /> : null}

        <Button
          className="w-full"
          onClick={() => addItem(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </Button>
      </div>
    </motion.article>
  );
}
