import { b, type Localized } from "./config";
export type Equipment = { id: string; name: Localized };
export type Category = {
  id: string;
  slug: Localized;
  name: Localized;
  description: Localized;
  planning: Localized;
  equipment: Equipment[];
};
const items = (values: [string, string, string][]): Equipment[] =>
  values.map(([id, en, fr]) => ({ id, name: b(en, fr) }));
export const categories: Category[] = [
  {
    id: "construction",
    slug: b("construction-earthmoving", "construction-terrassement"),
    name: b("Construction & earthmoving", "Construction et terrassement"),
    description: b(
      "Prepare the site. Shape what comes next. Coordinate excavation, earthmoving and concrete equipment around your ground conditions, working area and project schedule. From a tight-access renovation to a larger civil project, start with the job requirements.",
      "Préparez le terrain pour la suite. Coordonnez l’équipement d’excavation, de terrassement et de bétonnage selon le sol, l’espace de travail et l’échéancier. Qu’il s’agisse d’une rénovation à accès restreint ou d’un chantier de génie civil, partons des exigences du projet.",
    ),
    planning: b(
      "Include digging depth, soil type, access width and attachment needs. Delivery access, underground services and operator requirements must be assessed before work begins.",
      "Indiquez la profondeur d’excavation, le type de sol, la largeur des accès et les accessoires requis. Les accès de livraison, les services souterrains et les exigences pour les opérateurs doivent être évalués avant les travaux.",
    ),
    equipment: items([
      ["excavator", "Excavators", "Excavatrices"],
      ["skid-steer", "Skid steers", "Chargeuses compactes"],
      ["compactor", "Compactors", "Compacteurs"],
      ["loader", "Loaders", "Chargeuses"],
      ["trencher", "Trenchers", "Trancheuses"],
      ["concrete", "Concrete equipment", "Équipement de bétonnage"],
    ]),
  },
  {
    id: "aerial",
    slug: b("aerial-access-handling", "elevation-manutention"),
    name: b("Aerial access & handling", "Élévation et manutention"),
    description: b(
      "Bring the task within reach. Plan overhead installation, building maintenance and material movement with equipment suited to your working height, platform capacity and operating surface. Share the site constraints so we can review suitable options.",
      "Mettez vos travaux à portée. Planifiez les installations en hauteur, l’entretien de bâtiments et la manutention avec de l’équipement adapté à la hauteur de travail, à la capacité de la plateforme et au sol. Précisez les contraintes pour nous aider à évaluer les options.",
    ),
    planning: b(
      "Specify indoor or outdoor use, load weight, reach and floor limits. Appropriate training, site assessment and safe operating procedures remain essential.",
      "Précisez l’usage intérieur ou extérieur, le poids des charges, la portée et les limites du plancher. Une formation appropriée, une évaluation du site et des méthodes de travail sécuritaires demeurent essentielles.",
    ),
    equipment: items([
      ["scissor", "Scissor lifts", "Plateformes élévatrices à ciseaux"],
      ["boom", "Boom lifts", "Nacelles articulées"],
      ["telehandler", "Telehandlers", "Chariots télescopiques"],
      ["forklift", "Forklifts", "Chariots élévateurs"],
      ["material-lift", "Material lifts", "Monte-matériaux"],
    ]),
  },
  {
    id: "power",
    slug: b("industrial-power", "industrie-energie"),
    name: b("Industrial & power", "Industrie et énergie"),
    description: b(
      "Keep your project moving with temporary power, compressed air, water management and climate control. Equipment selection starts with the application: a construction site, a facility shutdown or an additional work area each has different technical needs.",
      "Gardez vos activités en marche grâce à l’alimentation temporaire, à l’air comprimé, à la gestion de l’eau et au contrôle de la température. Le choix dépend de l’utilisation : un chantier, un arrêt d’usine et un espace de travail supplémentaire ont des besoins techniques différents.",
    ),
    planning: b(
      "Provide voltage, phase, running and starting loads, hose lengths or area dimensions. Fuel, ventilation, noise and connection requirements affect equipment selection.",
      "Fournissez la tension, le nombre de phases, les charges de fonctionnement et de démarrage, les longueurs de tuyaux ou les dimensions. Le carburant, la ventilation, le bruit et les raccordements influencent le choix.",
    ),
    equipment: items([
      ["generator", "Generators", "Génératrices"],
      ["compressor", "Compressors", "Compresseurs"],
      ["pump", "Pumps", "Pompes"],
      ["light-tower", "Light towers", "Tours d’éclairage"],
      [
        "climate",
        "Temporary heating & cooling",
        "Chauffage et climatisation temporaires",
      ],
    ]),
  },
  {
    id: "infrastructure",
    slug: b("temporary-infrastructure", "infrastructures-temporaires"),
    name: b("Temporary infrastructure", "Infrastructures temporaires"),
    description: b(
      "Make room for the people and equipment behind the project. Plan temporary workspaces, storage and site facilities around the available footprint, expected headcount and servicing requirements. Include installation and removal in your schedule.",
      "Faites de la place aux équipes et à l’équipement. Planifiez les espaces de travail temporaires, l’entreposage et les installations selon la superficie disponible, le nombre de personnes et les besoins d’entretien. Prévoyez l’installation et le retrait dans votre échéancier.",
    ),
    planning: b(
      "Share site drawings, expected headcount, servicing frequency and utility access. Placement, ground support and local permit requirements should be confirmed for your location.",
      "Transmettez les plans, le nombre de personnes prévu, la fréquence d’entretien et l’accès aux services. L’emplacement, la portance du sol et les permis locaux doivent être confirmés selon le lieu.",
    ),
    equipment: items([
      ["office", "Office trailers", "Roulottes de chantier"],
      ["container", "Storage containers", "Conteneurs d’entreposage"],
      ["toilet", "Portable toilets", "Toilettes mobiles"],
      ["wash", "Handwashing stations", "Stations de lavage des mains"],
      ["fence", "Temporary fencing", "Clôtures temporaires"],
      ["shelter", "Shelters", "Abris"],
    ]),
  },
  {
    id: "vehicles",
    slug: b("commercial-vehicles-trailers", "vehicules-remorques"),
    name: b(
      "Commercial vehicles & trailers",
      "Véhicules commerciaux et remorques",
    ),
    description: b(
      "Move what your business needs. Tell us the cargo, route and rental period so your request can be reviewed against payload, dimensions and operating requirements. Refrigerated transport and towing applications need additional specifications.",
      "Transportez ce dont votre entreprise a besoin. Précisez le chargement, le trajet et la durée afin d’évaluer la demande selon la charge utile, les dimensions et les conditions d’utilisation. Le transport réfrigéré et le remorquage demandent des précisions supplémentaires.",
    ),
    planning: b(
      "Provide cargo dimensions, payload, temperature requirements and towing details. Driver eligibility, insurance, mileage and permitted use are confirmed in the rental terms.",
      "Indiquez les dimensions, la charge utile, les besoins de température et les détails du remorquage. L’admissibilité du conducteur, l’assurance, le kilométrage et l’usage permis sont précisés dans les conditions de location.",
    ),
    equipment: items([
      ["box-truck", "Box trucks", "Camions fourgons"],
      ["van", "Cargo vans", "Fourgonnettes utilitaires"],
      ["reefer", "Refrigerated vehicles", "Véhicules réfrigérés"],
      ["flatbed", "Flatbeds", "Camions à plateau"],
      ["trailer", "Trailers", "Remorques"],
    ]),
  },
  {
    id: "technology",
    slug: b("technology-av", "technologie-audiovisuel"),
    name: b("Technology & AV", "Technologie et audiovisuel"),
    description: b(
      "Connect people, information and ideas. Equip temporary teams, training sessions and business presentations with devices and displays matched to your software, connectivity and installation environment. Specify setup and support needs alongside the equipment.",
      "Connectez les gens, l’information et les idées. Équipez les équipes temporaires, les formations et les présentations avec des appareils adaptés aux logiciels, à la connectivité et au contexte d’installation. Précisez aussi les besoins de configuration et de soutien.",
    ),
    planning: b(
      "List device counts, operating systems, software licences, display sizes and network needs. Agree on data handling, setup and support arrangements before use.",
      "Précisez le nombre d’appareils, les systèmes d’exploitation, les licences, les formats d’écran et les besoins réseau. Convenez de la gestion des données, de la configuration et du soutien avant l’utilisation.",
    ),
    equipment: items([
      ["tablet", "Tablets", "Tablettes"],
      ["laptop", "Laptops", "Ordinateurs portables"],
      ["kiosk", "Kiosks", "Bornes interactives"],
      ["signage", "Digital signage", "Affichage numérique"],
      ["screen", "Screens", "Écrans"],
      ["event-tech", "Event technology", "Technologie événementielle"],
    ]),
  },
  {
    id: "cleaning",
    slug: b("cleaning-restoration", "nettoyage-remise-en-etat"),
    name: b("Cleaning & restoration", "Nettoyage et remise en état"),
    description: b(
      "Get commercial spaces ready for their next use. Plan floor care, extraction and moisture control around the surface type, affected area and building access. Whether the work is routine or part of a restoration project, describe the conditions first.",
      "Préparez les espaces commerciaux pour leur prochaine utilisation. Planifiez l’entretien des planchers, l’extraction et le contrôle de l’humidité selon la surface, la zone touchée et les accès. Pour un entretien courant ou une remise en état, décrivez d’abord les conditions.",
    ),
    planning: b(
      "Describe the floor finish, water source, power access and disposal needs. Contaminated materials or hazardous environments require assessment by appropriately qualified professionals.",
      "Décrivez le revêtement, la source d’eau, l’accès électrique et les besoins d’élimination. Les matières contaminées ou les environnements dangereux exigent une évaluation par des professionnels qualifiés.",
    ),
    equipment: items([
      ["scrubber", "Floor scrubbers", "Autorécureuses"],
      ["sweeper", "Sweepers", "Balayeuses"],
      ["extractor", "Extractors", "Extracteurs"],
      ["vacuum", "Commercial vacuums", "Aspirateurs commerciaux"],
      ["dehumidifier", "Dehumidifiers", "Déshumidificateurs"],
    ]),
  },
  {
    id: "landscaping",
    slug: b("landscaping-grounds", "amenagement-paysager"),
    name: b("Landscaping & grounds", "Aménagement paysager et terrains"),
    description: b(
      "Prepare your grounds for the work ahead. Support property maintenance, seasonal work and landscape improvements with equipment appropriate for the terrain and material. Access, slopes and debris handling all matter when planning the rental.",
      "Préparez vos terrains pour les travaux à venir. Soutenez l’entretien des propriétés, les travaux saisonniers et l’aménagement avec de l’équipement adapté au terrain et aux matières. Les accès, les pentes et la gestion des débris comptent dans la planification.",
    ),
    planning: b(
      "Include slopes, gate widths, branch diameters and expected debris volumes. Weather, site restrictions and safe disposal can affect project timing.",
      "Indiquez les pentes, la largeur des portails, le diamètre des branches et le volume de débris. La météo, les restrictions du site et l’élimination sécuritaire peuvent influencer l’échéancier.",
    ),
    equipment: items([
      ["mower", "Mowers", "Tondeuses"],
      ["aerator", "Aerators", "Aérateurs"],
      ["chipper", "Wood chippers", "Déchiqueteuses à bois"],
      ["stump", "Stump grinders", "Dessoucheuses"],
    ]),
  },
  {
    id: "safety",
    slug: b("safety-traffic-control", "securite-signalisation"),
    name: b("Safety & traffic control", "Sécurité et signalisation"),
    description: b(
      "Define the work area and guide movement through the site. Outline temporary vehicle routes, pedestrian paths and work zones with equipment specified in your traffic and safety plan. Quantities and installation windows help us review your request.",
      "Délimitez les travaux et guidez les déplacements. Prévoyez les voies temporaires, les passages piétons et les zones de travail avec l’équipement prévu au plan de circulation et de sécurité. Les quantités et les périodes d’installation nous aident à évaluer la demande.",
    ),
    planning: b(
      "Share quantities, deployment layout, road authority requirements and installation windows. Equipment supply does not replace an engineered traffic plan or required permits.",
      "Transmettez les quantités, le plan d’installation, les exigences de l’autorité routière et les horaires. La fourniture d’équipement ne remplace pas un plan de circulation professionnel ni les permis requis.",
    ),
    equipment: items([
      ["barricade", "Barricades", "Barricades"],
      ["cone", "Traffic cones", "Cônes de signalisation"],
      ["sign", "Signs", "Panneaux"],
      ["message", "Message boards", "Panneaux à messages variables"],
      ["plate", "Road plates", "Plaques de chaussée"],
    ]),
  },
  {
    id: "specialty",
    slug: b("specialty-rentals", "locations-specialisees"),
    name: b("Specialty rentals", "Locations spécialisées"),
    description: b(
      "Start with the requirement, even when it does not fit a standard list. Tell us the technical specifications, operating environment and intended outcome. We review feasibility before coordinating the search for a suitable commercial rental solution.",
      "Partons du besoin, même s’il sort des listes habituelles. Précisez les exigences techniques, l’environnement d’utilisation et le résultat visé. Nous évaluons la faisabilité avant de coordonner la recherche d’une solution de location commerciale.",
    ),
    planning: b(
      "Describe dimensions, load ratings, environment and critical dates. Custom requests depend on technical suitability, regional sourcing and commercial terms.",
      "Décrivez les dimensions, les capacités, l’environnement et les dates critiques. Les demandes particulières dépendent de la conformité technique, de l’approvisionnement régional et des conditions commerciales.",
    ),
    equipment: items([
      [
        "custom",
        "Custom commercial requirements",
        "Besoins commerciaux particuliers",
      ],
    ]),
  },
  {
    id: "events",
    slug: b("events-crowd-control", "evenements-gestion-foules"),
    name: b("Events & crowd control", "Événements et gestion des foules"),
    description: b(
      "Plan practical spaces for commercial gatherings and workplace events. Add site equipment, access control and furnishings to a coordinated rental request. This is one part of our broader commercial rental offering, with a focus on functional site requirements.",
      "Aménagez des espaces pratiques pour les rassemblements commerciaux et les événements d’entreprise. Regroupez l’équipement de site, le contrôle des accès et le mobilier dans une demande. Cette catégorie fait partie de notre offre commerciale et se concentre sur les besoins fonctionnels.",
    ),
    planning: b(
      "Provide attendance, site dimensions, surface type and setup windows. Tent anchoring, weather plans, accessibility and local approvals must be considered for each site.",
      "Indiquez l’achalandage, les dimensions, la surface et les périodes de montage. L’ancrage des tentes, la météo, l’accessibilité et les autorisations locales doivent être pris en compte.",
    ),
    equipment: items([
      ["stanchion", "Stanchions", "Poteaux de guidage"],
      ["barrier", "Crowd barriers", "Barrières de foule"],
      ["turf", "Turf", "Gazon synthétique"],
      ["tent", "Tents", "Tentes"],
      ["furniture", "Furniture", "Mobilier"],
      ["flooring", "Flooring", "Revêtements de sol"],
    ]),
  },
];
