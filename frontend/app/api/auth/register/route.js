import { enforceRateLimit, ok } from "@/lib/api";

export async function POST(request) {
  const limited = enforceRateLimit(request, { prefix: "auth-register", limit: 12, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();
  if (!body.email || !body.password || !body.name) {
    return ok({ message: "Missing required fields" }, { status: 400 });
  }

  return ok({
    success: true,
    user: {
      id: `usr_${Date.now()}`,
      name: body.name,
      email: body.email,
    },
  });
}
