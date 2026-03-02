import { createMetadata } from "@/lib/seo";
import SettingsClient from "@/app/(admin)/admin/settings/SettingsClient";
import { getSettings } from "@/lib/runtime/admin-store";

export function generateMetadata() {
  return createMetadata({ title: "Admin Settings", description: "Store config, shipping zones, taxes, API keys, and service settings.", path: "/admin/settings" });
}

export default function AdminSettingsPage() {
  const settings = getSettings();
  return <SettingsClient initialSettings={settings} />;
}
