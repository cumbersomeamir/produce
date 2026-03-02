import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Reset Password",
    description: "Set a new secure password for your OddFinds account.",
    path: "/reset-password",
  });
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-surface p-5">
      <h1 className="h2 text-secondary">Reset Password</h1>
      <form className="mt-4 space-y-3">
        <input type="password" required placeholder="New password" className="w-full rounded-xl border border-border px-3 py-2" />
        <input
          type="password"
          required
          placeholder="Confirm new password"
          className="w-full rounded-xl border border-border px-3 py-2"
        />
        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-2 font-semibold text-white">
          Update Password
        </button>
      </form>
    </div>
  );
}
