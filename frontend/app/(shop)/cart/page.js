import CartPageClient from "@/app/(shop)/cart/CartPageClient";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Your Cart",
    description: "Review your selected odd finds, apply discounts, and continue to secure checkout.",
    path: "/cart",
  });
}

export default function CartPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 mb-6 text-secondary">Your Cart</h1>
      <CartPageClient />
    </div>
  );
}
