import { createMetadata } from "@/lib/seo";
import NegotiationsClient from "@/app/(admin)/admin/procurement/negotiations/NegotiationsClient";

export function generateMetadata() {
  return createMetadata({ title: "Negotiations", description: "AI-drafted supplier negotiation workflows.", path: "/admin/procurement/negotiations" });
}

export default function ProcurementNegotiationsPage() {
  return <NegotiationsClient />;
}
