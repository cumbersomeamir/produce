import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Privacy Policy",
    description: "How OddFinds collects, uses, secures, and retains user data and cookie preferences.",
    path: "/privacy-policy",
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Privacy Policy</h1>
      <div className="mt-4 space-y-3 text-sm text-text-muted">
        <p>We collect account, contact, shipping, and order data required to process purchases and support users.</p>
        <p>Payment details are processed via secure gateways; we do not store full card credentials.</p>
        <p>Cookies are used for authentication, cart persistence, analytics, and personalization.</p>
        <p>Users may request data export or deletion by contacting hello@oddfinds.com.</p>
        <p>We apply industry-standard safeguards for data security and access controls.</p>
      </div>
    </div>
  );
}
