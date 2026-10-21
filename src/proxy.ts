import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "./lib/config";
import { resolveRoute } from "./lib/routes";

// Guard only localized page URLs. Assets and the quote API bypass this layer.
// A direct response keeps unknown-page status, language and text correct even
// without JavaScript; a dynamic root layout otherwise uses Next's error shell.
export function proxy(request: NextRequest) {
  const [locale, ...slug] = request.nextUrl.pathname.split("/").filter(Boolean);
  if (locale === "fr" && slug[0] === "industries") {
    const target = request.nextUrl.clone();
    target.pathname =
      "/fr/secteurs/" +
      (slug.slice(1).length ? slug.slice(1).join("/") + "/" : "");
    return NextResponse.redirect(target, 308);
  }
  if (!isLocale(locale) || resolveRoute(locale, slug))
    return NextResponse.next();
  const fr = locale === "fr";
  const title = fr ? "Page introuvable" : "Page not found";
  const message = fr
    ? "Cette adresse ne correspond pas à une page. Retrouvez nos catégories de location à partir de l’accueil."
    : "This address does not match a page. Explore our rental categories from the homepage.";
  const label = fr ? "RETOUR À L’ACCUEIL" : "BACK TO HOME";
  // All inserted values are fixed application copy, never request text.
  return new NextResponse(
    `<!doctype html><html lang="${locale}-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | National Rentals</title><style>body{margin:0;background:#f7f8fa;color:#232323;font-family:Arial,sans-serif;line-height:1.7}main{max-width:760px;margin:10vh auto;padding:32px}h1{font-size:clamp(2.5rem,8vw,4.5rem);line-height:1.1;letter-spacing:-.04em}p{max-width:580px}a{display:inline-block;background:#c52430;color:#ffffff;padding:16px 24px;text-decoration:none;font-size:.8rem;font-weight:700;margin-top:22px}a:focus-visible{outline:3px solid #232323;outline-offset:5px}.brand{font-size:.8rem;letter-spacing:.15em;font-weight:700}</style></head><body><main><p class="brand">NATIONAL RENTALS.CA / 404</p><h1>${title}</h1><p>${message}</p><a href="/${locale}/">${label} ↗</a></main></body></html>`,
    {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}
export const config = { matcher: ["/en/:path*", "/fr/:path*"] };
