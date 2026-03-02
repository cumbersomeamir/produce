import { ok } from "@/lib/api";

export async function GET() {
  return ok({ data: [] });
}

export async function POST(request) {
  const body = await request.json();
  return ok({ success: true, action: body.action || "approve" });
}
