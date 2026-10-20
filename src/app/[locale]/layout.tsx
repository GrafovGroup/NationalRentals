import { Journey } from "@/components/Journey";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Site";
import "../globals.css";
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale === "fr" ? "fr-CA" : "en-CA"}>
      <body>
        <Header locale={locale} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <Journey locale={locale} />
      </body>
    </html>
  );
}
