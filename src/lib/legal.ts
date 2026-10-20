import { b } from "./config";
// Internal status: DRAFT — owner/legal review required; no pre-launch messaging on public pages.
export const legal = {
  privacy: [
    {
      title: b("Information you provide", "Renseignements que vous fournissez"),
      text: b(
        "The quote form asks for contact details, company information and project requirements. National Rentals, operated by Grafov Group Inc., uses these details to review your inquiry and communicate with you about rental options. Do not include payment card details, identity documents or sensitive personal information in your request.",
        "Le formulaire demande vos coordonnées, des renseignements sur votre entreprise et les besoins du projet. National Rentals, exploitée par Grafov Group Inc., utilise ces renseignements pour examiner votre demande et communiquer avec vous au sujet des options de location. N’incluez pas de données de carte de paiement, de pièces d’identité ou de renseignements personnels sensibles.",
      ),
    },
    {
      title: b("Handling your request", "Traitement de votre demande"),
      text: b(
        "Submitted information is retained in our private inquiry store and an email notification is attempted. Information relevant to sourcing or fulfillment may be shared with providers involved in your request. Technical services used to operate the website and email may process data outside your province or Canada. Ask us about handling arrangements before sending information that requires specific restrictions.",
        "Les renseignements soumis sont conservés dans notre registre privé de demandes, puis un avis par courriel est tenté. Les renseignements pertinents à l’approvisionnement ou à l’exécution peuvent être communiqués aux fournisseurs qui participent à votre demande. Les services techniques du site et du courriel peuvent traiter des données à l’extérieur de votre province ou du Canada. Communiquez avec nous avant d’envoyer des renseignements exigeant des restrictions particulières.",
      ),
    },
    {
      title: b(
        "Technical data and storage",
        "Données techniques et conservation",
      ),
      text: b(
        "The website uses technical request data to operate the service and limit abuse. A quote draft is stored in this browser tab for up to 30 minutes to preserve your entries during navigation. You can clear it in the form; it is removed after a confirmed submission. Optional interaction measurement runs only after you allow it and excludes form entries, inquiry IDs and campaign details. You can change that choice on this page when measurement is enabled. Hosting and email systems may maintain operational logs and messages. Contact us to discuss retention or deletion of information associated with your inquiry.",
        "Le site utilise des données techniques de requête pour fonctionner et limiter les abus. Un brouillon est conservé dans cet onglet pendant au plus 30 minutes pour préserver vos données pendant la navigation. Vous pouvez l’effacer dans le formulaire; il est supprimé après une transmission confirmée. La mesure facultative des interactions exige votre autorisation et exclut les champs du formulaire, les identifiants de demande et les détails de campagne. Vous pouvez modifier ce choix sur cette page lorsque la mesure est activée. Les systèmes d’hébergement et de courriel peuvent conserver des journaux et des messages. Communiquez avec nous au sujet de la conservation ou de la suppression des renseignements liés à votre demande.",
      ),
    },
    {
      title: b("Questions and requests", "Questions et demandes"),
      text: b(
        "For privacy questions, access, correction or deletion requests, email info@nationalrentals.ca and describe the information concerned. We may need to verify your identity before acting on a request. Applicable requirements and the circumstances of the request may affect the response.",
        "Pour toute question de confidentialité ou demande d’accès, de correction ou de suppression, écrivez à info@nationalrentals.ca en précisant les renseignements concernés. Nous pourrions devoir vérifier votre identité avant d’agir. Les exigences applicables et les circonstances peuvent influencer la réponse.",
      ),
    },
  ],
  terms: [
    {
      title: b("Inquiries and quotations", "Demandes et soumissions"),
      text: b(
        "This website introduces commercial rental categories and accepts quote requests. Submitting a request does not reserve equipment, guarantee availability or create a confirmed rental. Pricing, specifications, availability and delivery arrangements are established through a separate quotation and applicable rental agreement.",
        "Ce site présente des catégories de location commerciale et reçoit des demandes de soumission. Une demande ne réserve pas d’équipement, ne garantit pas sa disponibilité et ne constitue pas une location confirmée. Les prix, les caractéristiques, la disponibilité et la livraison sont précisés dans une soumission distincte et le contrat applicable.",
      ),
    },
    {
      title: b(
        "Coordination and responsibilities",
        "Coordination et responsabilités",
      ),
      text: b(
        "National Rentals is operated by Grafov Group Inc. Sourcing and fulfillment may involve owned resources or regional providers, as applicable. The equipment provider, delivery responsibilities, operator requirements, insurance, deposits and other commercial terms must be confirmed for the particular rental.",
        "National Rentals est exploitée par Grafov Group Inc. L’approvisionnement et l’exécution peuvent faire appel à des ressources détenues ou à des fournisseurs régionaux, selon le cas. Le fournisseur d’équipement, la livraison, les exigences pour les opérateurs, l’assurance, les dépôts et les autres conditions doivent être confirmés pour chaque location.",
      ),
    },
    {
      title: b(
        "Suitability and safe use",
        "Pertinence et utilisation sécuritaire",
      ),
      text: b(
        "Provide accurate information about the intended application, location, access and operating conditions. Equipment selection and use must take account of the manufacturer’s instructions, site requirements, operator qualifications and applicable permits. Availability may be affected by weather, transport and local conditions.",
        "Fournissez des renseignements exacts sur l’utilisation, le lieu, les accès et les conditions. Le choix et l’utilisation doivent tenir compte des instructions du fabricant, des exigences du site, des qualifications des opérateurs et des permis applicables. La disponibilité peut être influencée par la météo, le transport et les conditions locales.",
      ),
    },
    {
      title: b("Website information", "Renseignements du site"),
      text: b(
        "Category information is general and does not replace project-specific specifications or advice from qualified professionals. Contact info@nationalrentals.ca to clarify information before relying on it for procurement or site planning. Specific rental documents set out the terms for an agreed transaction.",
        "Les renseignements sur les catégories sont généraux et ne remplacent pas les exigences propres au projet ni les conseils de professionnels qualifiés. Écrivez à info@nationalrentals.ca pour clarifier l’information avant de l’utiliser pour l’approvisionnement ou la planification. Les documents propres à la location précisent les conditions de la transaction convenue.",
      ),
    },
  ],
};
