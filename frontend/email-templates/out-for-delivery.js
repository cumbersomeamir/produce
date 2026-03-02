import { withLayout } from "@/email-templates/base";

export default function outForDeliveryEmail({ orderNumber }) {
  return withLayout({
    title: `Out for Delivery: ${orderNumber}`,
    body: `<p>Your order is on the way and should arrive today.</p>`,
  });
}
