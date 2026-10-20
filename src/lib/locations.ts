import regionContent from "./region-content.json";
import metroContent from "./metro-content.json";
import { b, type Localized } from "./config";
const baseRegions: { code: RegionCode; name: Localized }[] = [
  { code: "AB", name: b("Alberta", "Alberta") },
  { code: "BC", name: b("British Columbia", "Colombie-Britannique") },
  { code: "MB", name: b("Manitoba", "Manitoba") },
  { code: "NB", name: b("New Brunswick", "Nouveau-Brunswick") },
  {
    code: "NL",
    name: b("Newfoundland and Labrador", "Terre-Neuve-et-Labrador"),
  },
  { code: "NS", name: b("Nova Scotia", "Nouvelle-Écosse") },
  { code: "ON", name: b("Ontario", "Ontario") },
  { code: "PE", name: b("Prince Edward Island", "Île-du-Prince-Édouard") },
  { code: "QC", name: b("Québec", "Québec") },
  { code: "SK", name: b("Saskatchewan", "Saskatchewan") },
  { code: "NT", name: b("Northwest Territories", "Territoires du Nord-Ouest") },
  { code: "NU", name: b("Nunavut", "Nunavut") },
  { code: "YT", name: b("Yukon", "Yukon") },
];
const existingLocations = [
  {
    id: "toronto",
    slug: b("toronto-gta", "toronto-grand-toronto"),
    name: b("Toronto & the GTA", "Toronto et le Grand Toronto"),
    region: "ON",
    metro: b("Greater Toronto Area", "Région du Grand Toronto"),
    municipalities: [
      "Toronto",
      "Mississauga",
      "Brampton",
      "Vaughan",
      "Markham",
      "Richmond Hill",
      "Oakville",
      "Burlington",
      "Milton",
      "Ajax",
      "Pickering",
      "Whitby",
      "Oshawa",
      "Newmarket",
      "Aurora",
    ],
    description: b(
      "Coordinate equipment for construction, facilities and commercial projects across the Greater Toronto Area. Identify each delivery municipality and site entrance; a downtown loading dock and an industrial yard need different delivery plans.",
      "Coordonnez l’équipement pour vos projets de construction, de gestion immobilière et d’exploitation commerciale dans le Grand Toronto. Précisez chaque municipalité et l’entrée du site : un quai de livraison au centre-ville et une cour industrielle demandent des plans différents.",
    ),
    considerations: [
      b(
        "For dense urban sites, provide loading hours, height restrictions and unloading space.",
        "Pour les sites urbains denses, précisez les heures de livraison, les limites de hauteur et l’espace de déchargement.",
      ),
      b(
        "For projects across the GTA, list separate addresses, site contacts and delivery windows.",
        "Pour les projets répartis dans le Grand Toronto, indiquez chaque adresse, personne-ressource et plage de livraison.",
      ),
      b(
        "Confirm electrical capacity and indoor emissions requirements for occupied buildings.",
        "Confirmez la capacité électrique et les exigences d’émissions à l’intérieur des bâtiments occupés.",
      ),
    ],
  },
  {
    id: "montreal",
    slug: b("montreal", "montreal"),
    name: b("Montréal & surrounding areas", "Montréal et les environs"),
    region: "QC",
    metro: b("Greater Montréal", "Grand Montréal"),
    municipalities: [
      "Montréal",
      "Laval",
      "Longueuil",
      "Brossard",
      "Terrebonne",
      "Repentigny",
      "Saint-Jérôme",
      "Boucherville",
      "Saint-Jean-sur-Richelieu",
    ],
    description: b(
      "Plan commercial rental requirements in Montréal, Laval and the South Shore. Share the site’s preferred working language, borough or municipality and access constraints so the request includes the details needed for regional coordination.",
      "Planifiez vos besoins de location commerciale à Montréal, à Laval et sur la Rive-Sud. Précisez la langue de travail souhaitée, l’arrondissement ou la municipalité et les contraintes d’accès pour faciliter la coordination régionale.",
    ),
    considerations: [
      b(
        "Identify the borough and confirm any curbside placement or temporary occupancy permissions with the relevant authority.",
        "Indiquez l’arrondissement et confirmez les autorisations de placement en bordure de rue ou d’occupation temporaire auprès de l’autorité concernée.",
      ),
      b(
        "Include bridge crossings and separate delivery windows when planning multiple sites.",
        "Tenez compte des traversées de ponts et des plages de livraison propres à chaque site.",
      ),
      b(
        "For winter work, specify enclosure, heating and snow-clearing arrangements.",
        "Pour les travaux hivernaux, précisez les abris, le chauffage et les dispositions de déneigement.",
      ),
    ],
  },
  {
    id: "vancouver",
    slug: b(
      "vancouver-lower-mainland",
      "vancouver-basses-terres-continentales",
    ),
    name: b(
      "Vancouver & the Lower Mainland",
      "Vancouver et les basses-terres continentales",
    ),
    region: "BC",
    metro: b("Metro Vancouver", "Grand Vancouver"),
    municipalities: [
      "Vancouver",
      "Burnaby",
      "Richmond",
      "Surrey",
      "Coquitlam",
      "Delta",
      "Langley",
      "North Vancouver",
    ],
    description: b(
      "Plan rentals for commercial sites across Vancouver and nearby municipalities. Provide grade, access and weather-exposure details for outdoor equipment, and identify whether delivery is to a street-level yard, loading dock or restricted site.",
      "Planifiez vos locations pour des sites commerciaux à Vancouver et dans les municipalités voisines. Précisez les pentes, les accès et l’exposition aux intempéries pour l’équipement extérieur, ainsi que le type de point de livraison : cour, quai ou site à accès restreint.",
    ),
    considerations: [
      b(
        "Describe drainage, ground bearing conditions and rain protection for outdoor work.",
        "Décrivez le drainage, la portance du sol et la protection contre la pluie pour les travaux extérieurs.",
      ),
      b(
        "Identify slopes and clearance limits before requesting aerial or handling equipment.",
        "Indiquez les pentes et les limites de dégagement avant de demander de l’équipement d’élévation ou de manutention.",
      ),
      b(
        "Island or remote destinations need separate transport and schedule review.",
        "Les destinations insulaires ou éloignées nécessitent une évaluation distincte du transport et de l’échéancier.",
      ),
    ],
  },
];

