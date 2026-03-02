"use client";

import Image from "next/image";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export default function QuickView({ open, onClose, product, onAdd }) {
  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title={product.name}>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={160}
          height={160}
          className="h-40 w-full rounded-xl object-cover"
        />
        <div>
          <p className="text-sm text-text-muted">{product.shortDescription}</p>
          <p className="mt-2 font-mono text-xl font-bold text-secondary">{formatCurrency(product.price)}</p>
          <Button className="mt-3" onClick={() => onAdd(product)}>
            Add to Cart
          </Button>
        </div>
      </div>
    </Modal>
  );
}
