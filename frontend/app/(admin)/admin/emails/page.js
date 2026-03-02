import { createMetadata } from "@/lib/seo";
import { listEmailAutomations } from "@/lib/runtime/admin-store";
import EmailsClient from "@/app/(admin)/admin/emails/EmailsClient";

export function generateMetadata() {
  return createMetadata({ title: "Email Center", description: "Transactional templates, logs, and automation rules.", path: "/admin/emails" });
}

export default function EmailCenterPage() {
  const automations = listEmailAutomations();
  return <EmailsClient initialAutomations={automations} />;
}
