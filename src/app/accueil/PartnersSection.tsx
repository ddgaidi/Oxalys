"use client";

/*
 * Commentaires de structure : Affiche les partenaires et signaux de confiance.
 */
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/context/ThemeContext";
import { fetchFabLabs } from "@/lib/supabase/fablabs";

/* ── Entreprises tech/industrie figées ── */
const TECH_COMPANIES = [
  "Microsoft", "Google", "OVH", "Thales", "Siemens",
  "STMicroelectronics", "Orange", "Capgemini", "Atos",
  "Dassault Systèmes", "Schneider Electric", "Airbus",
  "Renault Group", "Safran", "Legrand", "Valeo",
  "Alstom", "Bull", "Sopra Steria", "Ubisoft",
];

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const ACCENT_COLORS = ["#3b82f6","#10b981","#8b5cf6","#f59e0b","#ec4899","#06b6d4","#f97316","#84cc16"];

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function PillRow({
  items,
  direction,
  speed,
  isDark,
}: {
  items: string[];
  direction: "left" | "right";
  speed: number;
  isDark: boolean;
}) {
  const doubled = [...items, ...items];
  const pillBg     = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)";
  const pillBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const pillColor  = isDark ? "rgba(255,255,255,0.45)" : "#475569";
  const pillShadow = isDark ? "none" : "0 1px 8px rgba(0,0,0,0.05)";

  return (
    <div className="flex gap-3 overflow-hidden mb-3">
      <div
        className="flex gap-3 shrink-0"
        style={{
          animation: `${direction === "left" ? "marqueeLeft" : "marqueeRight"} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => {
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
          return (
            <div
              key={`${direction}-${i}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl shrink-0 cursor-default transition-all duration-200 hover:scale-105"
              style={{
                background: pillBg,
                border: `1px solid ${pillBorder}`,
                boxShadow: pillShadow,
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = `1px solid ${color}45`;
                e.currentTarget.style.boxShadow = `0 0 22px ${color}22, 0 4px 16px rgba(0,0,0,0.1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = `1px solid ${pillBorder}`;
                e.currentTarget.style.boxShadow = pillShadow;
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: color, boxShadow: `0 0 6px ${color}90` }}
              />
              <span className="text-sm font-semibold whitespace-nowrap" style={{ color: pillColor }}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function PartnersSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [fabLabNames, setFabLabNames] = useState<string[]>([]);

  useEffect(() => {
    fetchFabLabs().then((labs) => {
      if (labs.length > 0) setFabLabNames(labs.map((l) => l.name));
    });
  }, []);

  /* Rangée 1 : fablabs de la DB (ou fallback) */
  const row1 = fabLabNames.length > 0 ? fabLabNames : [
    "Sorbonne Université","Université Paris-Saclay","INSA Lyon","Centrale Nantes",
    "Université de Lille","École Polytechnique","Université de Bordeaux","Paris Cité",
  ];

  /* Rangée 2 : entreprises tech */
  const row2 = TECH_COMPANIES;

  /* Rangée 3 : mix partiels */
  const row3 = [
    ...fabLabNames.slice(0, Math.ceil(fabLabNames.length / 2)),
    ...TECH_COMPANIES.slice(0, 8),
  ];

  const totalCount = row1.length + row2.length;

  return (
    <section className="py-20 overflow-hidden">

      {/* Header */}
      <div className="px-5 text-center mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-4"
          style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#94a3b8" }}>
          Partenaires & Universités
        </p>
        <h2
          className="font-display font-bold mb-3"
          style={{
            fontSize: "clamp(1.5rem,2.5vw,2.1rem)",
            color: isDark ? "#ffffff" : "#0f172a",
          }}
        >
          Ils nous font{" "}
          <span style={{
            background: "linear-gradient(135deg,#3b82f6 0%,#10b981 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            confiance
          </span>
        </h2>
        <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "#94a3b8" }}>
          Universités, grandes écoles et entreprises technologiques qui équipent leurs espaces
        </p>
      </div>

      {/* Marquees */}
      <div className="relative">
        {/* Fondu latéral */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${isDark ? "#080c18" : "#f0f4ff"}, transparent)` }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${isDark ? "#080c18" : "#f0f4ff"}, transparent)` }} />

        {/* Rangée 1 — fablabs DB → gauche */}
        <PillRow items={row1} direction="left"  speed={28} isDark={isDark} />

        {/* Rangée 2 — entreprises tech → droite */}
        <PillRow items={row2} direction="right" speed={22} isDark={isDark} />

        {/* Rangée 3 — mix → gauche (vitesse lente) */}
        {row3.length > 0 && (
          <PillRow items={row3} direction="left" speed={36} isDark={isDark} />
        )}
      </div>

      {/* Footer */}
      <div className="px-5 text-center mt-8">
        <p className="text-xs font-medium" style={{ color: isDark ? "rgba(255,255,255,0.18)" : "#94a3b8" }}>
          {totalCount}+ partenaires · réseau en pleine expansion
        </p>
      </div>
    </section>
  );
}
