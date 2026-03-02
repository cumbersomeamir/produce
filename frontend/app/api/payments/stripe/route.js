import { enforceRateLimit, ok } from "@/lib/api";
import { createStripeIntent } from "@/lib/payments";

export async function POST(request) {
  const limited = enforceRateLimit(request, { prefix: "payment-stripe", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();
  const intent = await createStripeIntent({
    amount: body.amount,
    currency: body.currency || "usd",
    metadata: body.metadata || {},
  });

  return ok({ success: true, data: intent });
}
