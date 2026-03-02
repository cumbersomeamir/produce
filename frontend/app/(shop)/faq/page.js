import JsonLd from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo";

const faqs = [
  ["How long does shipping take in India?", "Domestic orders are typically delivered in 2-5 business days based on location and carrier."],
  ["Do you ship internationally?", "Yes. International delivery typically takes 8-14 business days depending on customs and destination."],
  ["What is your return window?", "We offer a 7-day return window for eligible products from the date of delivery."],
  ["How do I start a return?", "Use the order detail page or contact support with your order number and reason for return."],
  ["When will I receive my refund?", "Refunds are processed within 5-7 business days after returned item inspection."],
  ["Can I cancel my order after placing it?", "You can cancel before dispatch. Once shipped, use the return flow."],
  ["Which payment methods are supported?", "Razorpay methods (UPI/cards/wallets) for India, Stripe for international cards."],
  ["Is guest checkout available?", "Yes, you can complete checkout without creating an account."],
  ["How do I track my order?", "Use the Track Order page with your order number and email."],
  ["Do you offer free shipping?", "Domestic orders above ₹999 qualify for free shipping by default."],
  ["Are products quality-checked?", "Yes, listings are reviewed for quality and fulfillment reliability before going live."],
  ["Can I request GST invoice?", "Yes, GST-compliant invoices are generated for eligible Indian orders."],
  ["Do you store card details?", "No, payment processing is handled by secure gateways; we do not store raw card data."],
  ["Can I buy in bulk?", "Yes, contact us for bulk and corporate gifting requests."],
  ["How do I contact support quickly?", "Email hello@oddfinds.com or call +91 98765 43210 during support hours."],
];

export function generateMetadata() {
  return createMetadata({
    title: "Frequently Asked Questions",
    description: "Shipping, returns, payments, tracking, and product quality answers for OddFinds customers.",
    path: "/faq",
  });
}

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <div className="container-main py-8">
      <JsonLd data={schema} />
      <h1 className="h1 text-secondary">FAQ</h1>
      <div className="mt-5 space-y-3">
        {faqs.map(([question, answer]) => (
          <details key={question} className="rounded-xl border border-border bg-surface p-4">
            <summary className="cursor-pointer font-semibold text-secondary">{question}</summary>
            <p className="mt-2 text-sm text-text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
