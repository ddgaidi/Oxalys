// ── Supabase DB types ──────────────────────────────────────────────────────────

export type Gender = "homme" | "femme" | "non-binaire" | "non-precise";

export type SafetyLevel = "safe" | "caution" | "danger";

export interface Profile {
  id: string;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  created_at: string;
}

/** Raw row from the `fablab` table in Supabase */
export interface FabLabDB {
  id: string;
  nom: string;
  adresse: string;     // format: "City · ZipCode · Full address"
  description: string;
  equipements: string[];
  lien: string | null;
  image: string | null;
  created_at: string;
}

/** Normalised FabLab used throughout the UI */
export interface FabLab {
  id: string;
  name: string;
  slug: string;        // derived: UUID used as route param
  description: string;
  zip_code: string;
  city: string;
  address?: string;
  logo_url?: string;
  cover_url?: string;
  safety: SafetyLevel;
  equipment?: string[];
  website?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  fablab_id: string;
  created_at: string;
  fablab?: FabLab;
}

export interface Plan {
  id: string;
  name: string;
  monthly_price: number;
  annual_price: number;
  color: string;
  featured?: boolean;
  features: string[];
  missing: string[];
}

// ── Component props ─────────────────────────────────────────────────────────────

export interface SafetyBadgeProps {
  level: SafetyLevel;
  size?: "sm" | "md" | "lg";
}

export interface FabLabCardProps {
  fablab: FabLab;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}
