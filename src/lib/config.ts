export const site = {
  name: "National Rentals",
  operator: "Grafov Group Inc.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nationalrentals.ca",
  email: "info@nationalrentals.ca",
  phone: "(833) 696-9996",
  phoneHref: "tel:+18336969996",
};
export type Locale = "en" | "fr";
export type Localized = Record<Locale, string>;
export const locales: Locale[] = ["en", "fr"];
export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);
export const b = (en: string, fr: string): Localized => ({ en, fr });
