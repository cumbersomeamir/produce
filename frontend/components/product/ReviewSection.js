import { format } from "date-fns";
import StarRating from "@/components/ui/StarRating";

export default function ReviewSection({ reviews = [] }) {
  if (!reviews.length) {
    return <p className="text-sm text-text-muted">No reviews yet. Be the first to rate this odd find.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{review.authorName}</p>
              <p className="text-xs text-text-muted">{review.authorLocation || "India"}</p>
            </div>
            <p className="text-xs text-text-muted">{format(new Date(review.createdAt), "dd MMM yyyy")}</p>
          </div>
          <StarRating rating={review.rating} />
          {review.title ? <p className="mt-2 font-semibold">{review.title}</p> : null}
          <p className="mt-1 text-sm text-text-muted">{review.body}</p>
          <button type="button" className="mt-2 text-xs text-secondary underline">
            Helpful ({review.helpfulCount || 0})
          </button>
        </article>
      ))}
    </div>
  );
}
