"use client";

/*
 * Commentaires de structure : Synchronise les favoris utilisateur avec Supabase et expose une API simple aux composants.
 */
import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const LOCAL_KEY    = "oxalys_favorites";
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const MAX_FAVORITES = 5;

const hasSupabase =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * useFavorites — gère les favoris pour les utilisateurs connectés (table favori)
 * et les invités (localStorage).
 *
 * memberId peut être passé explicitement OU le hook auto-détecte l'utilisateur
 * connecté via supabase.auth. Ainsi tous les composants qui appelaient
 * useFavorites(undefined) fonctionnent correctement.
 */
export function useFavorites(explicitMemberId?: string | null) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [memberId,  setMemberId]  = useState<string | null | undefined>(
    explicitMemberId === undefined ? undefined : explicitMemberId
  );

  // Garde une référence stable vers les favorites pour toggleFavorite
  const favRef = useRef<string[]>([]);
  favRef.current = favorites;

  const supabase = useMemo(() => {
    if (!hasSupabase) return null;
    try { return createClient(); } catch { return null; }
  }, []);

  /* ── 1. Résolution du memberId (explicite OU auth Supabase) ── */
  useEffect(() => {
    let cancelled = false;

    if (explicitMemberId !== undefined) {
      setMemberId(explicitMemberId);
      return;
    }

    if (!supabase) {
      setMemberId(null);
      return;
    }

    const client = supabase;

    async function resolveMemberId(authUserId?: string) {
      if (!authUserId) {
        if (!cancelled) setMemberId(null);
        return;
      }

      const { data } = await client
        .from("membre")
        .select("id")
        .eq("auth_id", authUserId)
        .maybeSingle();

      if (!cancelled) setMemberId((data?.id as string | undefined) ?? null);
    }

    // Lecture initiale
    supabase.auth.getUser().then(({ data }) => {
      void resolveMemberId(data.user?.id);
    });

    // Écoute les changements (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      void resolveMemberId(session?.user?.id);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [explicitMemberId, supabase]);

  /* ── 2. Chargement des favoris quand memberId est résolu ── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      if (memberId && supabase) {
        // Utilisateur connecté → lit la table favori
        const { data } = await supabase
          .from("favori")
          .select("fablab_id")
          .eq("membre_id", memberId)
          .order("position", { ascending: true })
          .order("created_at", { ascending: true });

        if (!cancelled) {
          setFavorites(((data ?? []) as { fablab_id: string }[]).map((row) => row.fablab_id));
        }
      } else if (memberId === undefined && explicitMemberId === undefined) {
        // memberId pas encore résolu (auth en cours) → on attend
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
  }, [memberId, explicitMemberId, supabase]);

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

    if (memberId && supabase) {
      const request = isFav
        ? supabase
            .from("favori")
            .delete()
            .eq("membre_id", memberId)
            .eq("fablab_id", fablabId)
        : supabase
            .from("favori")
            .insert({
              membre_id: memberId,
              fablab_id: fablabId,
              position: next.length,
            });

      const { error } = await request;

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
