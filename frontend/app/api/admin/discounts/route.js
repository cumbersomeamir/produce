import { ok } from "@/lib/api";
import { createDiscount, listDiscounts } from "@/lib/runtime/admin-store";

export async function GET() {
  return ok({
    data: listDiscounts(),
  });
}

export async function POST(request) {
  const body = await request.json();
  const created = createDiscount(body);
  if (!created) return ok({ success: false, message: "Code is required." }, { status: 400 });
  return ok({ success: true, discount: created }, { status: 201 });
}
