import { getIndustry } from "./industries";
import { z } from "zod";
import { getEquipment } from "./equipment";
import { categories } from "./catalog";
import { regions } from "./locations";
import { resolveRoute } from "./routes";
import { b } from "./config";
const short = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .refine((v) => !/[\u0000-\u001f\u007f]/.test(v));
const optionalDate = z.union([z.iso.date(), z.literal("")]).default("");
export const quoteSchema = z
  .object({
    locale: z.enum(["en", "fr"]),
    requestId: z.uuid(),
    name: short,
    company: short,
    email: z.email().max(254),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(40)
      .regex(/^[+\d\s().x-]+$/)
      .refine((value) => value.replace(/\D/g, "").length >= 7),
    category: z.string().refine((v) => categories.some((c) => c.id === v)),
    equipment: short,
    sourceEquipment: z
      .string()
      .max(100)
      .default("")
      .refine((v) => !v || !!getEquipment(v)),
    industry: z
      .string()
      .max(80)
      .default("")
      .refine((v) => !v || !!getIndustry(v)),
    products: z
      .array(
        z
          .string()
          .max(100)
          .refine((v) => !!getEquipment(v)),
      )
      .max(8)
      .default([])
      .refine((v) => new Set(v).size === v.length),
    quantity: z.coerce.number().int().min(1).max(10000),
    startDate: optionalDate,
    endDate: optionalDate,
    sourcePath: z
      .string()
      .max(300)
      .default("")
      .refine(
        (v) =>
          !v ||
          (/^(\/en\/|\/fr\/)/.test(v) &&
            !!resolveRoute(
              v.startsWith("/fr/") ? "fr" : "en",
              v.split("/").filter(Boolean).slice(1),
            )),
      ),
    attribution: z
      .object({
        utm_source: z.string().max(200).optional(),
        utm_medium: z.string().max(200).optional(),
        utm_campaign: z.string().max(200).optional(),
        utm_term: z.string().max(200).optional(),
        utm_content: z.string().max(200).optional(),
        referrer: z.string().max(300).optional(),
      })
      .strict()
      .default({}),
    city: short,
    province: z.string().refine((v) => regions.some((r) => r.code === v)),
    delivery: z.enum(["delivery", "pickup", "discuss"]),
    details: z.string().trim().min(10).max(5000),
    privacy: z.literal(true),
    website: z.string().max(0),
  })
  .superRefine((v, ctx) => {
    if (
      v.sourceEquipment &&
      getEquipment(v.sourceEquipment)?.categoryId !== v.category
    )
      ctx.addIssue({
        code: "custom",
        path: ["sourceEquipment"],
        message: "invalid",
      });
    if (v.startDate && v.endDate && v.endDate < v.startDate)
      ctx.addIssue({ code: "custom", path: ["endDate"], message: "dateOrder" });
    // Business dates use the configured Canadian operating timezone, not UTC midnight.
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    if (v.startDate && v.startDate < today)
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "pastDate",
      });
  });
export type Quote = z.infer<typeof quoteSchema>;
export const formCopy = {
  industry: b("Industry (optional)", "Secteur (facultatif)"),
  products: b(
    "Additional equipment (up to 8 selections)",
    "Équipement du projet (jusqu’à 8 choix)",
  ),
  name: b("Full name", "Nom complet"),
  company: b("Company", "Entreprise"),
  email: b("Email", "Courriel"),
  phone: b("Phone", "Téléphone"),
  category: b("Rental category", "Catégorie de location"),
  equipment: b("Equipment or requirement", "Équipement ou besoin"),
  quantity: b("Quantity", "Quantité"),
  startDate: b("Start date", "Date de début"),
  endDate: b("End date", "Date de fin"),
  city: b("Delivery / project city", "Ville de livraison / du projet"),
  province: b("Province or territory", "Province ou territoire"),
  delivery: b("Delivery needs", "Besoins de livraison"),
  details: b("Project details", "Détails du projet"),
  privacy: b(
    "I have read the privacy notice and agree that my information may be used to respond to this request.",
    "J’ai lu l’avis de confidentialité et j’accepte que mes renseignements soient utilisés pour répondre à cette demande.",
  ),
  choose: b("Select an option", "Choisissez une option"),
  deliveryOption: b("Delivery requested", "Livraison demandée"),
  pickupOption: b(
    "Pickup preferred, if available",
    "Ramassage souhaité, si possible",
  ),
  discussOption: b("Please discuss with me", "À discuter avec moi"),
  send: b("Send quote request", "Envoyer la demande"),
  sending: b("Sending…", "Envoi en cours…"),
  error: b(
    "Please check the highlighted fields.",
    "Veuillez vérifier les champs indiqués.",
  ),
  invalid: b(
    "Please enter a valid value.",
    "Veuillez saisir une valeur valide.",
  ),
  dateOrder: b(
    "The end date must be on or after the start date.",
    "La date de fin doit être égale ou postérieure à la date de début.",
  ),
  pastDate: b(
    "Choose today or a future date.",
    "Choisissez la date d’aujourd’hui ou une date ultérieure.",
  ),
  failed: b(
    "Your request could not be sent. Your details remain in the form. Please try again, or email info@nationalrentals.ca.",
    "Votre demande n’a pas pu être envoyée. Vos renseignements sont conservés dans le formulaire. Réessayez ou écrivez à info@nationalrentals.ca.",
  ),
  rate: b(
    "Too many attempts. Please wait 15 minutes or email info@nationalrentals.ca.",
    "Trop de tentatives. Veuillez attendre 15 minutes ou écrire à info@nationalrentals.ca.",
  ),
  success: b(
    "Thank you. Your request has been saved for review. This is not a booking confirmation.",
    "Merci. Votre demande a été enregistrée pour évaluation. Ceci n’est pas une confirmation de réservation.",
  ),
  notificationSent: b(
    "The inquiry team has been notified.",
    "L’équipe responsable des demandes a été avisée.",
  ),
  notificationPending: b(
    "Your request is retained. The email notification has not yet been confirmed.",
    "Votre demande est conservée. L’avis par courriel n’a pas encore été confirmé.",
  ),
  draft: b(
    "Your draft stays in this browser tab for up to 30 minutes. Clear it on a shared device.",
    "Votre brouillon reste dans cet onglet pendant au plus 30 minutes. Effacez-le sur un appareil partagé.",
  ),
  clearDraft: b("Clear draft", "Effacer le brouillon"),
  optional: b("optional", "facultatif"),
  reference: b("Request reference", "Référence de la demande"),
  privacyLink: b("Read the privacy notice", "Lire l’avis de confidentialité"),
};
