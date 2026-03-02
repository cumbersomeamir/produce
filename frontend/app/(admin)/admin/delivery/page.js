import { createMetadata } from "@/lib/seo";
import { listDeliveryPartners } from "@/lib/runtime/admin-store";
import DeliveryClient from "@/app/(admin)/admin/delivery/DeliveryClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Delivery Management", description: "Assign carriers and monitor shipment progress.", path: "/admin/delivery" });
}

export default function DeliveryManagementPage() {
  return <DeliveryClient initialPartners={listDeliveryPartners()} />;
}
