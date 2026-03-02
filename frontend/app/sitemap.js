import { categories, products } from "@/lib/mock-data";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = [
    "",
    "/products",
    "/categories",
    "/deals",
    "/cart",
    "/checkout",
    "/about",
    "/contact",
    "/faq",
    "/shipping-policy",
    "/returns",
    "/privacy-policy",
    "/terms",
    "/blog",
    "/login",
    "/register",
    "/track-order",
  ];

  const productRoutes = products.map((product) => `/products/${product.slug}`);
  const categoryRoutes = categories.map((category) => `/categories/${category.slug}`);

  return [...staticRoutes, ...productRoutes, ...categoryRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
