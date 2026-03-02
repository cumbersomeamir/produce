"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-text-inverse hover:bg-primary-dark",
  secondary: "bg-secondary text-text-inverse hover:bg-secondary-light",
  ghost: "bg-transparent text-text hover:bg-surface-elevated",
  accent: "bg-accent text-secondary hover:bg-accent-dark",
};

export default function Button({
  as: Component = "button",
  className,
  variant = "primary",
  children,
  ...props
}) {
  return (
    <motion.div whileTap={{ scale: 0.97 }} className="inline-block">
      <Component
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    </motion.div>
  );
}
