/*
 * Commentaires de structure : Contient les fonctions client pour recuperer et normaliser les FabLabs depuis Supabase.
 */
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FabLab, FabLabDB, SafetyLevel, StationDB } from "@/types";
import { safetyFromAirQualityValue } from "@/lib/air-quality";

type StationSummary = {
  airQualityAverage?: number;
  maintenanceActive: boolean;
};

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

// Fonction exportee : point d entree reutilisable par les pages ou composants.
export function safetyFromAirQualityAverage(airQualityAverage?: number | null): SafetyLevel {
  return safetyFromAirQualityValue(airQualityAverage);
}

function safetyFromStationSummary(summary?: StationSummary): SafetyLevel {
  if (summary?.maintenanceActive) return "maintenance";
  return safetyFromAirQualityAverage(summary?.airQualityAverage);
}

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function toFiniteNumber(value: StationDB["air_qualite"]): number | null {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function isStationOffline(station: StationDB): boolean {
  return (
    !station.last_seen_at ||
    Date.now() - new Date(station.last_seen_at).getTime() > 10000
  );
}

// Fonction exportee : point d entree reutilisable par les pages ou composants.
export async function fetchStationSummaries(
  supabase: SupabaseClient,
  fablabIds: string[]
): Promise<Map<string, StationSummary>> {
  if (fablabIds.length === 0) return new Map();

  const { data, error } = await supabase
    .from("station")
    .select("fablab_id, air_qualite, maintenance_active, last_seen_at")
    .in("fablab_id", fablabIds);

  if (error) {
    console.error("[fetchStationSummaries]", error.message);
    return new Map();
  }

  const totals = new Map<string, { sum: number; count: number; maintenanceActive: boolean }>();
  for (const station of (data ?? []) as StationDB[]) {
    if (!station.fablab_id) continue;

    const total = totals.get(station.fablab_id) ?? { sum: 0, count: 0, maintenanceActive: false };
    total.maintenanceActive = total.maintenanceActive || station.maintenance_active === true;
    totals.set(station.fablab_id, total);

    if (isStationOffline(station)) continue;

    const airQuality = toFiniteNumber(station.air_qualite);
    if (airQuality === null) continue;

    total.sum += airQuality;
    total.count += 1;
  }

  return new Map(
    [...totals.entries()].map(([fablabId, total]) => [
      fablabId,
      {
        airQualityAverage: total.count > 0 ? total.sum / total.count : undefined,
        maintenanceActive: total.maintenanceActive,
      },
    ])
  );
}

/** Map a raw DB row to the normalised FabLab used in the UI */
export function dbToFabLab(db: FabLabDB, stationSummary?: StationSummary): FabLab {
  const { city, zip_code, address } = parseAdresse(db.adresse);
  const airQualityAverage = stationSummary?.airQualityAverage;
  return {
    id: db.id,
    name: db.nom,
    slug: db.id,
    description: db.description,
    zip_code,
    city,
    address: address || undefined,
    cover_url: db.image ?? undefined,
    safety: safetyFromStationSummary(stationSummary),
    air_quality_average: airQualityAverage,
    maintenance_active: stationSummary?.maintenanceActive ?? false,
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
  const stationSummaries = await fetchStationSummaries(
    supabase as SupabaseClient,
    fablabs.map((fablab) => fablab.id)
  );

  return fablabs.map((fablab) => dbToFabLab(fablab, stationSummaries.get(fablab.id)));
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
  const stationSummaries = await fetchStationSummaries(supabase as SupabaseClient, [fablab.id]);
  return dbToFabLab(fablab, stationSummaries.get(fablab.id));
}
