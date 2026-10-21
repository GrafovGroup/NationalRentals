"use client";
import { publishedIndustries } from "@/lib/industries";
import { publishedEquipment } from "@/lib/equipment";

import { measure } from "@/lib/measurement";
import {
  readDraft,
  saveDraft,
  clearDraft,
  privateAttribution,
} from "@/lib/draft";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { getEquipment } from "@/lib/equipment";
import { categories } from "@/lib/catalog";
import { regions } from "@/lib/locations";
import { type Locale } from "@/lib/config";
import { copy } from "@/lib/copy";
import { formCopy as t, quoteSchema } from "@/lib/quote";
import { pathFor, resolveRoute } from "@/lib/routes";
export function QuoteForm({
  locale,
  initialCategory = "",
  initialEquipment = "",
  sourceEquipment = "",
  initialIndustry = "",
  initialProducts,
  city = "",
  province = "",
}: {
  locale: Locale;
  initialCategory?: string;
  initialEquipment?: string;
  sourceEquipment?: string;
  initialIndustry?: string;
  initialProducts?: string[];
  city?: string;
  province?: string;
}) {
  const form = useRef<HTMLFormElement>(null);
  const started = useRef(false);
  const sourcePath = useRef("");
  const [notification, setNotification] = useState("");
  const [source, setSource] = useState(sourceEquipment);
  const [category, setCategory] = useState(initialCategory);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "error" | "failed" | "rate" | "success"
  >("idle");
  const [reference, setReference] = useState("");
  const requestId = useRef("");
  const previousPayload = useRef("");
  const summary = useRef<HTMLDivElement>(null);
  const f = locale;
  useEffect(() => {
    const draft = readDraft(locale);
    if (!form.current) return;
    if (!draft) {
      if (initialIndustry || initialProducts?.length)
        saveDraft(form.current, "", "", "");
      return;
    }
    const fields = { ...draft.fields };
    // Explicit equipment/location choices override only their own fields; entered contact/project details survive.
    if (initialCategory) fields.category = initialCategory;
    if (initialEquipment) fields.equipment = initialEquipment;
    if (initialIndustry) fields.industry = initialIndustry;
    if (initialProducts?.length) fields.products = initialProducts.join(",");
    if (city) fields.city = city;
    if (province) fields.province = province;
    queueMicrotask(() => {
      setCategory(fields.category || "");
      setSource(sourceEquipment || fields.sourceEquipment || "");
      for (const [name, value] of Object.entries(fields)) {
        const input = form.current?.elements.namedItem(name);
        if (input instanceof HTMLSelectElement && input.multiple) {
          const selected = String(value).split(",");
          for (const option of input.options)
            option.selected = selected.includes(option.value);
          continue;
        }
        if (
          input instanceof HTMLInputElement ||
          input instanceof HTMLTextAreaElement ||
          input instanceof HTMLSelectElement
        )
          if (input.type !== "hidden" && input.type !== "checkbox")
            input.value = String(value);
      }
    });
    requestId.current = draft.requestId || "";
    previousPayload.current = draft.payload || "";
    sourcePath.current = draft.sourcePath || "";
  }, [
    locale,
    initialCategory,
    initialIndustry,
    initialProducts,
    initialEquipment,
    city,
    province,
    sourceEquipment,
  ]);
  function remember() {
    if (form.current)
      saveDraft(
        form.current,
        requestId.current,
        previousPayload.current,
        sourcePath.current,
      );
  }
  function begin() {
    if (!started.current) {
      started.current = true;
      measure("quote_start");
    }
    if (!sourcePath.current) {
      try {
        const candidate = sessionStorage.getItem("nr:previous-path") || "";
        const [language, ...slug] = candidate.split("/").filter(Boolean);
        sourcePath.current =
          (language === "en" || language === "fr") &&
          resolveRoute(language, slug)
            ? candidate
            : window.location.pathname;
      } catch {
        sourcePath.current = window.location.pathname;
      }
    }
  }

  function show(next: typeof status) {
    setStatus(next);
    setTimeout(() => summary.current?.focus(), 0);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    const fields = {
      ...Object.fromEntries(data),
      products: data.getAll("products"),
      privacy: data.get("privacy") === "on",
      locale,
      sourcePath: sourcePath.current || window.location.pathname,
      attribution: privateAttribution(),
    };
    const payload = JSON.stringify(fields);
    if (payload !== previousPayload.current) {
      requestId.current = crypto.randomUUID();
      previousPayload.current = payload;
    }
    remember();
    const result = quoteSchema.safeParse({
      ...fields,
      requestId: requestId.current,
    });
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((i) => [
            String(i.path[0]),
            ["dateOrder", "pastDate"].includes(i.message)
              ? i.message
              : "invalid",
          ]),
        ),
      );
      measure("quote_submit_error");
      show("error");
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/quote/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
        signal: AbortSignal.timeout(20000),
      });
      const body = await response.json();
      if (response.ok && body.ok) {
        setReference(body.reference);
        setNotification(body.notification || "pending");
        clearDraft();
        measure("quote_submit_success");
        show("success");
      } else if (response.status === 400 && body.fields) {
        measure("quote_submit_error");
        setErrors(body.fields);
        show("error");
      } else {
        measure("quote_submit_error");
        show(response.status === 429 ? "rate" : "failed");
      }
    } catch {
      measure("quote_submit_error");
      show("failed");
    }
  }
  function errorFor(name: string) {
    const key = errors[name] as keyof typeof t;
    return errors[name] ? (
      <span className="field-error" id={`${name}-error`}>
        {(t[key] || t.invalid)[f]}
      </span>
    ) : null;
  }
  function input(
    name:
      | "name"
      | "company"
      | "email"
      | "phone"
      | "quantity"
      | "startDate"
      | "endDate"
      | "city",
    type = "text",
    autoComplete?: string,
  ) {
    return (
      <label className="field">
        {t[name][f]}{" "}
        {name === "startDate" || name === "endDate"
          ? `(${t.optional[f]})`
          : "*"}
        <input
          name={name}
          id={name}
          type={type}
          autoComplete={autoComplete}
          required={name !== "startDate" && name !== "endDate"}
          maxLength={type === "text" ? 160 : undefined}
          min={type === "number" ? 1 : undefined}
          max={type === "number" ? 10000 : undefined}
          defaultValue={
            name === "quantity" ? 1 : name === "city" ? city : undefined
          }
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errorFor(name)}
      </label>
    );
  }
  return (
    <form
      ref={form}
      onSubmit={submit}
      onFocus={begin}
      onChange={remember}
      noValidate
      className="quote-form"
    >
      <input
        type="hidden"
        name="sourceEquipment"
        value={getEquipment(source)?.categoryId === category ? source : ""}
      />
      <p className="form-note">{copy.required[f]}</p>
      {status !== "success" && (
        <p className="form-note">
          {t.draft[f]}{" "}
          <button
            type="button"
            className="text-link"
            onClick={() => {
              clearDraft();
              form.current?.reset();
              setCategory(initialCategory);
              setSource(sourceEquipment);
              setErrors({});
              setStatus("idle");
              requestId.current = "";
              previousPayload.current = "";
              sourcePath.current = "";
            }}
          >
            {t.clearDraft[f]}
          </button>
        </p>
      )}
      <div
        ref={summary}
        tabIndex={-1}
        role={status === "success" ? "status" : "alert"}
        className={
          ["error", "failed", "rate", "success"].includes(status)
            ? `form-message ${status}`
            : "sr-only"
        }
      >
        {["error", "failed", "rate", "success"].includes(status) &&
          t[status as "error" | "failed" | "rate" | "success"][f]}
        {status === "error" && (
          <ul>
            {Object.keys(errors)
              .filter((k) => k in t)
              .map((k) => (
                <li key={k}>
                  <a href={`#${k}`}>{t[k as keyof typeof t][f]}</a>
                </li>
              ))}
          </ul>
        )}
        {status === "success" && (
          <p>
            {t.reference[f]}: {reference}
            <br />
            {
              (notification === "sent"
                ? t.notificationSent
                : t.notificationPending)[f]
            }
          </p>
        )}
      </div>
      {status !== "success" && (
        <>
          <div className="form-grid">
            {input("name", "text", "name")}
            {input("company", "text", "organization")}
            {input("email", "email", "email")}
            {input("phone", "tel", "tel")}
            <label className="field">
              {t.industry[f]}
              <select
                name="industry"
                id="industry"
                defaultValue={initialIndustry}
                aria-invalid={!!errors.industry}
                aria-describedby={
                  errors.industry ? "industry-error" : undefined
                }
              >
                <option value="">{t.choose[f]}</option>
                {publishedIndustries.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.title[f]}
                  </option>
                ))}
              </select>
              {errorFor("industry")}
            </label>
            <label className="field">
              {t.products[f]}
              <select
                name="products"
                id="products"
                multiple
                size={4}
                defaultValue={initialProducts || []}
                aria-invalid={!!errors.products}
                aria-describedby={
                  errors.products
                    ? "products-help products-error"
                    : "products-help"
                }
              >
                {publishedEquipment.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name[f]}
                  </option>
                ))}
              </select>
              <span id="products-help" className="fine-print">
                {f === "fr"
                  ? "Sur ordinateur, maintenez Ctrl ou Commande pour plusieurs choix. Précisez les quantités par article et par site dans les détails du projet."
                  : "On desktop, hold Ctrl or Command to select multiple items. List quantities per item and per site in the project details."}
              </span>
              {errorFor("products")}
            </label>
            <label className="field">
              {t.category[f]} *
              <select
                name="category"
                id="category"
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSource("");
                }}
                aria-invalid={!!errors.category}
                aria-describedby={
                  errors.category ? "category-error" : undefined
                }
              >
                <option value="">{t.choose[f]}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[f]}
                  </option>
                ))}
              </select>
              {errorFor("category")}
            </label>
            <label className="field">
              {t.equipment[f]} *
              <input
                name="equipment"
                id="equipment"
                list="equipment-options"
                defaultValue={
                  category === initialCategory ? initialEquipment : ""
                }
                required
                maxLength={160}
                aria-invalid={!!errors.equipment}
                aria-describedby={
                  errors.equipment ? "equipment-error" : undefined
                }
              />
              <datalist id="equipment-options">
                {categories
                  .find((c) => c.id === category)
                  ?.equipment.map((e) => (
                    <option key={e.id} value={e.name[f]} />
                  ))}
              </datalist>
              {errorFor("equipment")}
            </label>
            {input("quantity", "number")}
            <label className="field">
              {t.delivery[f]} *
              <select
                name="delivery"
                id="delivery"
                required
                aria-invalid={!!errors.delivery}
                aria-describedby={
                  errors.delivery ? "delivery-error" : undefined
                }
              >
                <option value="discuss">{t.discussOption[f]}</option>
                <option value="delivery">{t.deliveryOption[f]}</option>
                <option value="pickup">{t.pickupOption[f]}</option>
              </select>
              {errorFor("delivery")}
            </label>
            {input("startDate", "date")}
            {input("endDate", "date")}
            {input("city", "text", "address-level2")}
            <label className="field">
              {t.province[f]} *
              <select
                name="province"
                id="province"
                defaultValue={province}
                required
                autoComplete="address-level1"
                aria-invalid={!!errors.province}
                aria-describedby={
                  errors.province ? "province-error" : undefined
                }
              >
                <option value="">{t.choose[f]}</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name[f]}
                  </option>
                ))}
              </select>
              {errorFor("province")}
            </label>
            <label className="field full">
              {t.details[f]} *
              <textarea
                name="details"
                id="details"
                rows={5}
                minLength={10}
                maxLength={5000}
                required
                aria-invalid={!!errors.details}
                aria-describedby={errors.details ? "details-error" : undefined}
              />
              {errorFor("details")}
            </label>
          </div>
          <div className="honeypot" aria-hidden="true">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              name="privacy"
              id="privacy"
              required
              aria-invalid={!!errors.privacy}
              aria-describedby={errors.privacy ? "privacy-error" : undefined}
            />
            <span>
              {t.privacy[f]}{" "}
              <Link href={pathFor(f, "privacy")}>{t.privacyLink[f]}</Link>
            </span>
          </label>
          {errorFor("privacy")}
          <button
            className="button"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? t.sending[f] : t.send[f]}{" "}
            <span aria-hidden="true">↗</span>
          </button>
          <p className="form-note">{copy.availability[f]}</p>
        </>
      )}
    </form>
  );
}
