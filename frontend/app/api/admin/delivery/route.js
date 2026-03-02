import { ok } from "@/lib/api";

export async function GET() {
  return ok({
    data: [
      { partner: "Shiprocket", activeShipments: 18 },
      { partner: "Delhivery", activeShipments: 11 },
    ],
  });
}

export async function POST(request) {
  const body = await request.json();
  return ok({ success: true, assignment: body });
}
