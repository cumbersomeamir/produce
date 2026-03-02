const memory = new Map();

export function rateLimiter({ keyPrefix = "api", limit = 60, windowMs = 60_000 } = {}) {
  return function limiter(req, res, next) {
    const key = `${keyPrefix}:${req.ip || "local"}`;
    const now = Date.now();
    const current = memory.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > current.resetAt) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    memory.set(key, current);

    if (current.count > limit) {
      res.status(429).json({ message: "Too many requests" });
      return;
    }

    next();
  };
}
