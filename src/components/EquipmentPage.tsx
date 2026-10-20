import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "./Site";
import { categories } from "@/lib/catalog";
import { industries, copy } from "@/lib/copy";
import {
  getEquipment,
  subcategories,
  type EquipmentItem,
} from "@/lib/equipment";
import { locations } from "@/lib/locations";
import { equipmentInquiryHref, pathFor, type Route } from "@/lib/routes";
import { site, type Locale } from "@/lib/config";
export function EquipmentPage({
  locale,
  item,
  route,
}: {
  locale: Locale;
  item: EquipmentItem;
  route: Route;
}) {
  const fr = locale === "fr";
  const category = categories.find((c) => c.id === item.categoryId)!;
  const group = subcategories.find((s) => s.id === item.subcategoryId)!;
  const inquiry = equipmentInquiryHref(locale, item.id);
  const image = item.images[locale];
  return (
    <>
      <section className="container equipment-hero">
        <Breadcrumbs locale={locale} route={route} />
        <div className="equipment-layout">
          <div>
            <p className="eyebrow">
              {category.name[locale]} / {group.name[locale]}
            </p>
            <h1>{item.name[locale]}</h1>
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
            <p className="fine-print">
              {fr
                ? "La configuration et les modalités sont évaluées selon votre projet, votre région et vos dates."
                : "Configuration and rental terms are reviewed against your project, location and dates."}
            </p>
          </div>
          <aside className="equipment-brief">
            {image && (
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                sizes="(max-width:650px) 100vw, 40vw"
              />
            )}
            <p className="eyebrow">
              {fr ? "VOTRE DEMANDE, BIEN PRÉPARÉE" : "A WELL-PREPARED REQUEST"}
            </p>
            <h2>
              {fr
                ? "Les critères qui comptent"
                : "What matters for this equipment"}
            </h2>
            <p>{item.selection[locale]}</p>
            <Link className="text-link" href={inquiry}>
              {fr ? "Préparer la demande" : "Prepare your request"} →
            </Link>
          </aside>
        </div>
      </section>
      <section className="section subtle">
        <div className="container equipment-details">
          <div>
            <p className="eyebrow">{fr ? "APPLICATIONS" : "APPLICATIONS"}</p>
            <h2>{fr ? "Usages courants" : "Common uses"}</h2>
            <ul className="planning-list">
              {item.applications.map((a) => (
                <li key={a.en}>{a[locale]}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">
              {fr ? "SÉLECTION TECHNIQUE" : "TECHNICAL SELECTION"}
            </p>
            <h2>
              {fr ? "Caractéristiques à préciser" : "Specifications to define"}
            </h2>
            <p>
              {fr
                ? "Ces champs servent à préciser le besoin; ce ne sont pas les caractéristiques d’un modèle offert."
                : "These fields help define the requirement; they are not specifications for an offered model."}
            </p>
            <ul className="specification-list">
              {item.specificationFields.map((s) => (
                <li key={s.en}>{s[locale]}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section container equipment-details">
        <div>
          <h2>
            {fr ? "Location et livraison" : "Rental and delivery planning"}
          </h2>
          <p>{item.delivery[locale]}</p>
          <p>{category.planning[locale]}</p>
        </div>
        <div>
          <h2>
            {fr ? "Votre contexte de travail" : "Your working environment"}
          </h2>
          <p>
            {fr
              ? "Ajoutez les contraintes d’accès et les exigences de votre secteur à la demande. Consultez les repères régionaux pour préparer le transport."
              : "Include access constraints and industry requirements in your request. Review regional planning notes when preparing transport details."}
          </p>
          <div className="tags">
            {industries
              .filter((i) => item.industryIds.includes(i.category))
              .map((i) => (
                <Link
                  key={i.category}
                  href={pathFor(locale, "industries") + "#" + i.category}
                >
                  {i.title[locale]}
                </Link>
              ))}
          </div>
          <div className="related">
            {locations.map((l) => (
              <Link
                key={l.id}
                className="text-link"
                href={pathFor(locale, l.id, "location")}
              >
                {l.name[locale]} ↗
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section subtle">
        <div className="container">
          <div className="section-heading">
            <h2>{fr ? "Équipement connexe" : "Related equipment"}</h2>
            <Link
              className="text-link"
              href={pathFor(locale, category.id, "category")}
            >
              {category.name[locale]} →
            </Link>
          </div>
          <div className="catalog-grid">
            {item.relatedIds
              .map((id) => getEquipment(id))
              .filter((i) => !!i)
              .map((i) => (
                <article className="equipment-card" key={i.id}>
                  <h3>
                    <Link href={pathFor(locale, i.id, "equipment")}>
                      {i.name[locale]} ↗
                    </Link>
                  </h3>
                  <p>{i.overview[locale]}</p>
                </article>
              ))}
          </div>
        </div>
      </section>
      <section className="corporate-banner">
        <div className="container">
          <div>
            <p className="eyebrow">{item.name[locale]}</p>
            <h2>
              {fr
                ? "Parlons du travail à réaliser."
                : "Tell us about the work."}
            </h2>
          </div>
          <div>
            <p>
              {fr
                ? "L’équipement et la catégorie seront déjà inscrits dans votre demande. Ajoutez les quantités, le lieu et les dates souhaitées."
                : "Your equipment and category will be entered in the request. Add quantities, location and preferred dates."}
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
