"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

const LOCAL_KEY = "oxalys_favorites";
const MAX_FAVORITES = 5;

const hasSupabase =
  typeof process !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => {
    if (!hasSupabase) return null;
    try { return createClient(); } catch { return null; }
  }, []);

  useEffect(() => {
    async function load() {
      if (userId && supabase) {
        const { data } = await supabase
          .from("favorites")
          .select("fablab_id")
          .eq("user_id", userId);
        if (data) setFavorites(data.map((f: { fablab_id: string }) => f.fablab_id));
      } else {
        try {
          const stored = localStorage.getItem(LOCAL_KEY);
          if (stored) setFavorites(JSON.parse(stored));
        } catch {}
      }
      setLoading(false);
    }
    load();
  }, [userId, supabase]);

  async function toggleFavorite(fablabId: string) {
    const isFav = favorites.includes(fablabId);

    if (!isFav && favorites.length >= MAX_FAVORITES) {
      alert(`Maximum ${MAX_FAVORITES} favoris autorisés.`);
      return;
    }

    const next = isFav
      ? favorites.filter((id) => id !== fablabId)
      : [...favorites, fablabId];

    setFavorites(next);

    if (userId && supabase) {
      if (isFav) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("fablab_id", fablabId);
      } else {
        await supabase
          .from("favorites")
          .insert({ user_id: userId, fablab_id: fablabId });
      }
    } else {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      } catch {}
    }
  }

  return { favorites, toggleFavorite, loading };
}
