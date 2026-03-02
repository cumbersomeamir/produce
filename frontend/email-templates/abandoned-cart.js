import { withLayout } from "@/email-templates/base";

export default function abandonedCartEmail() {
  return withLayout({
    title: "Your weird finds are waiting",
    body: `<p>You left a few odd products in your cart.</p><p><a href="{{cartUrl}}">Return to cart</a></p>`,
  });
}
