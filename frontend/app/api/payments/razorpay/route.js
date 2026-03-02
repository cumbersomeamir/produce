import { enforceRateLimit, ok } from "@/lib/api";
import { createRazorpayOrder } from "@/lib/payments";

export async function POST(request) {
  const limited = enforceRateLimit(request, { prefix: "payment-rzp", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();
  const order = await createRazorpayOrder({
    amount: body.amount,
    currency: body.currency || "INR",
    receipt: body.receipt || `receipt_${Date.now()}`,
  });

  return ok({ success: true, data: order });
}
