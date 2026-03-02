"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";

export default function ProductCarousel({ products = [] }) {
  return (
    <motion.div
      className="flex gap-4 overflow-x-auto pb-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      {products.map((product) => (
        <div key={product.id} className="min-w-[260px] max-w-[260px]">
          <ProductCard product={product} />
        </div>
      ))}
    </motion.div>
  );
}
