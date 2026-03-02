"use client";

import { motion } from "framer-motion";

export default function SocialProofTicker() {
  const items = [
    "Aarav from Delhi just bought Screaming Goat Mug",
    "3,847 happy weirdos served",
    "Meera from Mumbai grabbed Emotional Support Pickle",
    "Secure payments with Razorpay + Stripe",
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-elevated py-2">
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap px-3 text-xs font-medium"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`}>• {item}</span>
        ))}
      </motion.div>
    </div>
  );
}
