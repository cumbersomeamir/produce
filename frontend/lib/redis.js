import Redis from "ioredis";

const globalForRedis = globalThis;

function createClient() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  return new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });
}

export const redis = globalForRedis.redis || createClient();
if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}
