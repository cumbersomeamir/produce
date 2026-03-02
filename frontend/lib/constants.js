export const SITE_NAME = "OddFinds";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const FREE_SHIPPING_THRESHOLD = 999;

export const NAV_LINKS = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/procurement", label: "Procurement" },
  { href: "/admin/delivery", label: "Delivery" },
  { href: "/admin/emails", label: "Emails" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/ai-center", label: "AI Center" },
  { href: "/admin/settings", label: "Settings" },
];
