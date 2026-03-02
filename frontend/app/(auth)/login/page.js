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
      <p className="mb-4 text-sm text-text-muted">Use admin@oddfinds.com / admin123 for admin test login.</p>
      <LoginForm />
      <p className="mt-3 text-sm text-text-muted">
        New here? <Link href="/register" className="text-primary">Create account</Link>
      </p>
    </div>
  );
}
