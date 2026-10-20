import Link from "next/link";
import { categories } from "@/lib/catalog";
import { industries } from "@/lib/copy";
import {
  filterEquipment,
  subcategories,
  type CatalogFilters,
} from "@/lib/equipment";
import { pathFor } from "@/lib/routes";
import { type Locale } from "@/lib/config";

export function CatalogBrowser({
  locale,
  filters = {},
  categoryId,
}: {
  locale: Locale;
  filters?: CatalogFilters;
  categoryId?: string;
}) {
  const fr = locale === "fr";
  const active = {
    ...filters,
    ...(categoryId ? { category: categoryId } : {}),
  };
  const items = filterEquipment(active, locale);
  const action = categoryId
    ? pathFor(locale, categoryId, "category")
    : pathFor(locale, "rentals");
  const groups = subcategories.filter(
    (s) => !categoryId || s.categoryId === categoryId,
  );
  return (
    <section className="section catalog-section" id="catalog">
      <div className="container">
        {!categoryId && (
          <details className="catalog-category-nav">
            <summary>
              {fr ? "Parcourir les 11 catégories" : "Browse all 11 categories"}
            </summary>
            <nav
              aria-label={
                fr ? "Catégories d’équipement" : "Equipment categories"
              }
            >
              {categories.map((c) => (
                <Link href={pathFor(locale, c.id, "category")} key={c.id}>
                  {c.name[locale]} →
                </Link>
              ))}
            </nav>
          </details>
        )}
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {fr
                ? "TROUVEZ L’ÉQUIPEMENT ADAPTÉ"
                : "FIND EQUIPMENT FOR THE JOB"}
            </p>
            <h2>{fr ? "Explorez le catalogue" : "Explore the catalog"}</h2>
          </div>
          <p>
            {fr
              ? "Précisez votre recherche par usage et catégorie. Consultez chaque fiche pour préparer une demande adaptée au travail."
              : "Narrow your search by application and category. Open an equipment profile to prepare a request around the work."}
          </p>
        </div>
        <form
          method="get"
          action={action + "#catalog"}
          className="catalog-filters"
          role="search"
          aria-label={fr ? "Recherche d’équipement" : "Equipment search"}
        >
          <label className="field catalog-keyword">
            {fr ? "Mot-clé" : "Keyword"}
            <input
              type="search"
              name="q"
              maxLength={120}
              defaultValue={filters.keyword || ""}
              placeholder={
                fr
                  ? "Ex. : béton, manutention, séchage"
                  : "E.g. concrete, handling, drying"
              }
            />
          </label>
          {categoryId ? (
            <input type="hidden" name="category" value={categoryId} />
          ) : (
            <label className="field">
              {fr ? "Catégorie" : "Category"}
              <select name="category" defaultValue={filters.category || ""}>
                <option value="">
                  {fr ? "Toutes les catégories" : "All categories"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[locale]}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="field">
            {fr ? "Sous-catégorie" : "Subcategory"}
            <select name="subcategory" defaultValue={filters.subcategory || ""}>
              <option value="">
                {fr ? "Toutes les sous-catégories" : "All subcategories"}
              </option>
              {groups.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {fr ? "Secteur d’activité" : "Industry"}
            <select name="industry" defaultValue={filters.industry || ""}>
              <option value="">
                {fr ? "Tous les secteurs" : "All industries"}
              </option>
              {industries.map((i) => (
                <option key={i.category} value={i.category}>
                  {i.title[locale]}
                </option>
              ))}
            </select>
          </label>
          <div className="catalog-actions">
            <button className="button" type="submit">
              {fr ? "Rechercher" : "Search equipment"}
            </button>
            <Link className="text-link" href={action + "#catalog"}>
              {fr ? "Effacer les filtres" : "Clear filters"}
            </Link>
          </div>
        </form>
        <p className="catalog-count" role="status">
          {fr
            ? `${items.length} ${items.length === 1 ? "type" : "types"} d’équipement`
            : `${items.length} equipment ${items.length === 1 ? "type" : "types"}`}
        </p>
        {items.length ? (
          <div className="catalog-grid">
            {items.map((item) => {
              const category = categories.find(
                (c) => c.id === item.categoryId,
              )!;
              return (
                <article className="equipment-card" key={item.id}>
                  <p className="eyebrow">{category.name[locale]}</p>
                  <h3>
                    <Link href={pathFor(locale, item.id, "equipment")}>
                      {item.name[locale]} <span aria-hidden="true">↗</span>
                    </Link>
                  </h3>
                  <p>{item.overview[locale]}</p>
                  <p className="equipment-use">
                    {item.applications[0][locale]}
                  </p>
                  <Link
                    className="text-link"
                    href={pathFor(locale, item.id, "equipment")}
                  >
                    {fr ? "Voir la fiche" : "View equipment"}
                    <span className="sr-only"> : {item.name[locale]}</span> →
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="catalog-empty">
            <h3>
              {fr
                ? "Aucun résultat pour ces critères"
                : "No equipment matches these filters"}
            </h3>
            <p>
              {fr
                ? "Essayez un terme plus général ou retirez un filtre. Vous pouvez aussi nous décrire un besoin particulier."
                : "Try a broader keyword or remove a filter. You can also tell us about a requirement that is not listed."}
            </p>
            <Link
              className="button"
              href={pathFor(locale, "contact") + "#quote"}
            >
              {fr ? "Décrire mon besoin" : "Describe your requirement"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
