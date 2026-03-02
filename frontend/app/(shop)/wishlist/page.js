import WishlistClient from "@/app/(shop)/wishlist/WishlistClient";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Wishlist",
    description: "Your saved OddFinds products ready to move to cart.",
    path: "/wishlist",
  });
}

export default function WishlistPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 mb-6 text-secondary">Wishlist</h1>
      <WishlistClient />
    </div>
  );
}
