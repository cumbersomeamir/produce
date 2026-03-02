import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Customers", description: "View and manage customer accounts.", path: "/admin/customers" });
}

export default function AdminCustomersPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Customers</h1>
      <p className="mt-2 text-white/70">Customer table placeholder with exports and segmentation support.</p>
    </div>
  );
}
