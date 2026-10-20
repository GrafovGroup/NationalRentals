import type { MetadataRoute } from "next";
import { allRoutes, pathFor } from "@/lib/routes";
import { site } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return allRoutes().map(({ locale, route }) => ({
    url: site.url + pathFor(locale, route.id, route.kind),
    alternates: {
      languages: {
        "en-CA": site.url + pathFor("en", route.id, route.kind),
        "fr-CA": site.url + pathFor("fr", route.id, route.kind),
      },
    },
  }));
}
