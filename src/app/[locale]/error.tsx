"use client";
import { usePathname } from "next/navigation";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const fr = usePathname().startsWith("/fr/");
  return (
    <section className="section container">
      <h1>
        {fr
          ? "La page n’a pas pu être chargée."
          : "The page could not be loaded."}
      </h1>
      <p>
        {fr
          ? "Veuillez réessayer ou écrire à info@nationalrentals.ca."
          : "Please try again or email info@nationalrentals.ca."}
      </p>
      <button className="button" onClick={reset}>
        {fr ? "RÉESSAYER" : "TRY AGAIN"}
      </button>
    </section>
  );
}
