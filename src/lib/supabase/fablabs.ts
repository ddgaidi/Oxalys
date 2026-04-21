import { createClient } from "@/lib/supabase/client";
import type { FabLab, FabLabDB } from "@/types";

/** Parse the `adresse` field: "City · ZipCode · Full address" */
function parseAdresse(adresse: string): {
  city: string;
  zip_code: string;
  address: string;
} {
  const parts = adresse.split(" · ").map((s) => s.trim());
  return {
    city: parts[0] ?? "",
    zip_code: parts[1] ?? "",
    address: parts[2] ?? "",
  };
}

/** Map a raw DB row to the normalised FabLab used in the UI */
export function dbToFabLab(db: FabLabDB): FabLab {
  const { city, zip_code, address } = parseAdresse(db.adresse);
  return {
    id: db.id,
    name: db.nom,
    slug: db.id,
    description: db.description,
    zip_code,
    city,
    address: address || undefined,
    cover_url: db.image ?? undefined,
    safety: "safe",
    equipment: db.equipements ?? [],
    website: db.lien ?? undefined,
    created_at: db.created_at,
  };
}

/** Fetch all fablabs — client-side only */
export async function fetchFabLabs(): Promise<FabLab[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fablab")
    .select("*")
    .order("nom", { ascending: true });

  if (error) {
    console.error("[fetchFabLabs]", error.message);
    return [];
  }
  return (data as FabLabDB[]).map(dbToFabLab);
}

/** Fetch a single fablab by UUID — client-side only */
export async function fetchFabLabById(id: string): Promise<FabLab | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("fablab")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return dbToFabLab(data as FabLabDB);
}
