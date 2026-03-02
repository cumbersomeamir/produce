import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Email Center", description: "Transactional templates, logs, and automation rules.", path: "/admin/emails" });
}

export default function EmailCenterPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Email Center</h1>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <p>Automations:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Order confirmed → confirmation email</li>
          <li>Order shipped → tracking email</li>
          <li>Delivered +3 days → review request</li>
          <li>Cart abandoned +2 hours → reminder</li>
          <li>Wishlist price drop → notification</li>
        </ul>
      </div>
    </div>
  );
}
