import { enforceRateLimit, ok } from "@/lib/api";
import { sendTransactionalEmail } from "@/lib/email";

export async function POST(request) {
  const limited = enforceRateLimit(request, { prefix: "email", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();
  const result = await sendTransactionalEmail(body);
  return ok({ success: true, data: result });
}
