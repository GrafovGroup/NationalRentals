import { categories } from "./catalog";
import { b, type Locale, type Localized } from "./config";
import content from "./equipment-content.json";

export type Subcategory = {
  id: string;
  categoryId: string;
  name: Localized;
  slug: Localized;
  description: Localized;
  delivery: Localized;
  industryIds: string[];
};
const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const subgroup = (
  id: string,
  categoryId: string,
  en: string,
  fr: string,
  delivery: Localized,
  industryIds: string[],
): Subcategory => ({
  id,
  categoryId,
  name: b(en, fr),
  slug: b(slugify(en), slugify(fr)),
  description: delivery,
  delivery,
  industryIds,
});
const heavy = b(
  "Include unloading space, ground support and access restrictions in the delivery brief. Allow for mobilisation, the working period and collection; transport and rental dates are agreed in the quote.",
  "Précisez l’aire de déchargement, la portance et les restrictions d’accès. Prévoyez la mobilisation, les travaux et le ramassage; le transport et les dates sont convenus dans la soumission.",
);
const connected = b(
  "Identify connection points, cable or hose routes and responsibility for setup. Include installation, operating hours and removal when requesting dates; commissioning requirements depend on the application.",
  "Indiquez raccordements, parcours des câbles ou tuyaux et responsabilités d’installation. Incluez montage, heures d’utilisation et retrait dans les dates; la mise en service dépend de l’usage.",
);
const installed = b(
  "Provide a placement plan, access window and site contact. Request dates that include installation and removal, and identify any servicing or utility connections needed during the rental.",
  "Fournissez plan d’implantation, plage d’accès et contact sur place. Incluez installation et retrait dans les dates, ainsi que l’entretien ou les raccordements nécessaires pendant la location.",
);
const portable = b(
  "Include building access, unloading arrangements and the handover contact. State the first working day and return date, allowing time for setup, familiarisation and cleaning where required.",
  "Précisez accès au bâtiment, déchargement et contact de remise. Indiquez première journée d’utilisation et retour, avec du temps pour installation, familiarisation et nettoyage selon le besoin.",
);
const transport = b(
  "Specify collection and return locations, travel dates and expected distance. Driver eligibility, insurance, towing compatibility where applicable and permitted use are reviewed in the rental terms.",
  "Précisez lieux de prise en charge et retour, dates et distance prévue. Admissibilité du conducteur, assurance, compatibilité de remorquage et usage permis sont évalués dans les conditions.",
);
export const subcategories: Subcategory[] = [
  subgroup(
    "earthmoving",
    "construction",
    "Earthmoving",
    "Terrassement",
    heavy,
    ["construction"],
  ),
  subgroup(
    "concrete-ground",
    "construction",
    "Concrete & compaction",
    "Béton et compactage",
    heavy,
    ["construction"],
  ),
  subgroup(
    "platforms",
    "aerial",
    "Work platforms",
    "Plateformes de travail",
    heavy,
    ["construction", "cleaning"],
  ),
  subgroup("handling", "aerial", "Material handling", "Manutention", heavy, [
    "construction",
    "vehicles",
  ]),
  subgroup(
    "power-air",
    "power",
    "Power & compressed air",
    "Énergie et air comprimé",
    connected,
    ["power", "construction"],
  ),
  subgroup(
    "water-climate",
    "power",
    "Water & climate",
    "Eau et contrôle ambiant",
    connected,
    ["power", "cleaning"],
  ),
  subgroup(
    "workspaces",
    "infrastructure",
    "Workspaces & storage",
    "Espaces de travail et entreposage",
    installed,
    ["infrastructure", "construction"],
  ),
  subgroup(
    "site-services",
    "infrastructure",
    "Site services",
    "Services de chantier",
    installed,
    ["infrastructure", "construction"],
  ),
  subgroup(
    "transport",
    "vehicles",
    "Commercial vehicles",
    "Véhicules commerciaux",
    transport,
    ["vehicles"],
  ),
  subgroup("trailers", "vehicles", "Trailers", "Remorques", transport, [
    "vehicles",
    "construction",
  ]),
  subgroup(
    "devices",
    "technology",
    "Computing devices",
    "Appareils informatiques",
    portable,
    ["vehicles", "infrastructure"],
  ),
  subgroup(
    "displays",
    "technology",
    "Displays & presentation",
    "Affichage et présentation",
    connected,
    ["events", "infrastructure"],
  ),
  subgroup(
    "floor-care",
    "cleaning",
    "Floor care",
    "Entretien des planchers",
    portable,
    ["cleaning", "power"],
  ),
  subgroup(
    "restoration",
    "cleaning",
    "Restoration & drying",
    "Restauration et séchage",
    connected,
    ["cleaning"],
  ),
  subgroup(
    "grounds",
    "landscaping",
    "Grounds maintenance",
    "Entretien des terrains",
    portable,
    ["cleaning"],
  ),
  subgroup(
    "vegetation",
    "landscaping",
    "Vegetation management",
    "Gestion de la végétation",
    heavy,
    ["cleaning", "construction"],
  ),
  subgroup(
    "traffic",
    "safety",
    "Traffic management",
    "Gestion de la circulation",
    installed,
    ["construction", "infrastructure"],
  ),
  subgroup(
    "crossings",
    "safety",
    "Temporary crossings",
    "Franchissements temporaires",
    heavy,
    ["construction", "infrastructure"],
  ),
  subgroup(
    "surface-tools",
    "specialty",
    "Surface preparation",
    "Préparation de surfaces",
    portable,
    ["construction", "power"],
  ),
  subgroup(
    "trade-tools",
    "specialty",
    "Specialist trade tools",
    "Outils spécialisés",
    portable,
    ["power", "construction"],
  ),
  subgroup(
    "crowd",
    "events",
    "Pedestrian flow",
    "Circulation piétonne",
    installed,
    ["events"],
  ),
  subgroup(
    "surfaces-furnishings",
    "events",
    "Surfaces & furnishings",
    "Surfaces et mobilier",
    installed,
    ["events"],
  ),
];
type Detail = {
  published: boolean;
  images: Partial<Record<Locale, { src: string; alt: string; source: string }>>;
  subcategoryId: string;
  slug: Localized;
  overview: Localized;
  applications: Localized[];
  selection: Localized;
  specificationFields: Localized[];
};
export type EquipmentItem = Detail & {
  id: string;
  categoryId: string;
  name: Localized;
  status: "published" | "draft";
  delivery: Localized;
  industryIds: string[];
  relatedIds: string[];
  seo: { title: Localized; description: Localized };
  inquiry: { category: string; equipment: string };
};
const details: Record<string, Detail> = content;
// Existing category IDs and equipment IDs remain the authoritative taxonomy.
// Custom inquiries stay in the quote form, without a thin indexable product page.
export const equipmentItems: EquipmentItem[] = categories.flatMap((category) =>
  category.equipment
    .filter((item) => item.id in details)
    .map((item) => {
      const detail = details[item.id];
      const group = subcategories.find(
        (s) => s.id === detail.subcategoryId && s.categoryId === category.id,
      );
      if (!group) throw new Error("Missing subcategory for " + item.id);
      return {
        ...item,
        ...detail,
        categoryId: category.id,
        status: detail.published ? ("published" as const) : ("draft" as const),
        delivery: group.delivery,
        industryIds: group.industryIds,
        relatedIds: category.equipment
          .filter((e) => e.id !== item.id && details[e.id]?.published)
          .slice(0, 3)
          .map((e) => e.id),
        seo: {
          title: b(item.name.en + " rental", "Location : " + item.name.fr),
          description: detail.overview,
        },
        inquiry: { category: category.id, equipment: item.id },
      };
    }),
);
export const publishedEquipment = equipmentItems.filter(
  (e) => e.status === "published",
);
export const getEquipment = (id: string) =>
  publishedEquipment.find((e) => e.id === id);
export type CatalogFilters = {
  keyword?: string;
  category?: string;
  subcategory?: string;
  industry?: string;
};
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
export function filterEquipment(
  filters: CatalogFilters,
  locale: Locale,
  items = publishedEquipment,
) {
  const tokens = normalizeSearch(filters.keyword || "")
    .split(" ")
    .filter(Boolean);
  return items.filter((item) => {
    if (item.status !== "published") return false;
    if (filters.category && item.categoryId !== filters.category) return false;
    if (filters.subcategory && item.subcategoryId !== filters.subcategory)
      return false;
    if (filters.industry && !item.industryIds.includes(filters.industry))
      return false;
    const text = normalizeSearch(
      [
        item.name[locale],
        item.overview[locale],
        ...item.applications.map((a) => a[locale]),
        categories.find((c) => c.id === item.categoryId)?.name[locale],
        subcategories.find((s) => s.id === item.subcategoryId)?.name[locale],
      ].join(" "),
    );
    return tokens.every((token) => text.includes(token));
  });
}
