import { pathFor } from "./routes";
import { site } from "./config";
import { formCopy, type Quote } from "./quote";
import { categories } from "./catalog";
import { regions } from "./locations";
export async function deliverQuote(quote: Quote): Promise<string> {
  const key = process.env.RESEND_API_KEY,
    from = process.env.QUOTE_FROM_EMAIL;
  if (!key || !from) throw new Error("Quote delivery is unconfigured");
  const {
    requestId,
    locale,
    website: _honeypot,
    privacy: _privacy,
    ...fields
  } = quote;
  void _honeypot;
  void _privacy;
  const text = Object.entries(fields)
    .map(([k, v]) => {
      if (k === "sourceEquipment")
        return v
          ? "Equipment page: " +
              site.url +
              pathFor(locale, String(v), "equipment")
          : "Equipment page: General inquiry";
      const label = formCopy[k as keyof typeof formCopy]?.en || k;
      if (k === "category")
        v = categories.find((c) => c.id === v)?.name.en || v;
      if (k === "province") v = regions.find((r) => r.code === v)?.name.en || v;
      return `${label}: ${v}`;
    })
    .join("\n");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `quote/${requestId}`,
    },
    body: JSON.stringify({
      from,
      to: [site.email],
      reply_to: quote.email,
      subject: `National Rentals quote request — ${requestId}`,
      text: `Request: ${requestId}\nLanguage: ${locale}\nPrivacy acknowledgment: accepted\n\n${text}`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Email provider rejected request");
  const data = await response.json();
  if (typeof data.id !== "string" || !data.id)
    throw new Error("Email provider did not confirm acceptance");
  return data.id;
}
