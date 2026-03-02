import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Settings", description: "Store config, shipping zones, taxes, API keys, and service settings.", path: "/admin/settings" });
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Settings</h1>
      <form className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
        <input placeholder="Store name" defaultValue="OddFinds" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Support email" defaultValue="hello@oddfinds.com" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Free shipping threshold" defaultValue="999" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <input placeholder="Default GST" defaultValue="18" className="rounded-lg border border-white/15 bg-[#0f1022] px-3 py-2" />
        <button className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary md:col-span-2">Save Settings</button>
      </form>
    </div>
  );
}
