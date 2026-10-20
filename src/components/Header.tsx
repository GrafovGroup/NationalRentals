"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { usePathname } from "next/navigation";
import { getEquipment } from "@/lib/equipment";
import { categories } from "@/lib/catalog";
import { type Locale, site } from "@/lib/config";
import { copy } from "@/lib/copy";
import {
  pages,
  pathFor,
  resolveRoute,
  equipmentInquiryHref,
} from "@/lib/routes";
export function Header({ locale }: { locale: Locale }) {
  const [mobile, setMobile] = useState(false),
    [mega, setMega] = useState(false);
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const equipmentButton = useRef<HTMLButtonElement>(null);
  const other = locale === "en" ? "fr" : "en";
  const route = resolveRoute(
    locale,
    pathname.split("/").filter(Boolean).slice(1),
  );
  const switchPath = route
    ? pathFor(other, route.id, route.kind)
    : pathFor(other, "home");
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) {
        setMega(false);
        setMobile(false);
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (mega) {
          setMega(false);
          equipmentButton.current?.focus();
        } else if (mobile) {
          setMobile(false);
          menuButton.current?.focus();
        }
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [mega, mobile]);
  function close() {
    setMobile(false);
    setMega(false);
  }
  return (
    <header ref={root} className="site-header">
      <a className="skip" href="#main">
        {copy.skip[locale]}
      </a>
      <div className="utility">
        <div className="container">
          <span>{copy.top[locale]}</span>
          {site.phoneVerified ? (
            <a href={site.phoneHref}>{site.phone}</a>
          ) : (
            <a href={`mailto:${site.email}`}>{site.email}</a>
          )}
        </div>
      </div>
      <div className="container header-row">
        <Link
          href={pathFor(locale, "home")}
          className="brand"
          onClick={close}
          aria-label="National Rentals"
        >
          <Logo />
        </Link>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-expanded={mobile}
          aria-controls="main-navigation"
          onClick={() => {
            setMobile(!mobile);
            setMega(false);
          }}
        >
          {mobile ? copy.close[locale] : copy.menu[locale]}{" "}
          <span aria-hidden="true">{mobile ? "×" : "☰"}</span>
        </button>
        <nav
          id="main-navigation"
          aria-label={copy.nav[locale]}
          className={mobile ? "navigation open" : "navigation"}
        >
          <button
            ref={equipmentButton}
            className="nav-link"
            aria-expanded={mega}
            aria-controls="equipment-menu"
            onClick={() => setMega(!mega)}
          >
            {pages.rentals.name[locale]} <span aria-hidden="true">⌄</span>
          </button>
          {(["industries", "locations", "corporate"] as const).map((id) => (
            <Link
              key={id}
              href={pathFor(locale, id)}
              onClick={close}
              className="nav-link"
              aria-current={route?.id === id ? "page" : undefined}
            >
              {pages[id].name[locale]}
            </Link>
          ))}
          <a
            className="language"
            lang={other}
            hrefLang={other}
            href={switchPath}
            onClick={(event) => {
              const source = new URLSearchParams(window.location.search);
              const query = new URLSearchParams();
              for (const key of [
                "category",
                "equipment",
                "source",
                "q",
                "subcategory",
                "industry",
                "province",
                "market",
                "location",
              ]) {
                const value = source.get(key);
                if (value) query.set(key, value);
              }
              event.currentTarget.href =
                switchPath +
                (query.size ? `?${query}` : "") +
                window.location.hash;
              close();
            }}
            aria-label={
              other === "fr" ? "Passer en français" : "Switch to English"
            }
          >
            {other}
          </a>
          <Link
            className="button small"
            href={
              route?.kind === "equipment"
                ? equipmentInquiryHref(locale, route.id)
                : pathFor(locale, "contact") +
                  (route?.kind === "category"
                    ? "?category=" + route.id
                    : route?.kind === "region"
                      ? "?province=" + route.id
                      : route?.kind === "location"
                        ? "?location=" + route.id
                        : "") +
                  "#quote"
            }
            onClick={(event) => {
              const context = new URLSearchParams(window.location.search);
              if (
                route?.kind !== "equipment" &&
                [
                  "equipment",
                  "category",
                  "market",
                  "location",
                  "province",
                ].some((key) => context.has(key))
              ) {
                event.preventDefault();
                const target = new URL(event.currentTarget.href);
                for (const key of [
                  "equipment",
                  "category",
                  "source",
                  "market",
                  "location",
                  "province",
                ]) {
                  const value = context.get(key);
                  if (value && !target.searchParams.has(key))
                    target.searchParams.set(key, value);
                }
                const item = getEquipment(context.get("equipment") || "");
                if (item) {
                  target.searchParams.set("category", item.categoryId);
                  target.searchParams.set("source", item.id);
                }
                window.location.assign(target.href);
              }
              close();
            }}
          >
            {copy.quote[locale]} <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
      {mega && (
        <div id="equipment-menu" className="mega">
          <div className="container">
            <div className="mega-intro">
              <p className="eyebrow">{copy.featuredLabel[locale]}</p>
              <h2>{copy.categoryTitle[locale]}</h2>
              <Link
                className="text-link"
                href={pathFor(locale, "rentals")}
                onClick={close}
              >
                {copy.allCategories[locale]} →
              </Link>
            </div>
            <div className="mega-links">
              {categories.map((c, i) => (
                <Link
                  href={pathFor(locale, c.id, "category")}
                  key={c.id}
                  onClick={close}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {c.name[locale]} <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
