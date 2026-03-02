import { auth } from "@/lib/auth";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "My Account",
    description: "Manage profile, addresses, and password settings in your OddFinds account.",
    path: "/account",
  });
}

export default async function AccountPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="h1 text-secondary">My Account</h1>
      <p className="mt-2 text-text-muted">Profile, addresses, and saved preferences.</p>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
        <p className="text-sm text-text-muted">Logged in as</p>
        <p className="font-semibold text-secondary">{session?.user?.email || "guest@oddfinds.com"}</p>
      </div>
      <form className="mt-4 grid gap-3 rounded-2xl border border-border bg-surface p-4 sm:grid-cols-2">
        <input placeholder="Full Name" className="rounded-xl border border-border px-3 py-2" defaultValue={session?.user?.name || ""} />
        <input placeholder="Phone" className="rounded-xl border border-border px-3 py-2" />
        <input placeholder="Address line 1" className="rounded-xl border border-border px-3 py-2 sm:col-span-2" />
        <button type="submit" className="rounded-xl bg-primary px-4 py-2 font-semibold text-white sm:col-span-2">
          Save Changes
        </button>
      </form>

      <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
        <h2 className="font-heading text-xl text-secondary">Referral Program (Placeholder)</h2>
        <p className="mt-1 text-sm text-text-muted">Share with friends, get ₹100 off on successful referrals.</p>
        <p className="mt-2 font-mono text-sm">Your code: ODD-REF-1001</p>
      </div>
    </div>
  );
}
