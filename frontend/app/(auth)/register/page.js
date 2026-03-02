import Link from "next/link";
import RegisterForm from "@/app/(auth)/register/components/RegisterForm";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Register",
    description: "Create an OddFinds account for faster checkout, order tracking, and wishlist sync.",
    path: "/register",
  });
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="h1 mb-2 text-secondary">Create Account</h1>
      <p className="mb-4 text-sm text-text-muted">Save addresses, track orders, and unlock faster reorders.</p>
      <RegisterForm />
      <p className="mt-3 text-sm text-text-muted">
        Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
      </p>
    </div>
  );
}
