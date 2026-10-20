import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allRoutes,
  pathFor,
  pages,
  resolveRoute,
  type Route,
} from "@/lib/routes";
import { categories } from "@/lib/catalog";
import { locations, regions } from "@/lib/locations";
import { copy, industries } from "@/lib/copy";
import { isLocale, site, type Locale } from "@/lib/config";
import { legal } from "@/lib/legal";
import {
  Button,
  Breadcrumbs,
  PageIntro,
  CategoryGrid,
  QuoteSection,
  Process,
} from "@/components/Site";
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export function generateStaticParams() {
  return allRoutes().map(({ locale, route }) => ({
    locale,
    slug: route.path ? route.path.split("/") : [],
  }));
}
export const dynamicParams = true;
function description(locale: Locale, route: Route) {
  if (route.kind === "category")
    return categories.find((c) => c.id === route.id)!.description[locale];
  if (route.kind === "location")
    return locations.find((l) => l.id === route.id)!.description[locale];
  const texts: Record<string, string> = {
    home: copy.heroText[locale],
    rentals: copy.categoryIntro[locale],
    about: copy.aboutText[locale],
    contact: copy.contactText[locale],
    industries: copy.industriesIntro[locale],
    locations: copy.nationalText[locale],
    corporate: copy.corporateText[locale],
    privacy: legal.privacy[0].text[locale],
    terms: legal.terms[0].text[locale],
  };
  return texts[route.id];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const route = resolveRoute(locale, slug);
  if (!route) return { title: locale === "fr" ? "Page introuvable | National Rentals" : "Page not found | National Rentals", robots: { index: false, follow: false } };
  const title =
    route.id === "home"
      ? locale === "en"
        ? "Commercial Equipment Rentals Across Canada | National Rentals"
        : "Location d’équipement commercial au Canada | National Rentals"
      : `${route.name[locale]} | National Rentals`;
  const desc = description(locale, route).slice(0, 195);
  return {
    metadataBase: new URL(site.url),
    title,
    description: desc,
    alternates: {
      canonical: pathFor(locale, route.id, route.kind),
      languages: {
        "en-CA": pathFor("en", route.id, route.kind),
        "fr-CA": pathFor("fr", route.id, route.kind),
        "x-default": pathFor("en", route.id, route.kind),
      },
    },
    openGraph: {
      title,
      description: desc,
      url: pathFor(locale, route.id, route.kind),
      siteName: site.name,
      locale: locale === "en" ? "en_CA" : "fr_CA",
      alternateLocale: locale === "en" ? "fr_CA" : "en_CA",
      type: "website",
      images:
        route.id === "home"
          ? [
              {
                url: `/social-${locale}.png`,
                width: 1200,
                height: 630,
                alt: site.name,
              },
            ]
          : undefined,
    },
    twitter: {
      card: route.id === "home" ? "summary_large_image" : "summary",
      title,
      description: desc,
      images: route.id === "home" ? [`/social-${locale}.png`] : undefined,
    },
  };
}
function IndustryGrid({ locale }: { locale: Locale }) {
  return (
    <div className="industry-grid">
      {industries.map((item, i) => (
        <Link
          href={pathFor(locale, item.category, "category")}
          key={item.category}
        >
          <span className="eyebrow">0{i + 1}</span>
          <h3>
            {item.title[locale]} <span aria-hidden="true">↗</span>
          </h3>
          <p>{item.text[locale]}</p>
        </Link>
      ))}
    </div>
  );
}
function Coverage({ locale }: { locale: Locale }) {
  return (
    <section className="section coverage">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{copy.nationalLabel[locale]}</p>
            <h2>{copy.nationalTitle[locale]}</h2>
          </div>
          <div>
            <p>{copy.nationalText[locale]}</p>
            <Link className="text-link" href={pathFor(locale, "locations")}>
              {copy.regional[locale]} ↗
            </Link>
          </div>
        </div>
        <div className="location-links">
          {locations.map((l) => (
            <Link href={pathFor(locale, l.id, "location")} key={l.id}>
              <span>{l.region}</span>
              <h3>{l.name[locale]}</h3>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
        <p className="fine-print">{copy.coverageNote[locale]}</p>
      </div>
    </section>
  );
}
function CorporateBanner({ locale }: { locale: Locale }) {
  return (
    <section className="corporate-banner">
      <div className="container">
        <div>
          <p className="eyebrow">{pages.corporate.name[locale]}</p>
          <h2>{copy.corporateTitle[locale]}</h2>
        </div>
        <div>
          <p>{copy.corporateText[locale]}</p>
          <Button locale={locale} id="corporate">
            {copy.corporateCta[locale]}
          </Button>
        </div>
      </div>
    </section>
  );
}
function Home({ locale }: { locale: Locale }) {
  return (
    <>
      <section className="hero">
        <div className="hero-photo">
          <Image
            src={
              locale === "en"
                ? "/images/home-hero.webp"
                : "/images/home-hero-fr.webp"
            }
            alt={
              locale === "en"
                ? "Orange excavator and mobile generator on a gravel industrial site"
                : "Chariot télescopique orange devant un bâtiment à charpente métallique"
            }
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-shade" />
        <div className="container hero-content">
          <p className="eyebrow">{copy.eyebrow[locale]}</p>
          <h1>{copy.hero[locale]}</h1>
          <p>{copy.heroText[locale]}</p>
          <div className="button-row">
            <Button locale={locale} />
            <a className="button ghost" href={site.phoneHref}>
              {copy.call[locale]} ↗
            </a>
          </div>
          <div className="hero-foot">
            <span>
              {locale === "en"
                ? "EQUIPMENT / INFRASTRUCTURE / BUSINESS SOLUTIONS"
                : "ÉQUIPEMENT / INFRASTRUCTURES / SOLUTIONS D’AFFAIRES"}
            </span>
            <span>01 — 11</span>
          </div>
        </div>
      </section>
      <section className="intro-strip">
        <div className="container">
          <h2>{copy.strip[locale]}</h2>
          <p>{copy.stripText[locale]}</p>
          <a
            className="round-link"
            href="#equipment"
            aria-label={copy.browse[locale]}
          >
            ↓
          </a>
        </div>
      </section>
      <section id="equipment" className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{copy.categoryLabel[locale]}</p>
              <h2>{copy.categoryTitle[locale]}</h2>
            </div>
            <p>{copy.categoryIntro[locale]}</p>
          </div>
          <CategoryGrid locale={locale} />
        </div>
      </section>
      <section className="section featured">
        <div className="container">
          <p className="eyebrow">{copy.featuredLabel[locale]}</p>
          <h2>{copy.featured[locale]}</h2>
          <div className="featured-grid">
            {[
              { category: "construction", image: "featured-skid-steer" },
              { category: "aerial", image: "featured-lift" },
              { category: "power", image: "featured-power" },
            ].map((item) => {
              const c = categories.find((c) => c.id === item.category)!;
              const featured = c.equipment[c.id === "construction" ? 1 : 0];
              return (
                <Link
                  href={`${pathFor(locale, "contact")}?category=${c.id}&equipment=${featured.id}#quote`}
                  className={`featured-card ${locale === "fr" ? "text-feature" : ""}`}
                  key={c.id}
                >
                  {locale === "en" && (
                    <Image
                      src={`/images/${item.image}.svg`}
                      alt={featured.name[locale]}
                      width={600}
                      height={400}
                    />
                  )}
                  <div>
                    <p className="eyebrow">{c.name[locale]}</p>
                    <h3>
                      {featured.name[locale]} <span aria-hidden="true">↗</span>
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <Process locale={locale} />
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>{copy.industriesTitle[locale]}</h2>
            <p>{copy.industriesIntro[locale]}</p>
          </div>
          <IndustryGrid locale={locale} />
        </div>
      </section>
      <Coverage locale={locale} />
      <CorporateBanner locale={locale} />
      <QuoteSection locale={locale} />
    </>
  );
}
export default async function Page({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const route = resolveRoute(locale, slug);
  if (!route) notFound();
  let content: React.ReactNode;
  if (route.kind === "category") {
    const category = categories.find((c) => c.id === route.id)!;
    content = (
      <>
        <section className="category-hero container">
          <Breadcrumbs locale={locale} route={route} />
          <div className="two-column">
            <div>
              <p className="eyebrow">{pages.rentals.name[locale]}</p>
              <h1>{category.name[locale]}</h1>
              <p className="lead">{category.description[locale]}</p>
              <Link
                className="button"
                href={`${pathFor(locale, "contact")}?category=${category.id}#quote`}
              >
                {copy.quote[locale]} ↗
              </Link>
            </div>
            {locale === "en" ? (
              <Image
                src={`/images/${category.id}.svg`}
                alt={category.equipment[0].name[locale]}
                width={600}
                height={400}
                priority
              />
            ) : (
              <aside className="category-brief">
                <p className="eyebrow">POUR PRÉPARER VOTRE DEMANDE</p>
                <h2>
                  Les bons détails.
                  <br />
                  Dès le départ.
                </h2>
                <p>{category.planning.fr}</p>
                <div className="tags">
                  {category.equipment.slice(0, 4).map((e) => (
                    <span key={e.id}>{e.name.fr}</span>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </section>
        <section className="section subtle">
          <div className="container">
            <div className="section-heading">
              <h2>{copy.equipmentTitle[locale]}</h2>
              <p>{copy.equipmentNote[locale]}</p>
            </div>
            <div className="equipment-list">
              {category.equipment.map((e, i) => (
                <Link
                  key={e.id}
                  href={`${pathFor(locale, "contact")}?category=${category.id}&equipment=${e.id}#quote`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{e.name[locale]}</h3>
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <div className="planning">
              <h2>{copy.planTitle[locale]}</h2>
              <p>{category.planning[locale]}</p>
              <p>{copy.availability[locale]}</p>
            </div>
          </div>
        </section>
        <Process locale={locale} />
        <section className="section container">
          <h2>{copy.related[locale]}</h2>
          <div className="related">
            {categories
              .filter((c) => c.id !== category.id)
              .slice(0, 3)
              .map((c) => (
                <Link
                  className="text-link"
                  href={pathFor(locale, c.id, "category")}
                  key={c.id}
                >
                  {c.name[locale]} ↗
                </Link>
              ))}
          </div>
        </section>
      </>
    );
  } else if (route.kind === "location") {
    const location = locations.find((l) => l.id === route.id)!;
    content = (
      <>
        <PageIntro
          locale={locale}
          route={route}
          text={location.description[locale]}
        />
        <section className="section container two-column">
          <div>
            <h2>{copy.localPlanning[locale]}</h2>
            <ul className="planning-list">
              {location.considerations.map((c, i) => (
                <li key={i}>{c[locale]}</li>
              ))}
            </ul>
            <Button locale={locale} />
          </div>
          <aside className="municipalities">
            <p className="eyebrow">{location.metro[locale]}</p>
            <h2>{copy.municipalities[locale]}</h2>
            <div className="tags">
              {location.municipalities.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <p className="fine-print">{copy.coverageNote[locale]}</p>
          </aside>
        </section>
        <section className="section subtle">
          <div className="container">
            <h2>{copy.categoryTitle[locale]}</h2>
            <CategoryGrid locale={locale} />
          </div>
        </section>
      </>
    );
  } else
    switch (route.id) {
      case "home":
        content = <Home locale={locale} />;
        break;
      case "rentals":
        content = (
          <>
            <PageIntro
              locale={locale}
              route={route}
              title={copy.categoryTitle[locale]}
              text={copy.categoryIntro[locale]}
            />
            <section className="section container">
              <CategoryGrid locale={locale} />
            </section>
            <Process locale={locale} />
          </>
        );
        break;
      case "about":
        content = (
          <>
            <PageIntro
              locale={locale}
              route={route}
              title={copy.aboutTitle[locale]}
              text={copy.aboutText[locale]}
            />
            <section className="section container two-column">
              <div>
                <p className="eyebrow">{copy.operated[locale]}</p>
                <h2>
                  {locale === "en"
                    ? "The job comes first."
                    : "Le travail d’abord."}
                </h2>
              </div>
              <div>
                <p className="lead">{copy.aboutDetail[locale]}</p>
                <Button locale={locale} />
              </div>
            </section>
            <Process locale={locale} />
          </>
        );
        break;
      case "contact": {
        const query = await searchParams;
        const category = categories.find((c) => c.id === query.category);
        const equipment = category?.equipment.find(
          (e) => e.id === query.equipment,
        );
        content = (
          <>
            <PageIntro
              locale={locale}
              route={route}
              title={copy.contactTitle[locale]}
              text={copy.contactText[locale]}
            />
            <QuoteSection
              locale={locale}
              category={category?.id}
              equipment={equipment?.name[locale]}
            />
          </>
        );
        break;
      }
      case "industries":
        content = (
          <>
            <PageIntro
              locale={locale}
              route={route}
              title={copy.industriesTitle[locale]}
              text={copy.industriesIntro[locale]}
            />
            <section className="section container">
              <IndustryGrid locale={locale} />
            </section>
            <CorporateBanner locale={locale} />
          </>
        );
        break;
      case "locations":
        content = (
          <>
            <PageIntro
              locale={locale}
              route={route}
              title={copy.nationalTitle[locale]}
              text={copy.nationalText[locale]}
            />
            <Coverage locale={locale} />
            <section className="section container">
              <h2>
                {locale === "en"
                  ? "Every province. Every territory."
                  : "Chaque province. Chaque territoire."}
              </h2>
              <p>{copy.coverageNote[locale]}</p>
              <div className="regions">
                {regions.map((r) => (
                  <article key={r.code}>
                    <span className="eyebrow">{r.code}</span>
                    <h3>{r.name[locale]}</h3>
                    <p>{r.cities.map((c) => c[locale]).join(" · ")}</p>
                  </article>
                ))}
              </div>
            </section>
            <section className="section subtle">
              <div className="container">
                <h2>
                  {locale === "en"
                    ? "Planning a remote project?"
                    : "Vous planifiez un projet éloigné?"}
                </h2>
                <p className="lead">
                  {locale === "en"
                    ? "Share access routes, seasonal restrictions, transport requirements and the flexibility in your schedule. Remote requests need a specific feasibility review before equipment or delivery can be confirmed."
                    : "Précisez les voies d’accès, les restrictions saisonnières, les besoins de transport et la souplesse de votre échéancier. Les demandes pour des sites éloignés nécessitent une évaluation de faisabilité avant de confirmer l’équipement ou la livraison."}
                </p>
                <Button locale={locale} />
              </div>
            </section>
          </>
        );
        break;
      case "corporate":
        content = (
          <>
            <PageIntro
              locale={locale}
              route={route}
              title={copy.corporateTitle[locale]}
              text={copy.corporateText[locale]}
            />
            <section className="section container two-column">
              <div>
                <h2>
                  {locale === "en"
                    ? "A clearer view of your rental requirements."
                    : "Une vue claire de vos besoins de location."}
                </h2>
                <p>
                  {locale === "en"
                    ? "For recurring work or multiple locations, send a consolidated brief. We can review how to coordinate equipment requests, site schedules and project communications. Program structure and service arrangements are established case by case."
                    : "Pour des travaux récurrents ou plusieurs emplacements, envoyez un dossier regroupé. Nous pouvons évaluer la coordination des demandes d’équipement, des échéanciers et des communications. La structure du programme et les modalités sont établies au cas par cas."}
                </p>
                <Button locale={locale} />
              </div>
              <div className="planning">
                <h3>{copy.planTitle[locale]}</h3>
                <ul className="planning-list">
                  {(locale === "en"
                    ? [
                        "Site addresses and regional contacts",
                        "Equipment specifications and estimated quantities",
                        "Start dates, durations and recurring schedules",
                        "Purchase-order, invoicing and approval requirements",
                        "Delivery access, installation and pickup constraints",
                      ]
                    : [
                        "Adresses des sites et personnes-ressources régionales",
                        "Caractéristiques de l’équipement et quantités estimées",
                        "Dates de début, durées et échéanciers récurrents",
                        "Exigences de bons de commande, de facturation et d’approbation",
                        "Contraintes d’accès, d’installation et de ramassage",
                      ]
                  ).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </section>
            <Process locale={locale} />
          </>
        );
        break;
      case "privacy":
      case "terms":
        content = (
          <>
            <PageIntro locale={locale} route={route} />
            <section className="section container legal">
              {legal[route.id].map((s) => (
                <article key={s.title.en}>
                  <h2>{s.title[locale]}</h2>
                  <p>{s.text[locale]}</p>
                </article>
              ))}
              <a className="text-link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </section>
          </>
        );
        break;
      default:
        notFound();
    }
  const breadcrumbs = [
    { name: pages.home.name[locale], item: site.url + pathFor(locale, "home") },
    ...(route.kind !== "page"
      ? [
          {
            name: pages[route.kind === "category" ? "rentals" : "locations"]
              .name[locale],
            item:
              site.url +
              pathFor(
                locale,
                route.kind === "category" ? "rentals" : "locations",
              ),
          },
        ]
      : []),
    ...(route.id !== "home"
      ? [
          {
            name: route.name[locale],
            item: site.url + pathFor(locale, route.id, route.kind),
          },
        ]
      : []),
  ];
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        parentOrganization: { "@type": "Organization", name: site.operator },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...item,
        })),
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      {content}
    </>
  );
}
