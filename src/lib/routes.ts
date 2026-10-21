import { publishedIndustries, getIndustry } from "./industries";
import { b, locales, type Locale, type Localized } from "./config";
import { categories } from "./catalog";
import { publishedEquipment, getEquipment } from "./equipment";
import { locations, regions, geographicPrefill } from "./locations";
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
  kind: "page" | "category" | "location" | "equipment" | "region" | "industry";
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
    ...publishedIndustries.map((i) => ({
      kind: "industry" as const,
      id: i.id,
      path: `${pages.industries.slug[locale]}/${i.slug[locale]}`,
      name: i.title,
    })),
    ...categories.map((c) => ({
      kind: "category" as const,
      id: c.id,
      path: `${pages.rentals.slug[locale]}/${c.slug[locale]}`,
      name: c.name,
    })),
    ...publishedEquipment.map((item) => {
      const category = categories.find((c) => c.id === item.categoryId)!;
      return {
        kind: "equipment" as const,
        id: item.id,
        path: `${pages.rentals.slug[locale]}/${category.slug[locale]}/${item.slug[locale]}`,
        name: item.name,
      };
    }),
    ...regions.map((r) => ({
      kind: "region" as const,
      id: r.code,
      path: `${pages.locations.slug[locale]}/${r.slug[locale]}`,
      name: r.name,
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

export function equipmentInquiryHref(locale: Locale, id: string) {
  const item = getEquipment(id);
  if (!item) throw new Error("Unknown equipment " + id);
  const query = new URLSearchParams({ ...item.inquiry, source: item.id });
  return pathFor(locale, "contact") + "?" + query.toString() + "#quote";
}
export function inquiryPrefill(
  locale: Locale,
  query: Record<string, string | string[] | undefined>,
) {
  const category = categories.find((c) => c.id === query.category);
  const equipment = category?.equipment.find((e) => e.id === query.equipment);
  const source =
    typeof query.source === "string" ? getEquipment(query.source) : undefined;
  const industry =
    typeof query.industry === "string"
      ? getIndustry(query.industry)
      : undefined;
  const productValues = Array.isArray(query.products)
    ? query.products
    : (query.products || "").split(",");
  const products = [...new Set(productValues)]
    .filter((id) => !!getEquipment(id))
    .slice(0, 8);
  const first = products.length ? getEquipment(products[0]) : undefined;
  return {
    industry: industry?.id || "",
    products,
    ...geographicPrefill(locale, query),
    category: category?.id || first?.categoryId,
    equipment: equipment?.name[locale] || first?.name[locale],
    sourceEquipment:
      source &&
      source.id === equipment?.id &&
      source.categoryId === category?.id
        ? source.id
        : "",
  };
}
export function breadcrumbItems(locale: Locale, route: Route) {
  const result = [
    { name: pages.home.name[locale], path: pathFor(locale, "home") },
  ];
  if (route.kind !== "page") {
    const parent =
      route.kind === "industry"
        ? "industries"
        : route.kind === "location" || route.kind === "region"
          ? "locations"
          : "rentals";
    result.push({
      name: pages[parent].name[locale],
      path: pathFor(locale, parent),
    });
  }
  if (route.kind === "location") {
    const metro = locations.find((l) => l.id === route.id)!;
    const region = regions.find((r) => r.code === metro.region)!;
    result.push({
      name: region.name[locale],
      path: pathFor(locale, region.code, "region"),
    });
  }
  if (route.kind === "equipment") {
    const item = getEquipment(route.id)!;
    const category = categories.find((c) => c.id === item.categoryId)!;
    result.push({
      name: category.name[locale],
      path: pathFor(locale, category.id, "category"),
    });
  }
  if (route.id !== "home")
    result.push({
      name: route.name[locale],
      path: pathFor(locale, route.id, route.kind),
    });
  return result;
}

export function industryInquiryHref(locale: Locale, id: string) {
  if (!getIndustry(id)) throw Error("Unknown industry");
  return pathFor(locale, "contact") + "?industry=" + id + "#quote";
}
