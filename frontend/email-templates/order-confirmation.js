import { withLayout } from "@/email-templates/base";

export default function orderConfirmationEmail({ orderNumber, total }) {
  return withLayout({
    title: `Order Confirmed: ${orderNumber}`,
    body: `<p>Your order is confirmed and now in processing.</p><p><strong>Total:</strong> ${total}</p>`,
  });
}
