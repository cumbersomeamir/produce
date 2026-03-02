import Link from "next/link";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Admin Home",
    description: "OddFinds admin control panel.",
    path: "/admin",
  });
}

export default function AdminHomePage() {
  return (
    <div className="text-white">
      <h1 className="font-heading text-3xl">Admin</h1>
      <p className="mt-2 text-white/70">Use the sidebar to manage operations.</p>
      <Link href="/admin/dashboard" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-secondary">
        Open Dashboard
      </Link>
    </div>
  );
}
