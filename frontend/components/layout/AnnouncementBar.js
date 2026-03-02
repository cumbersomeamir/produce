"use client";

import { motion } from "framer-motion";

const messages = [
  "FREE SHIPPING on orders ₹999+",
  "Use code ODDWEEK for 15% off",
  "New drops every Thursday",
];

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden border-b border-border bg-secondary py-2 text-xs font-semibold uppercase tracking-[0.08em] text-text-inverse">
      <motion.div
        className="flex w-max gap-8 whitespace-nowrap px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {[...messages, ...messages, ...messages].map((message, idx) => (
          <span key={`${message}-${idx}`}>🔥 {message}</span>
        ))}
      </motion.div>
    </div>
  );
}
