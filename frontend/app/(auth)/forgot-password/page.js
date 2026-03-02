import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Forgot Password",
    description: "Request a secure password reset link for your OddFinds account.",
    path: "/forgot-password",
  });
}

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-5">
      <h1 className="h2 text-secondary">Forgot Password</h1>
      <p className="mt-2 text-sm text-text-muted">Enter your account email. We&apos;ll send a reset link.</p>
      <form className="mt-4 space-y-3">
        <input type="email" required placeholder="Email" className="w-full rounded-xl border border-border px-3 py-2" />
        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
