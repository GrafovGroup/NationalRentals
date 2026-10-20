import { z } from "zod";
import { resolveRoute } from "./routes";
export const eventNames = [
  "quote_start",
  "quote_submit_success",
  "quote_submit_error",
  "phone_click",
  "email_click",
  "equipment_view",
  "location_view",
] as const;
export const measurementSchema = z
  .object({ event: z.enum(eventNames), path: z.string().max(300) })
  .strict()
  .refine((value) => {
    const [locale, ...slug] = value.path.split("/").filter(Boolean);
    return (
      (locale === "en" || locale === "fr") &&
      !!resolveRoute(locale, slug) &&
      !value.path.includes("?") &&
      !value.path.includes("#")
    );
  });
export function measure(event: (typeof eventNames)[number]) {
  try {
    if (
      process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true" ||
      sessionStorage.getItem("nr:measurement-consent") !== "yes"
    )
      return;
    const parsed = measurementSchema.safeParse({
      event,
      path: window.location.pathname,
    });
    if (!parsed.success) return;
    void fetch("/api/measurement/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch {
    /* Analytics must never interrupt the inquiry. */
  }
}
