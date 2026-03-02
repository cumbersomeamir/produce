import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Discounts", description: "Create coupons and schedule flash sales.", path: "/admin/discounts" });
}

export default function AdminDiscountsPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Discounts</h1>
      <form className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input placeholder="Code" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <select className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2">
          <option>PERCENTAGE</option>
          <option>FIXED_AMOUNT</option>
          <option>FREE_SHIPPING</option>
        </select>
        <input placeholder="Value" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-3">Create Coupon</button>
      </form>
    </div>
  );
}
