"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (response?.error) {
      setError("Invalid credentials.");
      return;
    }

    router.push("/account");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-surface p-5">
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-border px-3 py-2" />
      <input
        name="password"
        type="password"
        required
        placeholder="Password"
        className="w-full rounded-xl border border-border px-3 py-2"
      />
      {error ? <p className="text-sm text-error">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/account" })}
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      >
        Continue with Google
      </button>
    </form>
  );
}
