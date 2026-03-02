"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    if (!response.ok) {
      setMessage("Could not create account right now.");
      return;
    }

    setMessage("Account created. Redirecting to login...");
    setTimeout(() => router.push("/login"), 900);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-border bg-surface p-5">
      <input name="name" required placeholder="Full Name" className="w-full rounded-xl border border-border px-3 py-2" />
      <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-border px-3 py-2" />
      <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl border border-border px-3 py-2" />
      <Button type="submit" className="w-full">Create Account</Button>
      {message ? <p className="text-sm text-text-muted">{message}</p> : null}
    </form>
  );
}
