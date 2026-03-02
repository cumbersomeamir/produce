import { ok } from "@/lib/api";

export async function GET() {
  return ok({
    data: {
      suppliers: 3,
      activeNegotiations: 2,
      avgLandedMargin: "41%",
    },
  });
}
