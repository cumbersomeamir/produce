import { createMetadata } from "@/lib/seo";
import { listDiscounts } from "@/lib/runtime/admin-store";
import DiscountsClient from "@/app/(admin)/admin/discounts/DiscountsClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Discounts", description: "Create coupons and schedule flash sales.", path: "/admin/discounts" });
}

export default function AdminDiscountsPage() {
  return <DiscountsClient initialDiscounts={listDiscounts()} />;
}
