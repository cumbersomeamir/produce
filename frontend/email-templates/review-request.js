import { withLayout } from "@/email-templates/base";

export default function reviewRequestEmail({ orderNumber }) {
  return withLayout({
    title: "Tell us how weird it was",
    body: `<p>Thanks for shopping OddFinds.</p><p>Share your review for order ${orderNumber}.</p>`,
  });
}
