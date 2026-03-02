import { Star } from "lucide-react";

export default function StarRating({ rating = 0, count }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} size={14} fill={index < Math.round(rating) ? "currentColor" : "none"} />
        ))}
      </div>
      <span className="text-text-muted">
        {rating.toFixed(1)} {typeof count === "number" ? `(${count})` : ""}
      </span>
    </div>
  );
}
