"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const LOCAL_KEY    = "oxalys_favorites";
const MAX_FAVORITES = 5;

const hasSupabase =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * useFavorites — gère les favoris pour les utilisateurs connectés (etudiant.favoris)
 * et les invités (localStorage).
 *
 * userId peut être passé explicitement OU le hook auto-détecte l'utilisateur
 * connecté via supabase.auth. Ainsi tous les composants qui appelaient
 * useFavorites(undefined) fonctionnent correctement.
 */
export function useFavorites(explicitUserId?: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [userId,    setUserId]    = useState<string | undefined>(explicitUserId);

  // Garde une référence stable vers les favorites pour toggleFavorite
  const favRef = useRef<string[]>([]);
  favRef.current = favorites;

  const supabase = useMemo(() => {
    if (!hasSupabase) return null;
    try { return createClient(); } catch { return null; }
  }, []);

  /* ── 1. Résolution du userId (explicite OU auth Supabase) ── */
  useEffect(() => {
    if (explicitUserId !== undefined) {
      setUserId(explicitUserId);
      return;
    }
    if (!supabase) return;

    // Lecture initiale
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? undefined);
    });

    // Écoute les changements (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? undefined);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [explicitUserId]);

  /* ── 2. Chargement des favoris quand userId est résolu ── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      if (userId && supabase) {
        // Utilisateur connecté → lit etudiant.favoris
        const { data } = await supabase
          .from("etudiant")
          .select("favoris")
          .eq("id", userId)
          .single();

        if (!cancelled) setFavorites((data?.favoris as string[]) ?? []);
      } else if (userId === undefined && explicitUserId === undefined) {
        // userId pas encore résolu (auth en cours) → on attend
        return;
      } else {
        // Invité → localStorage
        try {
          const stored = localStorage.getItem(LOCAL_KEY);
          if (!cancelled) setFavorites(stored ? JSON.parse(stored) : []);
        } catch {
          if (!cancelled) setFavorites([]);
        }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  /* ── 3. Toggle ── */
  async function toggleFavorite(fablabId: string) {
    const current = favRef.current;
    const isFav   = current.includes(fablabId);

    if (!isFav && current.length >= MAX_FAVORITES) {
      alert(`Maximum ${MAX_FAVORITES} favoris autorisés.`);
      return;
    }

    const next = isFav
      ? current.filter((id) => id !== fablabId)
      : [...current, fablabId];

    setFavorites(next); // mise à jour optimiste

    if (userId && supabase) {
      const { error } = await supabase
        .from("etudiant")
        .update({ favoris: next })
        .eq("id", userId);

      if (error) {
        console.error("[useFavorites] update error:", error.message);
        setFavorites(current); // rollback
      }
    } else {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      } catch {}
    }
  }

  return { favorites, toggleFavorite, loading };
}
