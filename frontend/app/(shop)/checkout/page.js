import CheckoutForm from "@/app/(shop)/checkout/components/CheckoutForm";
import OrderSummary from "@/app/(shop)/checkout/components/OrderSummary";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Checkout",
    description: "Secure OddFinds checkout with guest support, shipping estimates, and Razorpay/Stripe payment options.",
    path: "/checkout",
  });
}

export default function CheckoutPage() {
  const subtotal = 2499;
  const shipping = subtotal >= 999 ? 0 : 79;

  return (
    <div className="container-main py-8">
      <h1 className="h1 mb-6 text-secondary">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <CheckoutForm subtotal={subtotal} />
        <OrderSummary subtotal={subtotal} shipping={shipping} />
      </div>
    </div>
  );
}
