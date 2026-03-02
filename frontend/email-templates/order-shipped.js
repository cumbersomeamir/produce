import { withLayout } from "@/email-templates/base";

export default function orderShippedEmail({ orderNumber, trackingUrl }) {
  return withLayout({
    title: `Order Shipped: ${orderNumber}`,
    body: `<p>Your package is on the move.</p><p><a href="${trackingUrl}">Track shipment</a></p>`,
  });
}
