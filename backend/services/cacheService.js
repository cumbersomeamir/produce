import Redis from "ioredis";

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export async function cacheSet(key, value, ttl = 300) {
  if (!redis) return false;
  await redis.set(key, JSON.stringify(value), "EX", ttl);
  return true;
}

export async function cacheGet(key) {
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

export async function cacheDel(key) {
  if (!redis) return false;
  await redis.del(key);
  return true;
}
