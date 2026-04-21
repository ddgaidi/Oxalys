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
    safety: "safe",
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
    safety: "caution",
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
    safety: "safe",
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
    safety: "safe",
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
    safety: "caution",
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
    safety: "safe",
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
    safety: "safe",
    equipment: ["Impression 3D", "Découpe laser", "Découpe vinyle"],
    created_at: "2024-01-01",
  },
];

export const PLANS_DATA: Plan[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    monthly_price: 29,
    annual_price: 249,
    color: "#3b82f6",
    features: [
      "1 FabLab référencé & certifié",
      "Badge sécurité affiché (Safe / Caution / Danger)",
      "Page dédiée personnalisable",
      "Mises à jour mensuelles du statut",
      "Support email",
    ],
    missing: [
      "Analytics de consultation",
      "Multi-établissements",
      "API d'intégration",
      "Manager dédié",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly_price: 79,
    annual_price: 679,
    color: "#059669",
    featured: true,
    features: [
      "Jusqu'à 5 FabLabs référencés & certifiés",
      "Badge sécurité certifié prioritaire",
      "Pages dédiées personnalisables",
      "Mises à jour illimitées du statut",
      "Analytics de consultation",
      "Support prioritaire 5j/7",
    ],
    missing: [
      "Multi-établissements (campus)",
      "API d'intégration",
      "Manager dédié",
    ],
  },
  {
    id: "institution",
    name: "Institution",
    monthly_price: 199,
    annual_price: 1699,
    color: "#7c3aed",
    features: [
      "FabLabs illimités",
      "Badge sécurité certifié prioritaire",
      "Multi-établissements & campus",
      "Mises à jour illimitées du statut",
      "Analytics avancés & rapports PDF",
      "API d'intégration (SSO, ERP)",
      "Manager dédié & onboarding",
    ],
    missing: [],
  },
];

export const TRUSTED_ORGS = [
  "École Polytechnique",
  "INSA Lyon",
  "Centrale Nantes",
  "Université Paris-Saclay",
  "IUT Douai",
  "Mines ParisTech",
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
