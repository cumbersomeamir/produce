import Link from "next/link";
import LoginForm from "@/app/(auth)/login/components/LoginForm";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Login",
    description: "Sign in to OddFinds to manage orders, wishlist, and account settings.",
    path: "/login",
  });
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="h1 mb-2 text-secondary">Welcome Back</h1>
      <p className="mb-4 text-sm text-text-muted">Auth is disabled in this build. Continue to enter app flows directly.</p>
      <LoginForm />
      <p className="mt-3 text-sm text-text-muted">
        Quick links: <Link href="/account" className="text-primary">Customer</Link> ·{" "}
        <Link href="/admin/dashboard" className="text-primary">Admin</Link>
      </p>
    </div>
  );
}
