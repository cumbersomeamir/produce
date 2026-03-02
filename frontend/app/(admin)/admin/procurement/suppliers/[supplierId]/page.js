import { createMetadata } from "@/lib/seo";
import SupplierDetailClient from "@/app/(admin)/admin/procurement/suppliers/[supplierId]/SupplierDetailClient";

export async function generateMetadata({ params }) {
  const { supplierId } = await params;
  return createMetadata({ title: `Supplier ${supplierId}`, description: "Supplier profile and communication timeline.", path: `/admin/procurement/suppliers/${supplierId}` });
}

export default async function SupplierDetailPage({ params }) {
  const { supplierId } = await params;
  return <SupplierDetailClient supplierId={supplierId} />;
}
