import { aiAgents } from "@/lib/mock-data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "AI Center", description: "Control panel for all active and future OddFinds AI agents.", path: "/admin/ai-center" });
}

export default function AiCenterPage() {
  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">AI Center</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {aiAgents.map((agent) => (
          <div key={agent} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">{agent}</p>
            <p className="text-sm text-white/70">Status: {agent.includes("TODO") ? "Planned" : "Active"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
