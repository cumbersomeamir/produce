import { createMetadata } from "@/lib/seo";
import CostCalculatorClient from "@/app/(admin)/admin/procurement/cost-calculator/CostCalculatorClient";

export function generateMetadata() {
  return createMetadata({ title: "Landed Cost Calculator", description: "Compute CIF, duties, and suggested pricing.", path: "/admin/procurement/cost-calculator" });
}

export default function ProcurementCostCalculatorPage() {
  return <CostCalculatorClient />;
}
