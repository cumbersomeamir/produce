import { ok } from "@/lib/api";
import { listModerationReviews, updateReviewStatus } from "@/lib/runtime/admin-store";

export async function GET() {
  return ok({ data: listModerationReviews() });
}

export async function POST(request) {
  const body = await request.json();
  const reviewId = String(body?.reviewId || "");
  const action = String(body?.action || "approve").toLowerCase();
  if (!reviewId) return ok({ success: false, message: "reviewId is required." }, { status: 400 });

  const status = action === "reject" ? "REJECTED" : "APPROVED";
  const updated = updateReviewStatus(reviewId, status);
  if (!updated) return ok({ success: false, message: "Review not found." }, { status: 404 });

  return ok({ success: true, data: updated });
}
