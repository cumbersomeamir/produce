import { withLayout } from "@/email-templates/base";

export default function orderCancelledEmail({ orderNumber, reason }) {
  return withLayout({
    title: `Order Cancelled: ${orderNumber}`,
    body: `<p>Your order was cancelled.</p><p><strong>Reason:</strong> ${reason || "Operational issue"}</p><p>Refund will be processed per policy.</p>`,
  });
}
