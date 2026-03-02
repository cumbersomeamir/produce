import { ok } from "@/lib/api";

export async function POST(request) {
  const body = await request.json();
  return ok({
    received: true,
    source: "delivery",
    status: body.status || "unknown",
  });
}
