import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FabLab, FabLabDB, SafetyLevel, StationDB } from "@/types";
import { safetyFromAirQualityValue } from "@/lib/air-quality";

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

export function safetyFromAirQualityAverage(airQualityAverage?: number | null): SafetyLevel {
  return safetyFromAirQualityValue(airQualityAverage);
}

function toFiniteNumber(value: StationDB["air_qualite"]): number | null {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export async function fetchAirQualityAverages(
  supabase: SupabaseClient,
  fablabIds: string[]
): Promise<Map<string, number>> {
  if (fablabIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("station")
    .select("fablab_id, air_qualite")
    .in("fablab_id", fablabIds);

  if (error) {
    console.error("[fetchAirQualityAverages]", error.message);
    return new Map();
  }

  const totals = new Map<string, { sum: number; count: number }>();
  for (const station of (data ?? []) as StationDB[]) {
    if (!station.fablab_id) continue;

    const airQuality = toFiniteNumber(station.air_qualite);
    if (airQuality === null) continue;

    const total = totals.get(station.fablab_id) ?? { sum: 0, count: 0 };
    total.sum += airQuality;
    total.count += 1;
    totals.set(station.fablab_id, total);
  }

  return new Map(
    [...totals.entries()].map(([fablabId, total]) => [
      fablabId,
      total.sum / total.count,
    ])
  );
}

/** Map a raw DB row to the normalised FabLab used in the UI */
export function dbToFabLab(db: FabLabDB, airQualityAverage?: number): FabLab {
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
    safety: safetyFromAirQualityAverage(airQualityAverage),
    air_quality_average: airQualityAverage,
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

  const fablabs = (data ?? []) as FabLabDB[];
  const airQualityAverages = await fetchAirQualityAverages(
    supabase as SupabaseClient,
    fablabs.map((fablab) => fablab.id)
  );

  return fablabs.map((fablab) => dbToFabLab(fablab, airQualityAverages.get(fablab.id)));
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

  const fablab = data as FabLabDB;
  const airQualityAverages = await fetchAirQualityAverages(supabase as SupabaseClient, [fablab.id]);
  return dbToFabLab(fablab, airQualityAverages.get(fablab.id));
}
