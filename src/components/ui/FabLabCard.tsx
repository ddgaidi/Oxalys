"use client";

/*
 * Commentaires de structure : Affiche une carte FabLab reutilisable avec favori et statut.
 */
import Image from "next/image";
import { Heart, MapPin, ChevronRight } from "lucide-react";
import type { FabLab } from "@/types";
import SafetyBadge from "./SafetyBadge";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  fablab: FabLab;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: () => void;
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function FabLabCard({
  fablab,
  isFavorite,
  onToggleFavorite,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`group card flex items-center gap-4 p-4 cursor-pointer transition-all duration-200
        hover:border-[var(--border-strong)] hover:shadow-md hover:shadow-black/5 hover:-translate-y-px
        ${isFavorite ? "border-blue-500/25 bg-blue-500/[0.03]" : ""}`}
    >
      {/* Avatar / Cover thumbnail */}
      <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden bg-[var(--bg-elevated)] flex items-center justify-center">
        {fablab.cover_url ? (
          <Image
            src={fablab.cover_url}
            alt={fablab.name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="font-display font-bold text-sm text-[var(--text-muted)]">
            {fablab.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-display font-semibold text-sm text-[var(--text)] truncate">
            {fablab.name}
          </h3>
          {isFavorite && (
            <span className="shrink-0 text-[10px] bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded-full font-semibold">
              Favori
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs mb-2">
          <MapPin size={11} className="shrink-0" />
          {fablab.city} · {fablab.zip_code}
        </div>
        <SafetyBadge level={fablab.safety} size="sm" />
      </div>

      {/* Right actions */}
      <div className="shrink-0 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(fablab.id);
          }}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
            ${isFavorite
              ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
              : "text-[var(--text-subtle)] hover:text-red-500 hover:bg-red-500/10"
            }`}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart size={15} className={isFavorite ? "fill-red-500" : ""} />
        </button>
        <ChevronRight size={16} className="text-[var(--text-subtle)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
