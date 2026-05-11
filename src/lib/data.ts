import type { FabLab, Plan } from "@/types";

export const FABLABS_MOCK: FabLab[] = [
  {
    id: "mock-1",
    name: "FabLab Lille Nord",
    slug: "mock-1",
    description:
      "Espace de fabrication numérique au cœur de Lille. Imprimantes 3D, découpe laser, électronique. Ouvert à tous, du débutant au professionnel.",
    zip_code: "59000",
    city: "Lille",
    address: "12 rue de la Paix, 59000 Lille",
    safety: "optimal",
    equipment: ["Imprimante 3D", "Découpe laser", "Arduino", "Raspberry Pi"],
    website: "https://fablab-lille.fr",
    created_at: "2024-01-01",
  },
  {
    id: "mock-2",
    name: "Maker Space Douai",
    slug: "mock-2",
    description:
      "FabLab communautaire spécialisé en robotique et prototypage rapide. Accès 24h/24 pour les membres.",
    zip_code: "59500",
    city: "Douai",
    address: "5 avenue des Makers, 59500 Douai",
    safety: "medium",
    equipment: ["Robotique", "CNC", "Soudure", "Impression 3D"],
    created_at: "2024-01-01",
  },
  {
    id: "mock-3",
    name: "FabLab Valenciennes",
    slug: "mock-3",
    description:
      "Atelier numérique universitaire avec équipements professionnels. Réservé aux étudiants et chercheurs en priorité.",
    zip_code: "59300",
    city: "Valenciennes",
    safety: "optimal",
    equipment: ["Fraiseuse CNC", "Impression 3D métal", "Scan 3D", "Broderie numérique"],
    created_at: "2024-01-01",
  },
  {
    id: "mock-4",
    name: "TechShop Roubaix",
    slug: "mock-4",
    description:
      "Grande surface de co-fabrication avec fraiseuse CNC industrielle et machines lourdes. Équipement professionnel uniquement.",
    zip_code: "59100",
    city: "Roubaix",
    safety: "danger",
    equipment: ["Fraiseuse industrielle", "Tour CNC", "Plasma", "Soudure TIG/MIG"],
    created_at: "2024-01-01",
  },
  {
    id: "mock-5",
    name: "OpenLab Dunkerque",
    slug: "mock-5",
    description:
      "FabLab portuaire orienté énergie renouvelable et impression 3D marine. Partenaire de plusieurs entreprises navales.",
    zip_code: "59140",
    city: "Dunkerque",
    safety: "optimal",
    equipment: ["Impression 3D PETG", "Découpe eau", "Électronique marine"],
    created_at: "2024-01-01",
  },
  {
    id: "mock-6",
    name: "CreativeLab Calais",
    slug: "mock-6",
    description:
      "Espace créatif pour artistes et makers. Textiles, découpe laser vinyle, sérigraphie numérique.",
    zip_code: "62100",
    city: "Calais",
    safety: "alert",
    equipment: ["Découpe vinyle", "Sérigraphie", "Broderie CNC", "Impression grand format"],
    created_at: "2024-01-01",
  },
  {
    id: "mock-7",
    name: "InnoFab Amiens",
    slug: "mock-7",
    description:
      "FabLab innovation de la Somme, spécialisé en IoT et objets connectés.",
    zip_code: "80000",
    city: "Amiens",
    safety: "optimal",
    equipment: ["IoT", "LoRa", "Impression 3D", "PCB"],
    created_at: "2024-01-01",
  },
  {
    id: "mock-8",
    name: "FabLab Arras",
    slug: "mock-8",
    description:
      "Espace collaboratif en centre-ville d'Arras, idéal pour les entrepreneurs et startups.",
    zip_code: "62000",
    city: "Arras",
    safety: "offline",
    equipment: ["Impression 3D", "Découpe laser", "Découpe vinyle"],
    created_at: "2024-01-01",
  },
];

export const PLANS_DATA: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly_price: 49,
    annual_price: 419,
    color: "#3b82f6",
    features: [
      "Jusqu'à 5 stations (machines)",
      "Dashboard temps réel professeur",
      "Alertes email en cas d'anomalie",
      "Écran LCD — affichage local",
      "Remplacement capteur sous 72h",
      "Support email",
    ],
    missing: [
      "Alertes SMS",
      "Analytics avancés",
      "Multi-bâtiments",
      "API d'intégration",
      "Manager dédié",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly_price: 149,
    annual_price: 1279,
    color: "#059669",
    featured: true,
    features: [
      "Jusqu'à 20 stations (machines)",
      "Dashboard temps réel professeur",
      "Alertes SMS + email en temps réel",
      "Écran LCD — affichage local",
      "Remplacement capteur sous 24h",
      "Analytics avancés & historique",
      "Accès app étudiants",
      "Support prioritaire 5j/7",
    ],
    missing: [
      "Multi-bâtiments / campus",
      "API d'intégration",
      "Manager dédié",
    ],
  },
  {
    id: "institution",
    name: "Institution",
    monthly_price: 349,
    annual_price: 2999,
    color: "#7c3aed",
    features: [
      "Stations illimitées",
      "Dashboard temps réel professeur",
      "Alertes SMS + email en temps réel",
      "Écran LCD — affichage local",
      "Remplacement capteur sous 4h",
      "Analytics avancés & rapports PDF",
      "Multi-bâtiments & campus",
      "API d'intégration (SSO, ERP)",
      "Manager dédié & onboarding",
    ],
    missing: [],
  },
];

export const PARTNERS = [
  "TechCorp",
  "InnovaLab",
  "GreenTech",
  "FabMakers",
  "DigiSpace",
  "OpenMake",
];

export const KEY_STATS = [
  { value: 1200, suffix: "+", label: "FabLabs certifiés", icon: "🏭" },
  { value: 48, suffix: "", label: "Départements couverts", icon: "🗺️" },
  { value: 320, suffix: "+", label: "Établissements partenaires", icon: "🎓" },
];
