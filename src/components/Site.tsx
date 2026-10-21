import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site, type Locale } from "@/lib/config";
import { copy } from "@/lib/copy";
import { categories } from "@/lib/catalog";
import { pages, pathFor, breadcrumbItems, type Route } from "@/lib/routes";
import { QuoteForm } from "./QuoteForm";
export function Button({
  locale,
  id = "contact",
  children,
  secondary = false,
}: {
  locale: Locale;
  id?: string;
  children?: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={`${pathFor(locale, id)}${id === "contact" ? "#quote" : ""}`}
      className={`button${secondary ? " secondary" : ""}`}
    >
      {children || copy.quote[locale]} <span aria-hidden="true">↗</span>
    </Link>
  );
}
export function Breadcrumbs({
  locale,
  route,
}: {
  locale: Locale;
  route: Route;
}) {
  return (
    <nav
      className="breadcrumbs"
      aria-label={locale === "en" ? "Breadcrumb" : "Fil d’Ariane"}
    >
      {breadcrumbItems(locale, route).map((item, index, items) => (
        <span key={item.path}>
          {index > 0 && <span aria-hidden="true"> / </span>}
          {index === items.length - 1 ? (
            <span aria-current="page">{item.name}</span>
          ) : (
            <Link href={item.path}>{item.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
export function PageIntro({
  locale,
  route,
  title,
  text,
  children,
}: {
  locale: Locale;
  route: Route;
  title?: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Breadcrumbs locale={locale} route={route} />
        <p className="eyebrow">NATIONAL RENTALS / {route.name[locale]}</p>
        <h1>{title || route.name[locale]}</h1>
        {text && <p className="lead">{text}</p>}
        {children && <div className="button-row">{children}</div>}
      </div>
    </section>
  );
}
export function CategoryGrid({ locale }: { locale: Locale }) {
  return (
    <div className="category-grid">
      {categories.map((c, i) => (
        <Link
          key={c.id}
          href={pathFor(locale, c.id, "category")}
          className="category-card"
        >
          <span className="category-number">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{c.name[locale]}</h3>
          <p>
            {c.equipment
              .slice(0, 3)
              .map((e) => e.name[locale])
              .join(" · ")}
          </p>
          <span className="card-arrow" aria-hidden="true">
            ↗
          </span>
        </Link>
      ))}
    </div>
  );
}
export function QuoteSection({
  locale,
  category = "",
  equipment = "",
  sourceEquipment = "",
  industry = "",
  products = [],
  city = "",
  province = "",
}: {
  locale: Locale;
  category?: string;
  equipment?: string;
  sourceEquipment?: string;
  industry?: string;
  products?: string[];
  city?: string;
  province?: string;
}) {
  return (
    <section id="quote" className="section quote-section">
      <div className="container quote-layout">
        <div className="quote-copy">
          <p className="eyebrow">{copy.quote[locale]}</p>
          <h2>{copy.quoteTitle[locale]}</h2>
          <p className="lead">{copy.quoteIntro[locale]}</p>
          <div className="quote-help">
            <h3>{copy.quoteAside[locale]}</h3>
            <p>{copy.quoteHelp[locale]}</p>
          </div>
          <a className="contact-line" href={`mailto:${site.email}`}>
            {site.email} ↗
          </a>
          {site.phoneVerified && (
            <a className="contact-line" href={site.phoneHref}>
              {site.phone} ↗
            </a>
          )}
        </div>
        <QuoteForm
          locale={locale}
          initialCategory={category}
          initialEquipment={equipment}
          sourceEquipment={sourceEquipment}
          initialIndustry={industry}
          initialProducts={products}
          city={city}
          province={province}
        />
      </div>
    </section>
  );
}
export function Process({ locale }: { locale: Locale }) {
  return (
    <section className="section process">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.processLabel[locale]}</p>
            <h2>{copy.processTitle[locale]}</h2>
          </div>
          <p>{copy.processIntro[locale]}</p>
        </div>
        <div className="steps">
          {copy.steps.map((step, i) => (
            <article key={i}>
              <span className="step-number">0{i + 1}</span>
              <h3>{step.title[locale]}</h3>
              <p>{step.text[locale]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link
              className="brand"
              href={pathFor(locale, "home")}
              aria-label="National Rentals"
            >
              <Logo />
            </Link>
            <p>{copy.footerText[locale]}</p>
            <p className="muted">{copy.operated[locale]}</p>
          </div>
          <div>
            <h2>{locale === "en" ? "Explore" : "Explorer"}</h2>
            {(["rentals", "industries", "locations", "corporate"] as const).map(
              (id) => (
                <Link key={id} href={pathFor(locale, id)}>
                  {pages[id].name[locale]}
                </Link>
              ),
            )}
          </div>
          <div>
            <h2>{locale === "en" ? "Company" : "Entreprise"}</h2>
            {(["about", "contact", "privacy", "terms"] as const).map((id) => (
              <Link key={id} href={pathFor(locale, id)}>
                {pages[id].name[locale]}
              </Link>
            ))}
          </div>
          <div>
            <h2>{pages.contact.name[locale]}</h2>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.phoneVerified && <a href={site.phoneHref}>{site.phone}</a>}
            <p>
              {locale === "en"
                ? "Commercial inquiries across Canada."
                : "Demandes commerciales partout au Canada."}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.operator} {copy.rights[locale]}
          </span>
          <span>EN / FR · CANADA</span>
        </div>
      </div>
    </footer>
  );
}
