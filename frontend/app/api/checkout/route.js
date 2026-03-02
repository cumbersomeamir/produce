import { enforceRateLimit, ok } from "@/lib/api";
import { sendTransactionalEmail } from "@/lib/email";

export async function POST(request) {
  const limited = enforceRateLimit(request, { prefix: "checkout", limit: 15, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();

  const orderNumber = `ODF-${Math.floor(100000 + Math.random() * 900000)}`;

  await sendTransactionalEmail({
    to: body.email || "customer@oddfinds.com",
    subject: `Order Confirmation ${orderNumber}`,
    html: `<p>Your order <strong>${orderNumber}</strong> is confirmed.</p>`,
  });

  return ok({
    success: true,
    orderNumber,
    paymentMethod: body.paymentMethod,
    status: "PENDING",
  });
}
