import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Terms of Service",
    description: "Terms governing purchases, account use, payments, returns, and liability on OddFinds.",
    path: "/terms",
  });
}

export default function TermsPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Terms of Service</h1>
      <div className="mt-4 space-y-3 text-sm text-text-muted">
        <p>By using OddFinds, you agree to accurate account information, lawful use, and timely payment obligations.</p>
        <p>Product images and descriptions are provided for guidance; minor variations may occur due to manufacturing batches.</p>
        <p>Orders may be cancelled in rare cases of inventory mismatch, payment fraud risk, or regulatory restriction.</p>
        <p>Liability is limited to order value where permitted by law.</p>
        <p>These terms may be updated periodically and apply from the published date.</p>
      </div>
    </div>
  );
}
