import { ok } from "@/lib/api";
import { listAiRegistry, updateAiRegistryAgent } from "@/lib/runtime/admin-store";

export async function GET() {
  return ok({ data: listAiRegistry() });
}

export async function PATCH(request) {
  const body = await request.json();
  const agentId = String(body?.agentId || "");
  if (!agentId) return ok({ success: false, message: "agentId is required." }, { status: 400 });

  const updated = updateAiRegistryAgent(agentId, {
    enabled: Boolean(body?.enabled),
    mode: body?.enabled ? "active" : "paused",
  });

  if (!updated) return ok({ success: false, message: "Agent not found." }, { status: 404 });
  return ok({ success: true, data: updated });
}
