import { createMetadata } from "@/lib/seo";
import ProcurementHomeClient from "@/app/(admin)/admin/procurement/ProcurementHomeClient";

export function generateMetadata() {
  return createMetadata({ title: "Procurement Center", description: "AI-powered sourcing and procurement workflows.", path: "/admin/procurement" });
}

export default function ProcurementHomePage() {
  return <ProcurementHomeClient />;
}
