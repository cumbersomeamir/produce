import { ok } from "@/lib/api";
import { reviews } from "@/lib/mock-data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  const data = productId ? reviews.filter((review) => review.productId === productId) : reviews;
  return ok({ data });
}

export async function POST(request) {
  const body = await request.json();
  return ok(
    {
      success: true,
      data: {
        id: `rev_${Date.now()}`,
        ...body,
      },
    },
    { status: 201 },
  );
}
