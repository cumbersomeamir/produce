"use client";

import { useState } from "react";

export default function ReviewsClient({ initialReviews }) {
  const [queue, setQueue] = useState(initialReviews || []);
  const [loadingId, setLoadingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function applyAction(reviewId, action) {
    setLoadingId(reviewId);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Action failed.");

      setQueue((current) =>
        current.map((review) =>
          review.id === reviewId ? { ...review, status: payload.data.status } : review,
        ),
      );
      setMessage(`Review ${action}d.`);
    } catch (actionError) {
      setError(actionError.message || "Action failed.");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <div className="space-y-4 text-white">
      <h1 className="font-heading text-3xl">Reviews</h1>

      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-error">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-2">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Rating</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((review) => (
              <tr key={review.id} className="border-t border-white/10 align-top">
                <td className="px-3 py-2">{review.authorName}</td>
                <td className="px-3 py-2">
                  <p className="font-semibold">{review.title}</p>
                  <p className="mt-1 text-xs text-white/70">{review.body}</p>
                </td>
                <td className="px-3 py-2">{review.rating}</td>
                <td className="px-3 py-2">{review.status}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={loadingId === review.id}
                      onClick={() => applyAction(review.id, "approve")}
                      className="rounded bg-accent px-2 py-1 text-xs font-semibold text-secondary disabled:opacity-60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === review.id}
                      onClick={() => applyAction(review.id, "reject")}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

