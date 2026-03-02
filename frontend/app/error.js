"use client";

import Button from "@/components/ui/Button";

export default function Error({ error, reset }) {
  return (
    <div className="container-main py-20 text-center">
      <h2 className="font-heading text-3xl text-secondary">Something got weird unexpectedly.</h2>
      <p className="mx-auto mt-2 max-w-xl text-text-muted">{error?.message || "Please retry. If this continues, contact support."}</p>
      <Button className="mt-4" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
