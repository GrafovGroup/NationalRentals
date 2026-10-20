const configuredPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+18336969996";
export const site = {
  name: "National Rentals",
  operator: "Grafov Group Inc.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nationalrentals.ca",
  email: "info@nationalrentals.ca",
  phone: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "(833) 696-9996",
  phoneHref: "tel:" + configuredPhone,
  phoneVerified:
    process.env.NEXT_PUBLIC_PHONE_VERIFIED === "true" &&
    /^\+[1-9]\d{7,14}$/.test(configuredPhone),
};
export type Locale = "en" | "fr";
export type Localized = Record<Locale, string>;
export const locales: Locale[] = ["en", "fr"];
export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);
export const b = (en: string, fr: string): Localized => ({ en, fr });
