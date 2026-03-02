import { createMetadata } from "@/lib/seo";
import { listModerationReviews } from "@/lib/runtime/admin-store";
import ReviewsClient from "@/app/(admin)/admin/reviews/ReviewsClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return createMetadata({ title: "Admin Reviews", description: "Moderate reviews and generate AI reviews.", path: "/admin/reviews" });
}

export default function AdminReviewsPage() {
  return <ReviewsClient initialReviews={listModerationReviews()} />;
}
