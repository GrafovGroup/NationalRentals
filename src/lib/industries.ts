import { b, type Localized } from "./config";
export type Industry = {
  id: string;
  slug: Localized;
  title: Localized;
  headline: Localized;
  overview: Localized;
  scenarios: Localized[];
  planning: Localized[];
  equipmentIds: string[];
  categoryIds: string[];
  locationIds: string[];
  faq: { question: Localized; answer: Localized }[];
  seo: { title: Localized; description: Localized };
  published: boolean;
};
const records: Omit<Industry, "seo" | "published">[] = [
  {
    id: "construction",
    slug: b("construction-infrastructure", "construction-infrastructures"),
    title: b(
      "Construction and infrastructure",
      "Construction et infrastructures",
    ),
    headline: b(
      "Plan the site. Sequence the work.",
      "Préparer le chantier. Ordonner les travaux.",
    ),
    overview: b(
      "Earthworks, structural work and site services rarely follow the same schedule. Bring the equipment, access constraints and delivery phases into one request so each work package can be reviewed against the site plan.",
      "Le terrassement, les travaux de structure et les services de chantier suivent rarement le même calendrier. Regroupez l’équipement, les contraintes d’accès et les phases de livraison dans une demande pour évaluer chaque lot selon le plan du chantier.",
    ),
    scenarios: [
      b(
        "Excavation and backfill: pair digging requirements with compaction needs, soil conditions and spoil handling.",
        "Excavation et remblayage : reliez les besoins de creusage et de compactage aux conditions du sol et à la gestion des déblais.",
      ),
      b(
        "Structural installation: define lift heights, loads and staging space before selecting access equipment.",
        "Installation de structures : précisez les hauteurs, les charges et l’aire de préparation avant de choisir l’équipement d’élévation.",
      ),
      b(
        "Site establishment: coordinate temporary power and fencing with the arrival of trades and delivery vehicles.",
        "Installation du chantier : coordonnez l’alimentation temporaire et les clôtures avec l’arrivée des équipes et des livraisons.",
      ),
    ],
    planning: [
      b(
        "Provide gate widths, turning space, ground-bearing limits and unloading arrangements.",
        "Précisez la largeur des entrées, l’espace de virage, la capacité portante du sol et les modalités de déchargement.",
      ),
      b(
        "Separate mobilization, active work and demobilization dates; flag dependencies between trades.",
        "Distinguez les dates de mobilisation, de travaux et de démobilisation; indiquez les dépendances entre les corps de métier.",
      ),
      b(
        "Identify underground services and assign responsibility for permits, operators and site controls.",
        "Repérez les services souterrains et attribuez les responsabilités pour les permis, les opérateurs et les mesures de chantier.",
      ),
    ],
    equipmentIds: ["excavator", "compactor", "telehandler", "generator"],
    categoryIds: ["construction", "aerial", "infrastructure"],
    locationIds: ["toronto", "montreal"],
    faq: [
      {
        question: b(
          "Can deliveries follow separate construction phases?",
          "Les livraisons peuvent-elles suivre différentes phases de travaux?",
        ),
        answer: b(
          "Include a schedule for each equipment group and the site contact for each phase. Delivery sequencing is reviewed against transport access, equipment requirements and local feasibility; changes should be identified before dispatch.",
          "Joignez un échéancier par groupe d’équipement et le contact de chaque phase. La séquence de livraison est évaluée selon les accès, les besoins et la faisabilité locale; signalez les changements avant l’expédition.",
        ),
      },
    ],
  },
  {
    id: "logistics",
    slug: b("warehousing-logistics", "entreposage-logistique"),
    title: b("Warehousing and logistics", "Entreposage et logistique"),
    headline: b(
      "Keep receiving and dispatch in sync.",
      "Coordonner la réception et l’expédition.",
    ),
    overview: b(
      "Seasonal peaks, stock moves and distribution changes place different demands on a warehouse. Define the load flow, aisle geometry and operating shifts so material handling and temporary storage can be considered together.",
      "Les pointes saisonnières, les déplacements de stocks et les changements de distribution sollicitent l’entrepôt différemment. Décrivez les flux, les allées et les quarts de travail pour évaluer ensemble la manutention et l’entreposage temporaire.",
    ),
    scenarios: [
      b(
        "Peak receiving: identify pallet weights, loading dock heights and the hours available for unloading.",
        "Réception en période de pointe : indiquez le poids des palettes, la hauteur des quais et les heures de déchargement.",
      ),
      b(
        "Warehouse reconfiguration: plan elevated access for racking work without mixing equipment and pedestrian routes.",
        "Réaménagement d’entrepôt : planifiez l’accès aux rayonnages en séparant les parcours des équipements et des piétons.",
      ),
      b(
        "Overflow storage: define the goods, security requirements and space available for a temporary container.",
        "Entreposage d’appoint : précisez les marchandises, la sécurité requise et l’espace disponible pour un conteneur temporaire.",
      ),
    ],
    planning: [
      b(
        "Record aisle widths, turning clearances and maximum loads at the actual working height.",
        "Mesurez les allées et les dégagements de virage, et précisez les charges à la hauteur réelle de travail.",
      ),
      b(
        "Check floor loading, indoor emissions restrictions and charging arrangements with the facility team.",
        "Vérifiez la capacité du plancher, les restrictions d’émissions et la recharge avec l’équipe du bâtiment.",
      ),
      b(
        "Specify receiving appointments, shift handovers and the contact authorized to accept equipment.",
        "Précisez les rendez-vous de réception, les changements de quart et la personne autorisée à recevoir l’équipement.",
      ),
    ],
    equipmentIds: ["forklift", "scissor", "container", "scrubber"],
    categoryIds: ["aerial", "infrastructure", "cleaning"],
    locationIds: ["toronto", "vancouver"],
    faq: [
      {
        question: b(
          "What load information is needed for a forklift request?",
          "Quels renseignements fournir pour un chariot élévateur?",
        ),
        answer: b(
          "Provide the heaviest load, its dimensions, load centre, required lift height and attachment needs. A nominal lifting capacity alone does not establish suitability for the actual load or aisle.",
          "Fournissez la charge maximale, ses dimensions, son centre de gravité, la hauteur de levage et les accessoires requis. La capacité nominale seule ne confirme pas l’adéquation à la charge ou à l’allée.",
        ),
      },
    ],
  },
  {
    id: "manufacturing",
    slug: b("manufacturing-industrial", "fabrication-operations-industrielles"),
    title: b(
      "Manufacturing and industrial operations",
      "Fabrication et opérations industrielles",
    ),
    headline: b(
      "Build the shutdown plan around the process.",
      "Planifier l’arrêt autour du procédé.",
    ),
    overview: b(
      "Maintenance shutdowns and line changes need a clear sequence of temporary services, access and cleanup. Describe the process constraints and equipment interfaces so the rental request reflects the work window rather than a generic equipment list.",
      "Les arrêts d’entretien et les modifications de ligne exigent une séquence claire pour les services temporaires, les accès et le nettoyage. Décrivez les contraintes du procédé et les interfaces pour adapter la demande à la fenêtre de travaux.",
    ),
    scenarios: [
      b(
        "Planned maintenance: align compressed air and elevated access with isolated work areas and contractor schedules.",
        "Entretien planifié : coordonnez l’air comprimé et l’accès en hauteur avec les zones isolées et l’horaire des entrepreneurs.",
      ),
      b(
        "Temporary services: document electrical demand and connection requirements for a work area affected by an outage.",
        "Services temporaires : documentez la demande électrique et les raccordements d’une zone touchée par une interruption.",
      ),
      b(
        "Return to operation: plan floor cleaning and material removal before production equipment is recommissioned.",
        "Reprise des activités : prévoyez le nettoyage des planchers et l’enlèvement des matériaux avant la remise en service.",
      ),
    ],
    planning: [
      b(
        "Supply voltage, phase, load profile, pressure and flow requirements as applicable.",
        "Fournissez la tension, le nombre de phases, le profil de charge, la pression et le débit pertinents.",
      ),
      b(
        "Identify controlled areas, site induction and isolation procedures managed by your technical team.",
        "Indiquez les zones contrôlées, l’accueil de sécurité et les procédures de consignation gérées par votre équipe technique.",
      ),
      b(
        "Allow time for installation, inspection and removal within the shutdown window.",
        "Prévoyez l’installation, l’inspection et le retrait dans la fenêtre d’arrêt.",
      ),
    ],
    equipmentIds: ["compressor", "generator", "scissor", "scrubber"],
    categoryIds: ["power", "aerial", "cleaning"],
    locationIds: ["montreal", "toronto"],
    faq: [
      {
        question: b(
          "Can temporary power replace a process supply?",
          "Une alimentation temporaire peut-elle remplacer celle d’un procédé?",
        ),
        answer: b(
          "Your qualified electrical team must define the load, starting demand, connection and protection requirements. Suitability and installation responsibilities need confirmation before any equipment is connected.",
          "Votre équipe électrique qualifiée doit préciser la charge, la demande au démarrage, les raccordements et les protections. L’adéquation et les responsabilités d’installation doivent être confirmées avant tout branchement.",
        ),
      },
    ],
  },
  {
    id: "facilities",
    slug: b(
      "facilities-property-management",
      "gestion-immeubles-installations",
    ),
    title: b(
      "Facilities and property management",
      "Gestion d’immeubles et d’installations",
    ),
    headline: b(
      "Maintain the building around its occupants.",
      "Entretenir le bâtiment au rythme de ses occupants.",
    ),
    overview: b(
      "Occupied buildings need maintenance plans that account for visitors, tenants and daily operations. Combine cleaning, access and temporary climate requirements with the building’s work windows and delivery rules.",
      "L’entretien d’un bâtiment occupé doit tenir compte des visiteurs, des locataires et des activités quotidiennes. Regroupez les besoins de nettoyage, d’accès et de chauffage temporaire selon les plages de travail et les règles de livraison.",
    ),
    scenarios: [
      b(
        "Floor care: match cleaning methods to surface materials, contamination and drying time.",
        "Entretien des sols : adaptez les méthodes aux revêtements, aux salissures et au temps de séchage.",
      ),
      b(
        "Overhead maintenance: plan access for lighting and ceiling work around occupied areas.",
        "Travaux en hauteur : planifiez l’accès aux luminaires et aux plafonds autour des zones occupées.",
      ),
      b(
        "Seasonal work: coordinate exterior cleanup and temporary heating with weather and building access.",
        "Travaux saisonniers : coordonnez le nettoyage extérieur et le chauffage temporaire selon la météo et les accès.",
      ),
    ],
    planning: [
      b(
        "Confirm doorway and elevator dimensions, floor limits and protection requirements.",
        "Confirmez les dimensions des portes et ascenseurs, les limites des planchers et leur protection.",
      ),
      b(
        "List noise restrictions, occupied hours and designated loading areas.",
        "Indiquez les limites de bruit, les heures d’occupation et les aires de chargement désignées.",
      ),
      b(
        "Assign a building contact for access, keys, orientation and collection.",
        "Désignez un contact pour les accès, les clés, l’accueil et la reprise.",
      ),
    ],
    equipmentIds: ["scrubber", "mast-lift", "electric-heater", "sweeper"],
    categoryIds: ["cleaning", "aerial", "power"],
    locationIds: ["toronto", "montreal"],
    faq: [
      {
        question: b(
          "Can work be planned outside occupied hours?",
          "Peut-on planifier les travaux hors des heures d’occupation?",
        ),
        answer: b(
          "Provide permitted work and delivery windows separately. Access authorization, unloading arrangements and equipment suitability are reviewed for the specific building; an after-hours request does not confirm an after-hours delivery.",
          "Précisez séparément les plages de travaux et de livraison. Les autorisations, le déchargement et l’équipement sont évalués pour le bâtiment; une demande hors des heures normales ne confirme pas une livraison à ces heures.",
        ),
      },
    ],
  },
  {
    id: "municipal",
    slug: b("municipalities-government", "municipalites-marches-publics"),
    title: b(
      "Municipalities and government procurement",
      "Municipalités et marchés publics",
    ),
    headline: b(
      "Define the scope. Document the requirement.",
      "Définir le mandat. Documenter le besoin.",
    ),
    overview: b(
      "Public works and institutional purchasing start with a clear scope, delivery locations and procurement instructions. Submit rental requirements with the RFQ reference, requested documentation and evaluation deadlines for review.",
      "Les travaux publics et les achats institutionnels commencent par un mandat clair, des lieux de livraison et des instructions d’approvisionnement. Transmettez les besoins de location avec la référence de la demande de prix, les documents requis et les échéances.",
    ),
    scenarios: [
      b(
        "Public works: group excavation, compaction and site delineation requirements by work order.",
        "Travaux publics : regroupez les besoins d’excavation, de compactage et de délimitation par bon de travail.",
      ),
      b(
        "Parks maintenance: define seasonal grounds work, access restrictions and collection dates.",
        "Entretien des parcs : précisez les travaux saisonniers, les restrictions d’accès et les dates de reprise.",
      ),
      b(
        "Procurement packages: identify required quote format, insurance evidence and submission method.",
        "Dossier d’approvisionnement : indiquez le format du prix demandé, les preuves d’assurance et la méthode de dépôt.",
      ),
    ],
    planning: [
      b(
        "Include the RFQ number, purchasing contact and deadline with time zone.",
        "Incluez le numéro de demande de prix, le contact aux achats et l’échéance avec fuseau horaire.",
      ),
      b(
        "Separate mandatory technical criteria from preferences and list each delivery address.",
        "Distinguez les critères techniques obligatoires des préférences et listez chaque adresse de livraison.",
      ),
      b(
        "Identify document and registration requirements for assessment; do not assume prequalification.",
        "Indiquez les exigences documentaires et d’inscription pour évaluation; ne présumez pas d’une préqualification.",
      ),
    ],
    equipmentIds: ["mini-excavator", "plate-compactor", "barricade", "mower"],
    categoryIds: ["construction", "safety", "landscaping"],
    locationIds: ["montreal", "toronto"],
    faq: [
      {
        question: b(
          "Does an inquiry confirm a standing offer or supplier registration?",
          "Une demande confirme-t-elle une offre à commandes ou une inscription fournisseur?",
        ),
        answer: b(
          "No. Identify the purchasing program and its eligibility requirements in your request. Documentation and participation must be assessed for that procurement; no standing offer, registration or awarded contract is implied.",
          "Non. Précisez le programme d’achat et ses conditions d’admissibilité. Les documents et la participation doivent être évalués pour cet achat; aucune offre à commandes, inscription ni attribution de contrat n’est présumée.",
        ),
      },
    ],
  },
  {
    id: "retail",
    slug: b("retail-multi-location", "commerce-detail-multisites"),
    title: b(
      "Retail chains and multi-location operations",
      "Commerce de détail et activités multisites",
    ),
    headline: b(
      "One project brief. Site-by-site detail.",
      "Un dossier commun. Des besoins par site.",
    ),
    overview: b(
      "Store refreshes and coordinated rollouts share objectives but differ in access, floor area and local schedules. Build a consolidated request with a separate line of requirements for each location and a central project contact.",
      "Les rénovations de magasins et les déploiements coordonnés ont des objectifs communs, mais des accès, des superficies et des horaires différents. Préparez une demande regroupée avec les besoins de chaque site et un contact central.",
    ),
    scenarios: [
      b(
        "Store refresh: schedule elevated access and floor care around merchandising and reopening.",
        "Réaménagement de magasin : planifiez l’accès en hauteur et l’entretien des sols selon le marchandisage et la réouverture.",
      ),
      b(
        "Temporary operations: define device, display and power requirements for an alternate service area.",
        "Activités temporaires : définissez les appareils, l’affichage et l’alimentation d’une zone de service de remplacement.",
      ),
      b(
        "Regional rollout: group common specifications while recording different delivery windows for every store.",
        "Déploiement régional : regroupez les spécifications communes tout en conservant les plages de livraison propres à chaque magasin.",
      ),
    ],
    planning: [
      b(
        "Provide a site list with addresses, local contacts and quantities per item.",
        "Fournissez les adresses, les contacts locaux et les quantités par article pour chaque site.",
      ),
      b(
        "Identify mall rules, dock bookings and equipment storage during trading hours.",
        "Indiquez les règles du centre commercial, les réservations de quai et l’entreposage pendant l’ouverture.",
      ),
      b(
        "Separate the desired rollout schedule from any dates already confirmed by contractors.",
        "Distinguez l’échéancier souhaité des dates déjà confirmées par les entrepreneurs.",
      ),
    ],
    equipmentIds: ["scissor", "scrubber", "signage", "tablet"],
    categoryIds: ["aerial", "cleaning", "technology"],
    locationIds: ["toronto", "vancouver"],
    faq: [
      {
        question: b(
          "Can one inquiry cover stores in several provinces?",
          "Une demande peut-elle couvrir des magasins dans plusieurs provinces?",
        ),
        answer: b(
          "Yes. Use the project details to list each site and its equipment, dates and contacts. Coordination can be reviewed centrally, while feasibility, transport and rental terms are confirmed separately for each location.",
          "Oui. Listez chaque site, son équipement, ses dates et ses contacts dans les détails du projet. La coordination peut être étudiée de façon centralisée; la faisabilité, le transport et les modalités sont confirmés par lieu.",
        ),
      },
    ],
  },
  {
    id: "healthcare",
    slug: b("healthcare-institutions", "sante-etablissements"),
    title: b("Healthcare and institutions", "Santé et établissements"),
    headline: b(
      "Plan facility work with the care team.",
      "Planifier les travaux avec les équipes de soins.",
    ),
    overview: b(
      "Healthcare buildings and institutional campuses require careful coordination of non-clinical maintenance. Describe controlled access, occupied spaces and facility requirements before considering cleaning, access or temporary support equipment.",
      "Les bâtiments de santé et les campus institutionnels exigent une coordination rigoureuse des travaux non cliniques. Décrivez les accès contrôlés, les espaces occupés et les exigences du bâtiment avant d’évaluer les équipements d’entretien et de soutien temporaire.",
    ),
    scenarios: [
      b(
        "Non-clinical floor maintenance: specify surface types and the facility’s cleaning protocols.",
        "Entretien des sols non cliniques : précisez les revêtements et les protocoles de nettoyage de l’établissement.",
      ),
      b(
        "Building repairs: arrange elevated access around restricted corridors and service elevators.",
        "Réparation du bâtiment : organisez l’accès en hauteur selon les corridors restreints et les ascenseurs de service.",
      ),
      b(
        "Temporary administrative areas: identify workstations and device needs without including patient information.",
        "Espaces administratifs temporaires : précisez les postes et appareils requis sans inclure de renseignements sur les patients.",
      ),
    ],
    planning: [
      b(
        "Have the facility team define infection-prevention, cleaning and equipment-entry requirements.",
        "Faites préciser par l’établissement les exigences de prévention des infections, de nettoyage et d’entrée des équipements.",
      ),
      b(
        "Record escort requirements, elevator dimensions and approved delivery routes.",
        "Notez les exigences d’accompagnement, les dimensions des ascenseurs et les parcours de livraison autorisés.",
      ),
      b(
        "Keep patient details and sensitive institutional records out of the inquiry.",
        "N’incluez pas de renseignements sur les patients ni de dossiers institutionnels sensibles dans la demande.",
      ),
    ],
    equipmentIds: ["scrubber", "mast-lift", "laptop", "container"],
    categoryIds: ["cleaning", "aerial", "technology"],
    locationIds: ["montreal", "vancouver"],
    faq: [
      {
        question: b(
          "Is this equipment intended for clinical use?",
          "Cet équipement est-il destiné aux soins cliniques?",
        ),
        answer: b(
          "These requests cover non-clinical facility and administrative work. Medical-device suitability, clinical certification and compatibility with care environments are not asserted. Your institution must approve the intended use and entry conditions.",
          "Ces demandes visent les travaux non cliniques et administratifs. Aucune aptitude médicale, certification clinique ni compatibilité avec un milieu de soins n’est affirmée. L’établissement doit approuver l’utilisation et les conditions d’entrée.",
        ),
      },
    ],
  },
  {
    id: "film",
    slug: b("film-commercial-production", "cinema-production-commerciale"),
    title: b(
      "Film and commercial production",
      "Cinéma et production commerciale",
    ),
    headline: b(
      "Support the location behind the scene.",
      "Soutenir le lieu derrière la scène.",
    ),
    overview: b(
      "Location shoots combine changing call sheets with power, access and base-camp needs. Define technical loads, quiet periods and site logistics so rental requirements can be reviewed around the production schedule.",
      "Les tournages combinent des horaires changeants et des besoins d’alimentation, d’accès et de camp de base. Précisez les charges techniques, les périodes de silence et la logistique pour évaluer la location selon le calendrier de production.",
    ),
    scenarios: [
      b(
        "Location power: separate lighting and support loads and specify connection requirements with your electrical team.",
        "Alimentation du lieu : distinguez les charges d’éclairage et de soutien, et précisez les raccordements avec l’équipe électrique.",
      ),
      b(
        "Base camp: coordinate storage and welfare facilities with parking and crew movement.",
        "Camp de base : coordonnez l’entreposage et les installations sanitaires avec le stationnement et la circulation des équipes.",
      ),
      b(
        "Load-in and strike: identify material handling needs and the site’s restricted vehicle hours.",
        "Montage et démontage : indiquez les besoins de manutention et les restrictions horaires des véhicules.",
      ),
    ],
    planning: [
      b(
        "Provide shoot, preparation and strike dates, including likely location moves.",
        "Fournissez les dates de tournage, de préparation et de démontage, ainsi que les déplacements prévus.",
      ),
      b(
        "Specify acoustic requirements; do not assume any generator is silent.",
        "Précisez les contraintes acoustiques; ne présumez pas qu’une génératrice est silencieuse.",
      ),
      b(
        "Confirm landowner permissions, access routes and an on-location receiving contact.",
        "Confirmez les autorisations du propriétaire, les accès et le contact de réception sur place.",
      ),
    ],
    equipmentIds: ["generator", "container", "toilet", "telehandler"],
    categoryIds: ["power", "infrastructure", "aerial"],
    locationIds: ["vancouver", "toronto"],
    faq: [
      {
        question: b(
          "Can a request account for changing shoot locations?",
          "Une demande peut-elle prévoir plusieurs lieux de tournage?",
        ),
        answer: b(
          "List each location, transfer window and receiving contact. Relocation, transport and permissible use need review for each site; a schedule change does not automatically confirm a new delivery or equipment move.",
          "Listez chaque lieu, la plage de transfert et le contact de réception. Le déplacement, le transport et l’usage autorisé sont évalués par site; un changement d’horaire ne confirme pas automatiquement une nouvelle livraison.",
        ),
      },
    ],
  },
  {
    id: "events",
    slug: b("events-exhibitions-conferences", "evenements-expositions-congres"),
    title: b(
      "Events, exhibitions and conferences",
      "Événements, expositions et congrès",
    ),
    headline: b(
      "Coordinate the build before doors open.",
      "Coordonner le montage avant l’ouverture.",
    ),
    overview: b(
      "Commercial events need an equipment plan that covers setup, guest circulation and removal. Bring venue rules, attendance estimates and the exhibitor schedule together before choosing furnishings, access control or temporary structures.",
      "Les événements commerciaux nécessitent un plan couvrant le montage, la circulation des visiteurs et le démontage. Regroupez les règles du lieu, la fréquentation prévue et l’horaire des exposants avant de choisir le mobilier, le guidage et les structures temporaires.",
    ),
    scenarios: [
      b(
        "Conference registration: define queue layouts, check-in devices and accessible circulation space.",
        "Accueil de congrès : définissez les files, les appareils d’enregistrement et les espaces de circulation accessibles.",
      ),
      b(
        "Exhibition setup: coordinate furnishings and flooring with exhibitor load-in appointments.",
        "Montage d’exposition : coordonnez le mobilier et les revêtements avec les rendez-vous des exposants.",
      ),
      b(
        "Outdoor gathering: assess temporary shelter requirements against the site, weather plan and approvals.",
        "Rassemblement extérieur : évaluez les abris selon le terrain, le plan météo et les autorisations.",
      ),
    ],
    planning: [
      b(
        "Separate setup, public opening and teardown windows, including venue overtime rules.",
        "Distinguez le montage, l’ouverture au public et le démontage, y compris les règles d’heures supplémentaires du lieu.",
      ),
      b(
        "Identify exits, accessibility requirements and crowd routes with the venue team.",
        "Repérez les sorties, les exigences d’accessibilité et les parcours de foule avec l’équipe du lieu.",
      ),
      b(
        "Assign responsibility for permits, anchoring, electrical connections and weather decisions.",
        "Attribuez les responsabilités pour les permis, l’ancrage, l’électricité et les décisions liées à la météo.",
      ),
    ],
    equipmentIds: ["stanchion", "furniture", "tent", "tablet"],
    categoryIds: ["events", "technology", "power"],
    locationIds: ["montreal", "toronto"],
    faq: [
      {
        question: b(
          "What information is needed for an outdoor structure?",
          "Quels renseignements fournir pour une structure extérieure?",
        ),
        answer: b(
          "Include dimensions, intended use, ground surface, anchoring limitations and the venue’s approval process. Installation scope and weather limits require project-specific assessment; a tent inquiry does not confirm structural or permit approval.",
          "Précisez les dimensions, l’usage, le sol, les restrictions d’ancrage et le processus d’autorisation. L’installation et les limites météo nécessitent une évaluation propre au projet; une demande de tente ne confirme aucune approbation structurale ou permis.",
        ),
      },
    ],
  },
  {
    id: "restoration",
    slug: b("emergency-restoration-response", "restauration-apres-sinistre"),
    title: b(
      "Emergency restoration and response",
      "Restauration après sinistre et intervention",
    ),
    headline: b(
      "Turn the site assessment into an equipment plan.",
      "Transformer l’évaluation des lieux en plan d’équipement.",
    ),
    overview: b(
      "Water damage and disrupted building operations require an assessed scope before equipment selection. Share the affected area, utility status and contractor’s drying or cleanup plan so temporary support needs can be reviewed without promising an arrival time.",
      "Les dégâts d’eau et les interruptions d’exploitation nécessitent une évaluation avant le choix d’équipement. Décrivez la zone touchée, l’état des services et le plan d’assèchement ou de nettoyage de l’entrepreneur pour évaluer les besoins temporaires.",
    ),
    scenarios: [
      b(
        "Drying support: use the restoration professional’s assessment to define dehumidification and air movement needs.",
        "Soutien à l’assèchement : utilisez l’évaluation du professionnel pour définir la déshumidification et la circulation d’air.",
      ),
      b(
        "Water removal: specify water conditions, lift height and discharge arrangements before selecting a pump.",
        "Évacuation d’eau : précisez la nature de l’eau, la hauteur de refoulement et l’évacuation avant de choisir une pompe.",
      ),
      b(
        "Temporary stabilization: identify power and access needs after the site is cleared for work by responsible personnel.",
        "Stabilisation temporaire : définissez l’alimentation et les accès après l’autorisation de travail des responsables du site.",
      ),
    ],
    planning: [
      b(
        "Identify electrical hazards, contamination and restricted areas through the responsible specialist.",
        "Faites identifier les risques électriques, la contamination et les zones restreintes par le spécialiste responsable.",
      ),
      b(
        "Provide room volumes, temperature conditions and power availability when requesting drying equipment.",
        "Indiquez les volumes, les températures et l’alimentation disponible pour l’équipement d’assèchement.",
      ),
      b(
        "List the site decision-maker and requested timing; equipment and transport remain subject to confirmation.",
        "Nommez le responsable du site et l’horaire souhaité; l’équipement et le transport restent à confirmer.",
      ),
    ],
    equipmentIds: ["dehumidifier", "air-mover", "pump", "generator"],
    categoryIds: ["cleaning", "power", "infrastructure"],
    locationIds: ["vancouver", "montreal"],
    faq: [
      {
        question: b(
          "Does an inquiry dispatch an emergency response team?",
          "Une demande déclenche-t-elle l’envoi d’une équipe d’urgence?",
        ),
        answer: b(
          "No. This is an equipment rental inquiry, not emergency dispatch or a hazard assessment service. Use the appropriate emergency services for immediate danger and have qualified personnel determine when the site is safe for equipment use.",
          "Non. Il s’agit d’une demande de location, pas d’un service de répartition d’urgence ni d’évaluation des dangers. En cas de danger immédiat, utilisez les services d’urgence appropriés et faites confirmer la sécurité des lieux par du personnel qualifié.",
        ),
      },
    ],
  },
];
export const industries: Industry[] = records.map((r) => ({
  ...r,
  published: true,
  seo: {
    title: b(
      `${r.title.en} equipment rentals`,
      `Location d’équipement — ${r.title.fr}`,
    ),
    description: b(
      `Plan rentals for ${r.title.en.toLowerCase()}: equipment selection, project scenarios and delivery requirements. Submit one coordinated commercial inquiry.`,
      `Planifiez la location pour ${r.title.fr.toLowerCase()} : choix d’équipement, besoins du projet et livraison. Transmettez une demande commerciale regroupée.`,
    ),
  },
}));
export const publishedIndustries = industries.filter((i) => i.published);
export const getIndustry = (id: string) =>
  publishedIndustries.find((i) => i.id === id);
