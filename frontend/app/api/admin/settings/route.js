import { ok } from "@/lib/api";
import { getSettings, updateSettings } from "@/lib/runtime/admin-store";

export async function GET() {
  return ok({ data: getSettings() });
}

export async function PUT(request) {
  const body = await request.json();
  const next = updateSettings({
    storeName: String(body?.storeName || "OddFinds").trim() || "OddFinds",
    supportEmail: String(body?.supportEmail || "").trim(),
    freeShippingThreshold: Math.max(0, Number(body?.freeShippingThreshold || 0)),
    defaultGstPercent: Math.max(0, Number(body?.defaultGstPercent || 0)),
    defaultCurrency: String(body?.defaultCurrency || "INR").trim() || "INR",
    procurementBudgetUsd: Math.max(0, Number(body?.procurementBudgetUsd || 0)),
  });

  return ok({ success: true, data: next });
}
