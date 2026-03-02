const memory = new Map();

export function rateLimit({ key, limit = 30, windowMs = 60_000 }) {
  const now = Date.now();
  const value = memory.get(key) || { count: 0, resetAt: now + windowMs };

  if (now > value.resetAt) {
    value.count = 0;
    value.resetAt = now + windowMs;
  }

  value.count += 1;
  memory.set(key, value);

  return {
    ok: value.count <= limit,
    remaining: Math.max(0, limit - value.count),
    resetAt: value.resetAt,
  };
}
