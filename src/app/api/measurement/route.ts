import { measurementSchema } from "@/lib/measurement";
import { allowRequest } from "@/lib/rate-limit";
import { site } from "@/lib/config";
export async function POST(request: Request) {
  const empty = (status: number) =>
    new Response(null, { status, headers: { "Cache-Control": "no-store" } });
  if (
    request.headers.get("origin") !==
      new URL(process.env.NEXT_PUBLIC_SITE_URL || request.url).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return empty(403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return empty(415);
  try {
    const reader = request.body?.getReader();
    if (!reader) return empty(400);
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.length;
      if (bytes > 1024) {
        await reader.cancel();
        return empty(413);
      }
      chunks.push(value);
    }
    const parsed = measurementSchema.safeParse(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
    );
    if (!parsed.success) return empty(400);
    if (
      process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true" ||
      !process.env.ANALYTICS_ENDPOINT
    )
      return empty(204);
    const endpoint = new URL(process.env.ANALYTICS_ENDPOINT);
    if (endpoint.protocol !== "https:") return empty(503);
    const header = process.env.TRUSTED_CLIENT_IP_HEADER;
    const ip = header
      ? request.headers.get(header)?.split(",")[0]?.trim() || "unknown"
      : "shared";
    if (!(await allowRequest(ip, "measurement", 120))) return empty(429);
    // The adapter forwards only this allowlist. No incoming IP, user agent, query, referrer, cookies, session ID or lead ID.
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ANALYTICS_TOKEN
          ? { Authorization: "Bearer " + process.env.ANALYTICS_TOKEN }
          : {}),
      },
      body: JSON.stringify({
        event: parsed.data.event,
        url: site.url + parsed.data.path,
      }),
      signal: AbortSignal.timeout(3000),
      redirect: "error",
    });
    return empty(result.ok ? 204 : 503);
  } catch {
    return empty(503);
  }
}
