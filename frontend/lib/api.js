import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function getClientKey(request) {
  return request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "local";
}

export function enforceRateLimit(request, { prefix = "global", limit = 60, windowMs = 60_000 } = {}) {
  const key = `${prefix}:${getClientKey(request)}`;
  const result = rateLimit({ key, limit, windowMs });

  if (!result.ok) {
    return NextResponse.json(
      {
        message: "Too many requests",
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  return null;
}

export function ok(data, init = {}) {
  return NextResponse.json(data, init);
}

export function fail(message, status = 400) {
  return NextResponse.json({ message }, { status });
}
