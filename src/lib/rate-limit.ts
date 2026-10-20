import { createHash } from "node:crypto";
const windowMs = 15 * 60 * 1000;
const memory = new Map<string, { count: number; expires: number }>();
export async function allowRequest(
  ip: string,
  scope = "quote",
  limit = 5,
): Promise<boolean> {
  const key = `nr:${scope}:${createHash("sha256").update(ip).digest("hex")}`;
  const url = process.env.RATE_LIMIT_REDIS_URL,
    token = process.env.RATE_LIMIT_REDIS_TOKEN;
  if (url && token) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('PEXPIRE',KEYS[1],ARGV[1]) end; return n",
        1,
        key,
        windowMs,
      ]),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Rate limit store unavailable");
    const data = await response.json();
    if (typeof data.result !== "number")
      throw new Error("Invalid rate limit response");
    return data.result <= limit;
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.RATE_LIMIT_MODE !== "single-instance"
  )
    throw new Error("Distributed rate limit not configured");
  const now = Date.now();
  for (const [k, v] of memory) if (v.expires <= now) memory.delete(k);
  const entry = memory.get(key) || { count: 0, expires: now + windowMs };
  if (!memory.has(key) && memory.size >= 10000) return false;
  entry.count++;
  memory.set(key, entry);
  return entry.count <= limit;
}
