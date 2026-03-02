import { enforceRateLimit, ok } from "@/lib/api";

const cartState = {
  items: [],
};

export async function GET() {
  return ok({ data: cartState.items });
}

export async function POST(request) {
  const limited = enforceRateLimit(request, { prefix: "cart", limit: 120, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();
  cartState.items = body.items || [];
  return ok({ success: true, data: cartState.items });
}