export type RegionCode = keyof typeof regionContent;
export const regions = baseRegions.map((r) => ({
  ...r,
  code: r.code as RegionCode,
  ...regionContent[r.code as RegionCode],
}));
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const locations = [
  ...existingLocations.map((l) => ({
    ...l,
    members: l.municipalities.map((name) => ({
      id: l.region.toLowerCase() + "-" + slugify(name),
      name: b(name, name),
      region: l.region as RegionCode,
    })),
  })),
  ...metroContent,
];
export type Market = {
  id: string;
  name: Localized;
  region: RegionCode;
  metroId?: string;
};
export const markets: Market[] = [];
for (const region of regions) {
  const names = [...region.cities];
  for (const metro of locations) {
    for (const member of metro.members) {
      if (
        member.region === region.code &&
        !names.some((n) => n.en === member.name.en)
      )
        names.push(member.name);
    }
  }
  for (const name of names) {
    const marketId = region.code.toLowerCase() + "-" + slugify(name.en);
    const metro = locations.find((m) =>
      m.members.some((member) => member.id === marketId),
    );
    markets.push({
      id: marketId,
      name,
      region: region.code,
      metroId: metro?.id,
    });
  }
}
export function geographicPrefill(
  locale: import("./config").Locale,
  query: Record<string, string | string[] | undefined>,
) {
  const market = markets.find((m) => m.id === query.market);
  const metro = locations.find((m) => m.id === query.location);
  const region = regions.find((r) => r.code === query.province);
  return {
    city:
      market?.name[locale] ||
      (metro
        ? markets.find((m) => m.metroId === metro.id)?.name[locale]
        : "") ||
      "",
    province: market?.region || metro?.region || region?.code || "",
  };
}
// Explicit publication registry: add only reviewed, distinct bilingual combinations.
export type LocalizedCategoryPage = {
  id: string;
  locationId: string;
  categoryId: string;
  description: Localized;
  planning: Localized;
};
export const localizedCategoryPages: LocalizedCategoryPage[] = [];

// Commercial discovery groupings, not assertions of census boundaries or branches.
export const metropolitanAreas = [
  ...locations.map((l) => ({
    id: l.id,
    regionCodes: [...new Set(l.members.map((m) => m.region))],
    municipalities: l.municipalities,
    pageId: l.id,
  })),
  ...[
    ["london", "ON", "London|St. Thomas"],
    [
      "niagara",
      "ON",
      "Niagara Falls|St. Catharines|Welland|Niagara-on-the-Lake",
    ],
    ["barrie", "ON", "Barrie|Innisfil|Orillia"],
    ["kingston", "ON", "Kingston|Loyalist"],
    ["windsor", "ON", "Windsor|Tecumseh|LaSalle"],
    ["regina", "SK", "Regina|White City|Emerald Park"],
    ["saskatoon", "SK", "Saskatoon|Warman|Martensville"],
    ["moncton", "NB", "Moncton|Dieppe|Riverview"],
    ["fredericton", "NB", "Fredericton|Oromocto"],
    ["saint-john", "NB", "Saint John|Quispamsis|Rothesay"],
    ["charlottetown", "PE", "Charlottetown|Stratford|Cornwall"],
    ["st-johns", "NL", "St. John’s|Mount Pearl|Paradise"],
    ["kelowna", "BC", "Kelowna|West Kelowna|Lake Country"],
    ["kamloops", "BC", "Kamloops"],
    ["prince-george", "BC", "Prince George"],
    ["whitehorse", "YT", "Whitehorse"],
    ["yellowknife", "NT", "Yellowknife"],
    ["iqaluit", "NU", "Iqaluit"],
  ].map(([id, region, names]) => ({
    id,
    regionCodes: [region],
    municipalities: names.split("|"),
    pageId: undefined,
  })),
];
for (const area of metropolitanAreas.filter((a) => !a.pageId)) {
  for (const name of area.municipalities) {
    const region = area.regionCodes[0] as RegionCode;
    if (!markets.some((m) => m.region === region && m.name.en === name))
      markets.push({
        id: region.toLowerCase() + "-" + slugify(name),
        name: b(name, name),
        region,
      });
  }
}
