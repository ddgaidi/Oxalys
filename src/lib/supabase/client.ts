/*
 * Commentaires de structure : Cree le client Supabase utilisable cote navigateur.
 */
import { createBrowserClient } from "@supabase/ssr";

// Fonction exportee : point d entree reutilisable par les pages ou composants.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
