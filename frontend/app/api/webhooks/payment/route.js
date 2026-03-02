import { ok } from "@/lib/api";

export async function POST(request) {
  const body = await request.json();
  return ok({
    received: true,
    source: "payment",
    event: body.event || body.type || "unknown",
  });
}
