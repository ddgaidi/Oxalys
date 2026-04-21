"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import FabLabCard from "@/components/ui/FabLabCard";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { fetchFabLabs } from "@/lib/supabase/fablabs";
import type { FabLab } from "@/types";

export default function TonFabLabPage() {
  const [query, setQuery] = useState("");
  const [fablabs, setFablabs] = useState<FabLab[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { favorites, toggleFavorite } = useFavorites(undefined);

  useEffect(() => {
    fetchFabLabs()
      .then(setFablabs)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return fablabs;
    return fablabs.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.zip_code.includes(q) ||
        f.city.toLowerCase().includes(q)
    );
  }, [query, fablabs]);

  const sorted = useMemo(() => [
    ...filtered.filter((f) => favorites.includes(f.id)),
    ...filtered.filter((f) => !favorites.includes(f.id)),
  ], [filtered, favorites]);

  return (
    <div className="max-w-2xl mx-auto px-5 py-16">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-[0.18em] mb-2">
          Ton FabLab
        </p>
        <h1 className="font-display font-bold text-[clamp(1.6rem,3.5vw,2.25rem)] tracking-tight mb-2">
          Trouve ton{" "}
          <span className="text-gradient">espace de création</span>
        </h1>
        <p className="text-[var(--text-muted)] text-sm">
          {loading
            ? "Chargement des FabLabs…"
            : `${fablabs.length} FabLab${fablabs.length !== 1 ? "s" : ""} référencé${fablabs.length !== 1 ? "s" : ""} · Recherche par nom, ville ou code postal`}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom, ville ou code postal..."
          className="input-brand pl-10 pr-10"
          disabled={loading}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-subtle)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
          aria-label="Filtres"
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-[var(--text-muted)]">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Chargement des FabLabs…</span>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Favorites label */}
          {favorites.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
                Favoris en premier
              </span>
              <span className="w-4 h-px bg-[var(--border-strong)]" />
            </div>
          )}

          {/* Results count when filtering */}
          {query && (
            <p className="text-xs text-[var(--text-subtle)] mb-4">
              {sorted.length} résultat{sorted.length !== 1 ? "s" : ""} pour &ldquo;{query}&rdquo;
            </p>
          )}

          {/* List */}
          <div className="flex flex-col gap-2">
            {sorted.map((fablab) => (
              <FabLabCard
                key={fablab.id}
                fablab={fablab}
                isFavorite={favorites.includes(fablab.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => router.push(`/ton-fablab/${fablab.slug}`)}
              />
            ))}

            {sorted.length === 0 && (
              <div className="card text-center py-16 px-6">
                <Search size={32} className="text-[var(--text-subtle)] mx-auto mb-4" />
                <p className="font-display font-semibold text-[var(--text)] mb-1">
                  Aucun résultat
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  Aucun FabLab ne correspond à &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Guest hint */}
          <p className="text-[var(--text-subtle)] text-xs text-center mt-8">
            Connectez-vous pour synchroniser vos favoris entre appareils (max 5)
          </p>
        </>
      )}
    </div>
  );
}
