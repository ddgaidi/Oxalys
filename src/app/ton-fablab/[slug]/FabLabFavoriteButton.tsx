"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";

export default function FabLabFavoriteButton({ fablabId }: { fablabId: string }) {
  const { favorites, toggleFavorite } = useFavorites(undefined);
  const isFav = favorites.includes(fablabId);

  return (
    <button
      onClick={() => toggleFavorite(fablabId)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
        ${isFav
          ? "text-red-500 bg-red-500/8 border-red-500/25 hover:bg-red-500/15"
          : "text-[var(--text-muted)] border-[var(--border-strong)] hover:text-red-500 hover:border-red-500/25 hover:bg-red-500/8"
        }`}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart size={16} className={isFav ? "fill-red-500" : ""} />
      {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
