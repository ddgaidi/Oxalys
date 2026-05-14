/*
 * Commentaires de structure : Contient les fonctions serveur pour recuperer les FabLabs depuis les composants RSC.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbToFabLab, fetchAirQualityAverages } from "@/lib/supabase/fablabs";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FabLab, FabLabDB } from "@/types";

/** Fetch all fablabs — server-side (RSC only) */
export async function fetchFabLabsServer(): Promise<FabLab[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("fablab")
    .select("*")
    .order("nom", { ascending: true });

  if (error) {
    console.error("[fetchFabLabsServer]", error.message);
    return [];
  }

  const fablabs = (data ?? []) as FabLabDB[];
  const airQualityAverages = await fetchAirQualityAverages(
    supabase as SupabaseClient,
    fablabs.map((fablab) => fablab.id)
  );

  return fablabs.map((fablab) => dbToFabLab(fablab, airQualityAverages.get(fablab.id)));
}

/** Fetch 6 random fablabs - server-side (RSC only) */
export async function fetchRandomFabLabsServer(limit: number = 6): Promise<FabLab[]> {
  const supabase = await createServerSupabaseClient();
  
  // Note: Standard Supabase/Postgrest doesn't have a direct "order by random()" 
  // without using RPC. A simple workaround for small datasets is to fetch more and shuffle,
  // or use a custom query if allowed. 
  // Here we'll try to use a trick: select with a random-ish offset or just fetch all and shuffle.
  // Given it's likely a small-to-medium table, fetching names is fine.
  
  const { data, error } = await supabase
    .from("fablab")
    .select("*");

  if (error || !data) {
    console.error("[fetchRandomFabLabsServer]", error?.message);
    return [];
  }

  const shuffled = [...(data as FabLabDB[])].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);
  const airQualityAverages = await fetchAirQualityAverages(
    supabase as SupabaseClient,
    selected.map((fablab) => fablab.id)
  );

  return selected.map((fablab) => dbToFabLab(fablab, airQualityAverages.get(fablab.id)));
}

/** Fetch a single fablab by UUID — server-side (RSC only) */
export async function fetchFabLabByIdServer(id: string): Promise<FabLab | null> {
  const supabase = await createServerSupabaseClient();
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
