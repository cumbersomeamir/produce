"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <article className="grid grid-cols-[96px_1fr_auto] gap-4 rounded-2xl border border-border bg-surface p-3">
      <Image
        src={item.product.images[0]}
        alt={item.product.name}
        width={96}
        height={96}
        className="h-24 w-24 rounded-xl object-cover"
      />

      <div>
        <p className="font-semibold text-secondary">{item.product.name}</p>
        <p className="text-sm text-text-muted">{item.product.shortDescription}</p>
        <p className="mt-2 text-sm font-semibold">{formatCurrency(item.product.price)}</p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2">
        <button type="button" onClick={() => onRemove(item.product.id)} aria-label="Remove item" className="text-error">
          <Trash2 size={16} />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border px-2 py-1">
          <button type="button" onClick={() => onQuantityChange(item.product.id, item.quantity - 1)} aria-label="Decrease quantity">
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button type="button" onClick={() => onQuantityChange(item.product.id, item.quantity + 1)} aria-label="Increase quantity">
            <Plus size={14} />
          </button>
        </div>
        <p className="text-sm font-semibold">{formatCurrency(item.product.price * item.quantity)}</p>
      </div>
    </article>
  );
}
