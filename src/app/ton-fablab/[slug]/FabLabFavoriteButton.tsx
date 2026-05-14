"use client";

/*
 * Commentaires de structure : Gere le bouton favori dans la fiche detail FabLab.
 */
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  fablabId: string;
  isDark: boolean;
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function FabLabFavoriteButton({ fablabId, isDark }: Props) {
  const { favorites, toggleFavorite } = useFavorites(undefined);
  const isFav = favorites.includes(fablabId);

  return (
    <button
      onClick={() => toggleFavorite(fablabId)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
      style={{
        background: isFav
          ? "rgba(239,68,68,0.18)"
          : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
        border: `1px solid ${isFav
          ? "rgba(239,68,68,0.45)"
          : isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.09)"}`,
        color: isFav
          ? "#ef4444"
          : isDark ? "rgba(255,255,255,0.65)" : "#64748b",
        boxShadow: isFav ? "0 0 16px rgba(239,68,68,0.2)" : "none",
      }}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        size={15}
        style={{
          fill: isFav ? "#ef4444" : "none",
          color: isFav ? "#ef4444" : isDark ? "rgba(255,255,255,0.65)" : "#64748b",
        }}
      />
      {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    </button>
  );
}
