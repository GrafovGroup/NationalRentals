"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { type Locale } from "@/lib/config";
import { resolveRoute } from "@/lib/routes";
import { measure } from "@/lib/measurement";
export function Journey({ locale }: { locale: Locale }) {
  const path = usePathname();
  const [consent, setConsent] = useState<string | null>(null);
  useEffect(() => {
    try {
      const existing = sessionStorage.getItem("nr:measurement-consent");
      queueMicrotask(() => setConsent(existing));
      const previous = sessionStorage.getItem("nr:current-path");
      if (previous && previous !== path)
        sessionStorage.setItem("nr:previous-path", previous);
      sessionStorage.setItem("nr:current-path", path);
      const params = new URLSearchParams(location.search);
      const values: Record<string, string> = {};
      for (const key of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ]) {
        const value = params.get(key);
        if (value)
          values[key] = value
            .replace(/[\u0000-\u001f\u007f]/g, "")
            .slice(0, 200);
      }
      if (document.referrer) {
        const ref = new URL(document.referrer);
        if (ref.origin !== location.origin)
          values.referrer = ref.origin.slice(0, 300);
      }
      if (Object.keys(values).length)
        sessionStorage.setItem(
          "nr:attribution",
          JSON.stringify({ at: Date.now(), values }),
        );
    } catch {
      /* Storage may be blocked. */
    }
    const route = resolveRoute(
      locale,
      path.split("/").filter(Boolean).slice(1),
    );
    if (route?.kind === "equipment") measure("equipment_view");
    if (
      route?.kind === "location" ||
      route?.kind === "region" ||
      route?.id === "locations"
    )
      measure("location_view");
    const click = (event: MouseEvent) => {
      const a = (event.target as Element)?.closest?.("a");
      if (a?.href.startsWith("tel:")) measure("phone_click");
      if (a?.href.startsWith("mailto:")) measure("email_click");
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, [path, locale]);
  function choose(value: string) {
    try {
      sessionStorage.setItem("nr:measurement-consent", value);
    } catch {}
    setConsent(value);
  }
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true") return null;
  return (
    <section
      className="measurement-choice container"
      aria-label={
        locale === "fr" ? "Mesure facultative" : "Optional measurement"
      }
    >
      {consent === null ? (
        <>
          <p>
            {locale === "fr"
              ? "Autoriser la mesure facultative des interactions? Aucun renseignement saisi dans le formulaire n’est transmis."
              : "Allow optional interaction measurement? Nothing entered in the form is sent to analytics."}
          </p>
          <button type="button" onClick={() => choose("yes")}>
            {locale === "fr" ? "AUTORISER" : "ALLOW"}
          </button>
          <button type="button" onClick={() => choose("no")}>
            {locale === "fr" ? "REFUSER" : "DECLINE"}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => choose(consent === "yes" ? "no" : "yes")}
        >
          {locale === "fr"
            ? consent === "yes"
              ? "DÉSACTIVER LA MESURE"
              : "AUTORISER LA MESURE"
            : consent === "yes"
              ? "DISABLE MEASUREMENT"
              : "ALLOW MEASUREMENT"}
        </button>
      )}
    </section>
  );
}
