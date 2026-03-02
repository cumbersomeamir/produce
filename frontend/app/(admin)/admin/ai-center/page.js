import { createMetadata } from "@/lib/seo";
import { listAiActions } from "@/lib/ai-log";
import { listAiRegistry } from "@/lib/runtime/admin-store";
import AiCenterClient from "@/app/(admin)/admin/ai-center/AiCenterClient";

export function generateMetadata() {
  return createMetadata({ title: "AI Center", description: "Control panel for all active and future OddFinds AI agents.", path: "/admin/ai-center" });
}

export default function AiCenterPage() {
  const agents = listAiRegistry();
  const logs = listAiActions();
  return <AiCenterClient initialAgents={agents} initialLogs={logs} />;
}
