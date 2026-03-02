import { createMetadata } from "@/lib/seo";
import { findOrder } from "@/lib/runtime/admin-store";
import OrderDetailClient from "@/app/(admin)/admin/orders/[orderId]/OrderDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { orderId } = await params;
  return createMetadata({ title: `Order ${orderId}`, description: "Update status and delivery assignment.", path: `/admin/orders/${orderId}` });
}

export default async function AdminOrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = findOrder(orderId);
  if (!order) {
    return (
      <div className="text-white">
        <h1 className="font-heading text-3xl">Order not found</h1>
      </div>
    );
  }
  return <OrderDetailClient order={order} />;
}
