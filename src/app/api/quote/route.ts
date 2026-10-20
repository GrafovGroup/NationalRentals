import { quoteSchema } from "@/lib/quote";
import { allowRequest } from "@/lib/rate-limit";
import { acceptLead, SubmissionConflict } from "@/lib/leads";
export const runtime = "nodejs";
const response = (
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  if (
    !origin ||
    origin !== new URL(expected).origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    return response({ error: "origin" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return response({ error: "contentType" }, 415);
  try {
    // Only trust a header explicitly configured for a proxy that overwrites it.
    const header = process.env.TRUSTED_CLIENT_IP_HEADER;
    const ip = header
      ? request.headers.get(header)?.split(",")[0]?.trim() || "unknown"
      : "shared";
    if (!(await allowRequest(ip)))
      return response({ error: "rate" }, 429, { "Retry-After": "900" });
    const reader = request.body?.getReader();
    if (!reader) return response({ error: "body" }, 400);
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16384) {
        await reader.cancel();
        return response({ error: "tooLarge" }, 413);
      }
      chunks.push(value);
    }
    let raw: unknown;
    try {
      raw = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return response({ error: "body" }, 400);
    }
    const result = quoteSchema.safeParse(raw);
    if (!result.success)
      return response(
        {
          error: "validation",
          fields: Object.fromEntries(
            result.error.issues.map((i) => [
              i.path[0],
              ["dateOrder", "pastDate"].includes(i.message)
                ? i.message
                : "invalid",
            ]),
          ),
        },
        400,
      );
    return response(await acceptLead(result.data), 200);
  } catch (error) {
    if (error instanceof SubmissionConflict)
      return response({ error: "conflict" }, 409);
    // Never log the request body or provider credentials. No false success or silent discard.
    console.error("Quote service unavailable; request was not confirmed.");
    return response({ error: "unavailable" }, 503);
  }
}
