import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "My Reviews",
    description: "Manage and revisit product reviews submitted from your OddFinds account.",
    path: "/reviews",
  });
}

export default function UserReviewsPage() {
  return (
    <div>
      <h1 className="h1 text-secondary">My Reviews</h1>
      <p className="mt-2 text-text-muted">No submitted reviews yet.</p>
    </div>
  );
}
