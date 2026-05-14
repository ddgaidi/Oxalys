"use client";

/*
 * Commentaires de structure : Affiche une section de confiance reutilisable.
 */
import { GraduationCap, Factory } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import type { FabLab } from "@/types";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  title?: string;
  fablabs?: FabLab[];
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function TrustedSection({
  title = "Ils nous font confiance",
  fablabs = [],
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionLabel = isDark ? "rgba(255,255,255,0.22)" : "#94a3b8";
  const cardBg       = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.82)";
  const cardBorder   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
  const cardShadow   = isDark ? "none"                   : "0 1px 8px rgba(0,0,0,0.04)";
  const nameColor    = isDark ? "rgba(255,255,255,0.5)"  : "#64748b";

  const items = fablabs.length > 0
    ? fablabs.map((f) => ({ id: f.id, name: f.name }))
    : [
        { id: "1", name: "École Polytechnique" },
        { id: "2", name: "INSA Lyon" },
        { id: "3", name: "Centrale Nantes" },
        { id: "4", name: "Université Paris-Saclay" },
        { id: "5", name: "IUT Douai" },
        { id: "6", name: "Mines ParisTech" },
      ];

  return (
    <section className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-center mb-10" style={{ color: sectionLabel }}>
          {title}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center gap-3 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}
              >
                {fablabs.length > 0 ? (
                  <Factory size={15} className="text-blue-500" />
                ) : (
                  <GraduationCap size={15} className="text-blue-500" />
                )}
              </div>
              <span className="font-medium text-sm truncate" style={{ color: nameColor }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
