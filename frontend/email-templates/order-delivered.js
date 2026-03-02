import { withLayout } from "@/email-templates/base";

export default function orderDeliveredEmail({ orderNumber }) {
  return withLayout({
    title: `Delivered: ${orderNumber}`,
    body: `<p>Your order has been delivered. We hope the weirdness was worth it.</p><p><a href="{{reviewUrl}}">Leave a review</a></p>`,
  });
}
