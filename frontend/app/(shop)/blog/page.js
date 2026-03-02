import Link from "next/link";
import { createMetadata } from "@/lib/seo";

const posts = [
  {
    slug: "weird-products-that-sell",
    title: "7 Weird Products That Keep Selling Out",
    excerpt: "What makes bizarre products convert and how OddFinds curates them.",
  },
  {
    slug: "gift-guide-chaotic-friends",
    title: "Gift Guide for Your Most Chaotic Friend",
    excerpt: "A practical shortlist of unforgettable odd gifts.",
  },
];

export function generateMetadata() {
  return createMetadata({
    title: "OddFinds Blog",
    description: "SEO-ready content hub for product trends, gifting guides, and quirky shopping insights.",
    path: "/blog",
  });
}

export default function BlogPage() {
  return (
    <div className="container-main py-8">
      <h1 className="h1 text-secondary">Blog (Placeholder)</h1>
      <p className="mt-2 text-text-muted">Markdown-backed content can be wired here for SEO expansion.</p>
      <div className="mt-6 space-y-3">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-xl border border-border bg-surface p-4">
            <h2 className="font-heading text-xl text-secondary">{post.title}</h2>
            <p className="mt-1 text-sm text-text-muted">{post.excerpt}</p>
            <Link href="#" className="mt-2 inline-block text-sm font-semibold text-primary">
              Read post
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
