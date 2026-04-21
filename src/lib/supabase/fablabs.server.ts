import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbToFabLab } from "@/lib/supabase/fablabs";
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
  return (data as FabLabDB[]).map(dbToFabLab);
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
  return dbToFabLab(data as FabLabDB);
}
