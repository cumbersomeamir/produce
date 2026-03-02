import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Delivery Management", description: "Assign carriers and monitor shipment progress.", path: "/admin/delivery" });
}

export default function DeliveryManagementPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Delivery Management</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p>Delivery partners: Shiprocket, Delhivery, India Post, DHL, FedEx</p>
        <p className="mt-2 text-sm text-white/70">Assign orders manually or via API integration fallback.</p>
      </div>
    </div>
  );
}
