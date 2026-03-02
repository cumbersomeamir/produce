import { ok } from "@/lib/api";
import { calculateShippingRate } from "@/lib/shipping";

export async function POST(request) {
  const body = await request.json();
  const rate = calculateShippingRate(body);
  return ok({ data: rate });
}
