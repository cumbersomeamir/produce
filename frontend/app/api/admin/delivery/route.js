import { ok } from "@/lib/api";
import { assignDelivery, listDeliveryPartners } from "@/lib/runtime/admin-store";

export async function GET() {
  return ok({
    data: listDeliveryPartners(),
  });
}

export async function POST(request) {
  const body = await request.json();
  const orderNumber = String(body?.orderNumber || "");
  if (!orderNumber) return ok({ success: false, message: "orderNumber is required." }, { status: 400 });
  const assignment = assignDelivery(body);
  if (!assignment) return ok({ success: false, message: "Order not found." }, { status: 404 });
  return ok({ success: true, assignment });
}
