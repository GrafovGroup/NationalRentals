import { b, locales, type Locale, type Localized } from "./config";
import { categories } from "./catalog";
import { locations } from "./locations";
export const pages = {
  home: { slug: b("", ""), name: b("Home", "Accueil") },
  rentals: {
    slug: b("rentals", "locations-equipement"),
    name: b("Equipment", "Équipement"),
  },
  about: { slug: b("about", "a-propos"), name: b("About us", "À propos") },
  contact: { slug: b("contact", "contact"), name: b("Contact", "Contact") },
  industries: {
    slug: b("industries", "secteurs"),
    name: b("Industries", "Secteurs"),
  },
  locations: {
    slug: b("locations", "regions"),
    name: b("Locations", "Régions"),
  },
  corporate: {
    slug: b("corporate-rentals", "location-entreprises"),
    name: b("Corporate rentals", "Location aux entreprises"),
  },
  privacy: {
    slug: b("privacy", "confidentialite"),
    name: b("Privacy", "Confidentialité"),
  },
  terms: { slug: b("terms", "conditions"), name: b("Terms", "Conditions") },
};
export type PageKey = keyof typeof pages;
export type Route = {
  kind: "page" | "category" | "location";
  id: string;
  path: string;
  name: Localized;
};
export function routes(locale: Locale): Route[] {
  return [
    ...Object.entries(pages).map(([id, p]) => ({
      kind: "page" as const,
      id,
      path: p.slug[locale],
      name: p.name,
    })),
    ...categories.map((c) => ({
      kind: "category" as const,
      id: c.id,
      path: `${pages.rentals.slug[locale]}/${c.slug[locale]}`,
      name: c.name,
    })),
    ...locations.map((l) => ({
      kind: "location" as const,
      id: l.id,
      path: `${pages.locations.slug[locale]}/${l.slug[locale]}`,
      name: l.name,
    })),
  ];
}
export function pathFor(
  locale: Locale,
  id: string,
  kind: Route["kind"] = "page",
) {
  const route = routes(locale).find((r) => r.id === id && r.kind === kind);
  if (!route) throw new Error(`Unknown route ${kind}/${id}`);
  return `/${locale}/${route.path ? `${route.path}/` : ""}`;
}
export function resolveRoute(locale: Locale, slug: string[] = []) {
  return routes(locale).find((r) => r.path === slug.join("/"));
}
export function allRoutes() {
  return locales.flatMap((locale) =>
    routes(locale).map((route) => ({ locale, route })),
  );
}
