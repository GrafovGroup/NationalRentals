import Link from "next/link";
import {
  regions,
  locations,
  markets,
  metropolitanAreas,
} from "@/lib/locations";
import { categories } from "@/lib/catalog";
import { getEquipment, normalizeSearch } from "@/lib/equipment";
import { type Locale } from "@/lib/config";
import { copy } from "@/lib/copy";
import { pathFor, type Route } from "@/lib/routes";
import { PageIntro } from "./Site";
type Query = Record<string, string | string[] | undefined>;
export function geographicContext(query: Query) {
  const context = new URLSearchParams();
  const item =
    typeof query.equipment === "string"
      ? getEquipment(query.equipment)
      : undefined;
  const category = categories.find((c) => c.id === query.category);
  if (item) {
    context.set("equipment", item.id);
    context.set("category", item.categoryId);
    context.set("source", item.id);
  } else if (category) context.set("category", category.id);
  return context;
}
export function LocationDiscovery({
  locale,
  query = {},
  regionCode,
}: {
  locale: Locale;
  query?: Query;
  regionCode?: string;
}) {
  const fr = locale === "fr";
  const q = typeof query.q === "string" ? query.q.slice(0, 120) : "";
  const region =
    regionCode || (typeof query.province === "string" ? query.province : "");
  const context = geographicContext(query);
  const found = markets.filter(
    (m) =>
      (!region || m.region === region) &&
      normalizeSearch(
        m.name[locale] +
          " " +
          (locations.find((l) => l.id === m.metroId)?.name[locale] || "") +
          " " +
          metropolitanAreas
            .filter(
              (a) =>
                a.municipalities.includes(m.name.en) ||
                a.municipalities.includes(m.name.fr),
            )
            .map((a) => a.id)
            .join(" "),
      ).includes(normalizeSearch(q)),
  );
  return (
    <section className="section container" id="markets">
      <h2>{fr ? "Trouvez votre ville" : "Find your city"}</h2>
      <p>
        {fr
          ? "Choisissez une ville pour préparer votre demande ou consultez son guide régional. Les modalités et la disponibilité sont confirmées après évaluation du projet."
          : "Choose a city to prepare your request or read its regional guide. Terms and availability are confirmed after project review."}
      </p>
      <form
        className="geo-filters"
        method="get"
        action={
          regionCode
            ? pathFor(locale, regionCode, "region")
            : pathFor(locale, "locations")
        }
      >
        {[...context].map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <label>
          {fr ? "Ville ou région métropolitaine" : "City or metro area"}
          <input name="q" defaultValue={q} maxLength={120} />
        </label>
        {!regionCode && (
          <label>
            {fr ? "Province ou territoire" : "Province or territory"}
            <select name="province" defaultValue={region}>
              <option value="">
                {fr ? "Toutes les régions" : "All regions"}
              </option>
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name[locale]}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="button" type="submit">
          {fr ? "RECHERCHER" : "SEARCH"}
        </button>
        <Link
          className="text-link"
          href={
            (regionCode
              ? pathFor(locale, regionCode, "region")
              : pathFor(locale, "locations")) +
            (context.size ? "?" + context : "")
          }
        >
          {fr ? "EFFACER" : "CLEAR"}
        </Link>
      </form>
      <p role="status">
        {found.length}{" "}
        {fr ? "villes et municipalités" : "cities and municipalities"}
      </p>
      {!found.length && (
        <p>
          {fr
            ? "Aucun résultat. Essayez une autre orthographe ou précisez votre ville directement dans la demande."
            : "No results. Try another spelling or enter your city directly in the request."}{" "}
          <Link
            className="text-link"
            href={
              pathFor(locale, "contact") +
              "?" +
              context +
              (region ? "&province=" + region : "") +
              "#quote"
            }
          >
            {copy.quote[locale]}
          </Link>
        </p>
      )}
      <div className="geo-markets">
        {found.map((m) => {
          const inquiry = new URLSearchParams(context);
          inquiry.set("market", m.id);
          return (
            <article key={m.id}>
              <span className="eyebrow">{m.region}</span>
              <h3>{m.name[locale]}</h3>
              <Link
                className="text-link"
                href={pathFor(locale, "contact") + "?" + inquiry + "#quote"}
              >
                {copy.quote[locale]} →
              </Link>
              <br />
              {m.metroId && (
                <Link
                  href={
                    pathFor(locale, m.metroId, "location") +
                    (context.size ? "?" + context : "")
                  }
                >
                  {fr ? "Guide métropolitain" : "Metro guide"} ↗
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
export function GeographicPage({
  locale,
  route,
  query,
}: {
  locale: Locale;
  route: Route;
  query: Query;
}) {
  const fr = locale === "fr";
  const metro =
    route.kind === "location"
      ? locations.find((l) => l.id === route.id)
      : undefined;
  const region = regions.find((r) => r.code === (metro?.region || route.id))!;
  const context = geographicContext(query);
  const inquiry = new URLSearchParams(context);
  if (metro) inquiry.set("location", metro.id);
  else inquiry.set("province", region.code);
  return (
    <>
      <PageIntro
        locale={locale}
        route={route}
        title={
          (fr ? "Location d’équipement — " : "Equipment rentals — ") +
          route.name[locale]
        }
        text={(metro || region).description[locale]}
      >
        <Link
          className="button"
          href={pathFor(locale, "contact") + "?" + inquiry + "#quote"}
        >
          {copy.quote[locale]} ↗
        </Link>
        {!metro && (
          <a className="text-link" href="#markets">
            {fr ? "CHOISIR UNE VILLE" : "CHOOSE A CITY"} ↓
          </a>
        )}
      </PageIntro>
      <section className="section container two-column">
        <div>
          <h2>
            {fr
              ? "Préparer le transport et l’accès"
              : "Plan transport and site access"}
          </h2>
          {metro && (
            <ul className="planning-list">
              {metro.considerations.map((c) => (
                <li key={c.en}>{c[locale]}</li>
              ))}
            </ul>
          )}
          <p>{region.planning[locale]}</p>
          <p>{copy.coverageNote[locale]}</p>
          <Link
            className="button"
            href={pathFor(locale, "contact") + "?" + inquiry + "#quote"}
          >
            {copy.quote[locale]} ↗
          </Link>
        </div>
        <aside className="municipalities">
          <h2>{fr ? "Votre lieu de travail" : "Your project location"}</h2>
          <p>
            {fr
              ? "Ces régions servent à situer votre demande. Chaque adresse, besoin d’équipement et trajet fait l’objet d’une confirmation; les villes indiquées ne désignent pas des succursales."
              : "These areas help locate your request. Each address, equipment requirement and transport route is subject to confirmation; listed cities do not identify branch offices."}
          </p>
          {metro ? (
            <>
              <div className="tags">
                {markets
                  .filter((m) => m.metroId === metro.id)
                  .map((m) => (
                    <Link
                      key={m.id}
                      href={
                        pathFor(locale, "contact") +
                        "?" +
                        context +
                        "&market=" +
                        m.id +
                        "#quote"
                      }
                    >
                      {m.name[locale]} ({m.region})
                    </Link>
                  ))}
              </div>
              <Link
                className="text-link"
                href={
                  pathFor(locale, region.code, "region") +
                  (context.size ? "?" + context : "")
                }
              >
                {region.name[locale]} →
              </Link>
              {regions
                .filter(
                  (r) =>
                    r.code !== region.code &&
                    metro.members.some((m) => m.region === r.code),
                )
                .map((r) => (
                  <Link
                    key={r.code}
                    className="text-link"
                    href={
                      pathFor(locale, r.code, "region") +
                      (context.size ? "?" + context : "")
                    }
                  >
                    {r.name[locale]} →
                  </Link>
                ))}
            </>
          ) : (
            <div className="related">
              {locations
                .filter((l) => l.members.some((m) => m.region === region.code))
                .map((l) => (
                  <Link
                    className="text-link"
                    key={l.id}
                    href={
                      pathFor(locale, l.id, "location") +
                      (context.size ? "?" + context : "")
                    }
                  >
                    {l.name[locale]} ↗
                  </Link>
                ))}
            </div>
          )}
        </aside>
      </section>
      <section className="section subtle">
        <div className="container">
          <h2>
            {fr
              ? "Équipement à considérer selon les travaux"
              : "Equipment to consider for the work"}
          </h2>
          <div className="catalog-grid">
            {region.categoryIds.map((id) => {
              const c = categories.find((c) => c.id === id)!;
              const quote = new URLSearchParams(inquiry);
              quote.delete("equipment");
              quote.delete("source");
              quote.set("category", id);
              return (
                <article className="equipment-card" key={id}>
                  <h3>
                    <Link href={pathFor(locale, id, "category")}>
                      {c.name[locale]} ↗
                    </Link>
                  </h3>
                  <p>{c.planning[locale]}</p>
                  <Link
                    className="text-link"
                    href={pathFor(locale, "contact") + "?" + quote + "#quote"}
                  >
                    {copy.quote[locale]}
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {!metro && (
        <LocationDiscovery
          locale={locale}
          query={query}
          regionCode={region.code}
        />
      )}
      <section className="section container">
        <Link
          className="text-link"
          href={
            pathFor(locale, "locations") + (context.size ? "?" + context : "")
          }
        >
          {fr ? "EXPLORER TOUTES LES RÉGIONS" : "EXPLORE ALL REGIONS"} →
        </Link>
      </section>
    </>
  );
}
