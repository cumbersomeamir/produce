import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({ title: "Admin Analytics", description: "Sales trends, funnel metrics, and performance analysis.", path: "/admin/analytics" });
}

export default function AdminAnalyticsPage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Analytics</h1>
      <p className="mt-2 text-white/70">Conversion funnel and channel performance placeholders ready for live metrics.</p>
    </div>
  );
}
