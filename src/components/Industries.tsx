import Link from "next/link";
import { publishedIndustries, type Industry } from "@/lib/industries";
import { getEquipment } from "@/lib/equipment";
import { categories } from "@/lib/catalog";
import { locations } from "@/lib/locations";
import { pathFor, industryInquiryHref, type Route } from "@/lib/routes";
import { site, type Locale } from "@/lib/config";
import { copy } from "@/lib/copy";
import { Breadcrumbs } from "./Site";
export function IndustryGrid({ locale }: { locale: Locale }) {
  return (
    <div className="industry-grid">
      {publishedIndustries.map((item, i) => (
        <Link key={item.id} href={pathFor(locale, item.id, "industry")}>
          <span className="eyebrow">
            {String(i + 1).padStart(2, "0")} /{" "}
            {locale === "fr" ? "SECTEUR" : "INDUSTRY"}
          </span>
          <h3>{item.title[locale]} ↗</h3>
          <p>{item.overview[locale]}</p>
        </Link>
      ))}
    </div>
  );
}
export function IndustryPage({
  locale,
  item,
  route,
}: {
  locale: Locale;
  item: Industry;
  route: Route;
}) {
  const fr = locale === "fr";
  const number = String(publishedIndustries.indexOf(item) + 1).padStart(2, "0");
  const inquiry = industryInquiryHref(locale, item.id);
  return (
    <>
      <section className="industry-hero container">
        <Breadcrumbs locale={locale} route={route} />
        <div className="industry-hero-layout">
          <div>
            <p className="eyebrow">{item.title[locale]}</p>
            <h1>{item.headline[locale]}</h1>
            <p className="lead">{item.overview[locale]}</p>
            <div className="button-row">
              <Link className="button" href={inquiry}>
                {copy.quote[locale]} ↗
              </Link>
              {site.phoneVerified && (
                <a className="button secondary" href={site.phoneHref}>
                  {copy.call[locale]}
                </a>
              )}
            </div>
          </div>
          <aside className="industry-brief">
            <span className="industry-number" aria-hidden="true">
              {number}
            </span>
            <p className="eyebrow">
              {fr ? "VOTRE DOSSIER DE PROJET" : "YOUR PROJECT BRIEF"}
            </p>
            <h2>{item.title[locale]}</h2>
            <p>{item.planning[0][locale]}</p>
            <a className="text-link" href="#project-equipment">
              {fr ? "CHOISIR L’ÉQUIPEMENT" : "SELECT EQUIPMENT"} ↓
            </a>
          </aside>
        </div>
      </section>
      <section className="section subtle">
        <div className="container">
          <p className="eyebrow">
            {fr ? "SITUATIONS DE TRAVAIL" : "WORK SCENARIOS"}
          </p>
          <h2>{fr ? "Partir du travail à réaliser" : "Start with the work"}</h2>
          <div className="industry-scenarios">
            {item.scenarios.map((s, i) => (
              <article key={s.en}>
                <span className="eyebrow">
                  {number}.{i + 1}
                </span>
                <h3>{s[locale].split(" : ")[0].split(": ")[0]}</h3>
                <p>
                  {s[locale]
                    .split(/ : |: /)
                    .slice(1)
                    .join(": ")}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section container" id="project-equipment">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {fr ? "UNE DEMANDE REGROUPÉE" : "ONE COORDINATED REQUEST"}
            </p>
            <h2>
              {fr
                ? "Composer votre liste d’équipement"
                : "Build your equipment list"}
            </h2>
            <p>
              {fr
                ? "Choisissez les articles à inclure. Les quantités, les dates et les besoins propres à chaque site seront précisés dans le formulaire."
                : "Select items to include. Add quantities, dates and requirements for each site in the inquiry form."}
            </p>
          </div>
        </div>
        <form
          action={pathFor(locale, "contact") + "#quote"}
          method="get"
          className="industry-project"
        >
          <input type="hidden" name="industry" value={item.id} />
          <fieldset>
            <legend>
              {fr
                ? "Équipement à inclure (facultatif)"
                : "Equipment to include (optional)"}
            </legend>
            <div className="catalog-grid">
              {item.equipmentIds.map((id) => {
                const e = getEquipment(id)!;
                return (
                  <article className="equipment-card" key={id}>
                    <h3>
                      <Link href={pathFor(locale, id, "equipment")}>
                        {e.name[locale]} ↗
                      </Link>
                    </h3>
                    <p>{e.selection[locale]}</p>
                    <label className="industry-pick">
                      <input type="checkbox" name="products" value={id} />
                      {fr ? "INCLURE DANS LA DEMANDE" : "INCLUDE IN REQUEST"}
                    </label>
                  </article>
                );
              })}
            </div>
          </fieldset>
          <button className="button" type="submit">
            {fr ? "PRÉPARER LA DEMANDE" : "PREPARE REQUEST"} ↗
          </button>
        </form>
      </section>
      <section className="section subtle">
        <div className="container equipment-details">
          <div>
            <p className="eyebrow">{fr ? "PLANIFICATION" : "PLANNING"}</p>
            <h2>{fr ? "Les éléments à préciser" : "Details to define"}</h2>
            <ul className="planning-list">
              {item.planning.map((p) => (
                <li key={p.en}>{p[locale]}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{fr ? "Catégories complémentaires" : "Related categories"}</h2>
            <div className="related">
              {item.categoryIds.map((id) => (
                <Link
                  key={id}
                  className="text-link"
                  href={pathFor(locale, id, "category")}
                >
                  {categories.find((c) => c.id === id)!.name[locale]} ↗
                </Link>
              ))}
            </div>
            <h3>
              {fr
                ? "Plusieurs lieux de travail?"
                : "Working across several sites?"}
            </h3>
            <p>
              {fr
                ? "Précisez les adresses et les contacts par site. Les modalités et la faisabilité sont évaluées pour chaque lieu."
                : "List the addresses and contacts for each site. Rental terms and feasibility are assessed per location."}
            </p>
            <Link className="text-link" href={pathFor(locale, "corporate")}>
              {fr ? "COORDINATION MULTISITE" : "MULTI-SITE COORDINATION"} ↗
            </Link>
          </div>
        </div>
      </section>
      <section className="section container equipment-details">
        <div>
          <h2>{fr ? "Préparer la livraison" : "Prepare for delivery"}</h2>
          <p>
            {fr
              ? "Consultez les repères régionaux ou recherchez votre ville. Ces guides décrivent le contexte de livraison; ils ne désignent pas des succursales."
              : "Review regional guidance or find your city. These guides describe delivery context; they do not identify branch locations."}
          </p>
          <div className="related">
            {item.locationIds.map((id) => (
              <Link
                key={id}
                className="text-link"
                href={pathFor(locale, id, "location") + "?industry=" + item.id}
              >
                {locations.find((l) => l.id === id)!.name[locale]} ↗
              </Link>
            ))}
            <Link
              className="text-link"
              href={pathFor(locale, "locations") + "?industry=" + item.id}
            >
              {fr ? "TOUTES LES RÉGIONS" : "ALL LOCATIONS"} ↗
            </Link>
          </div>
        </div>
        <div>
          <h2>{fr ? "Questions de planification" : "Planning questions"}</h2>
          {item.faq.map((f) => (
            <details className="industry-faq" key={f.question.en}>
              <summary>{f.question[locale]}</summary>
              <p>{f.answer[locale]}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="corporate-banner">
        <div className="container">
          <div>
            <p className="eyebrow">{item.title[locale]}</p>
            <h2>
              {fr
                ? "Un projet à préciser ensemble."
                : "Bring the project details together."}
            </h2>
          </div>
          <div>
            <p>
              {fr
                ? "Décrivez le travail, les lieux, les quantités et les dates souhaitées. Votre secteur accompagnera la demande."
                : "Describe the work, locations, quantities and preferred dates. Your industry will accompany the request."}
            </p>
            <Link className="button" href={inquiry}>
              {copy.quote[locale]} ↗
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
