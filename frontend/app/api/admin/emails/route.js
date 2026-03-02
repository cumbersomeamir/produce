import { ok } from "@/lib/api";
import { listEmailAutomations, updateEmailAutomation } from "@/lib/runtime/admin-store";

export async function GET() {
  return ok({ data: listEmailAutomations() });
}

export async function PATCH(request) {
  const body = await request.json();
  const automationId = String(body?.automationId || "");
  if (!automationId) return ok({ success: false, message: "automationId is required." }, { status: 400 });

  const updated = updateEmailAutomation(automationId, {
    enabled: Boolean(body?.enabled),
  });
  if (!updated) return ok({ success: false, message: "Automation not found." }, { status: 404 });

  return ok({ success: true, data: updated });
}
