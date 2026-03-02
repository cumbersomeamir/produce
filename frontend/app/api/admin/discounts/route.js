import { ok } from "@/lib/api";

export async function GET() {
  return ok({
    data: [
      { code: "ODDWEEK", type: "PERCENTAGE", value: 15 },
      { code: "FIRSTBUY", type: "FIXED_AMOUNT", value: 200 },
      { code: "FREESHIP", type: "FREE_SHIPPING", value: 0 },
    ],
  });
}

export async function POST(request) {
  const body = await request.json();
  return ok({ success: true, discount: body }, { status: 201 });
}
