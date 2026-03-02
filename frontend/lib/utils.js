import clsx from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatCurrency(value, currency = "INR") {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function percentOff(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function calculateSavings(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Number(compareAtPrice) - Number(price);
}

export function absoluteUrl(path = "/") {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}${safePath}`;
}

export function randomInt(min, max) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
