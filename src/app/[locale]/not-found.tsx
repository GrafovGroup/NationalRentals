"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function NotFound() {
  const fr = usePathname().startsWith("/fr/");
  return (
    <section className="section container">
      <p className="eyebrow">404</p>
      <h1>{fr ? "Page introuvable" : "Page not found"}</h1>
      <p>
        {fr
          ? "Cette adresse ne correspond pas à une page. Retrouvez nos catégories de location à partir de l’accueil."
          : "This address does not match a page. Explore our rental categories from the homepage."}
      </p>
      <Link className="button" href={fr ? "/fr/" : "/en/"}>
        {fr ? "RETOUR À L’ACCUEIL" : "BACK TO HOME"} ↗
      </Link>
    </section>
  );
}
