import { b, type Localized } from "./config";
export const regions: { code: string; name: Localized; cities: Localized[] }[] =
  [
    {
      code: "AB",
      name: b("Alberta", "Alberta"),
      cities: [
        b("Calgary", "Calgary"),
        b("Edmonton", "Edmonton"),
        b("Red Deer", "Red Deer"),
      ],
    },
    {
      code: "BC",
      name: b("British Columbia", "Colombie-Britannique"),
      cities: [
        b("Vancouver", "Vancouver"),
        b("Victoria", "Victoria"),
        b("Kelowna", "Kelowna"),
      ],
    },
    {
      code: "MB",
      name: b("Manitoba", "Manitoba"),
      cities: [b("Winnipeg", "Winnipeg"), b("Brandon", "Brandon")],
    },
    {
      code: "NB",
      name: b("New Brunswick", "Nouveau-Brunswick"),
      cities: [
        b("Moncton", "Moncton"),
        b("Fredericton", "Fredericton"),
        b("Saint John", "Saint John"),
      ],
    },
    {
      code: "NL",
      name: b("Newfoundland and Labrador", "Terre-Neuve-et-Labrador"),
      cities: [
        b("St. John’s", "St. John’s"),
        b("Corner Brook", "Corner Brook"),
      ],
    },
    {
      code: "NS",
      name: b("Nova Scotia", "Nouvelle-Écosse"),
      cities: [b("Halifax", "Halifax"), b("Sydney", "Sydney")],
    },
    {
      code: "ON",
      name: b("Ontario", "Ontario"),
      cities: [
        b("Toronto", "Toronto"),
        b("Ottawa", "Ottawa"),
        b("Hamilton", "Hamilton"),
        b("London", "London"),
        b("Kitchener", "Kitchener"),
        b("Windsor", "Windsor"),
      ],
    },
    {
      code: "PE",
      name: b("Prince Edward Island", "Île-du-Prince-Édouard"),
      cities: [
        b("Charlottetown", "Charlottetown"),
        b("Summerside", "Summerside"),
      ],
    },
    {
      code: "QC",
      name: b("Québec", "Québec"),
      cities: [
        b("Montréal", "Montréal"),
        b("Québec City", "Québec"),
        b("Gatineau", "Gatineau"),
        b("Sherbrooke", "Sherbrooke"),
        b("Trois-Rivières", "Trois-Rivières"),
      ],
    },
    {
      code: "SK",
      name: b("Saskatchewan", "Saskatchewan"),
      cities: [b("Saskatoon", "Saskatoon"), b("Regina", "Regina")],
    },
    {
      code: "NT",
      name: b("Northwest Territories", "Territoires du Nord-Ouest"),
      cities: [b("Yellowknife", "Yellowknife")],
    },
    {
      code: "NU",
      name: b("Nunavut", "Nunavut"),
      cities: [b("Iqaluit", "Iqaluit")],
    },
    {
      code: "YT",
      name: b("Yukon", "Yukon"),
      cities: [b("Whitehorse", "Whitehorse")],
    },
  ];
export const locations = [
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
