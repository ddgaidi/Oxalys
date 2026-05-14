"use client";

/*
 * Commentaires de structure : Affiche les chiffres cles avec animations et theming.
 */
import { useEffect, useRef, useState } from "react";
import { Building2, Map, GraduationCap } from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { useTheme } from "@/lib/context/ThemeContext";
import { KEY_STATS } from "@/lib/data";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const ICONS   = [Building2, Map, GraduationCap];
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const ACCENTS = [
  { color: "#3b82f6", glow: "rgba(59,130,246,0.25)",  pct: 82 },
  { color: "#10b981", glow: "rgba(16,185,129,0.25)",  pct: 67 },
  { color: "#8b5cf6", glow: "rgba(139,92,246,0.25)",  pct: 91 },
];

/* ── SVG progress ring ── */
const CIRCUMFERENCE = 2 * Math.PI * 40; // r=40
// Helper interne : isole une transformation ou une regle metier du rendu principal.
function Ring({ pct, color, trigger }: { pct: number; color: string; trigger: boolean }) {
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96" className="rotate-[-90deg]">
      <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
      <circle
        cx="48" cy="48" r="40" fill="none" stroke={color} strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={trigger ? offset : CIRCUMFERENCE}
        style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

/* ── Barres d'arrière-plan animées ── */
const BARS = Array.from({ length: 12 }, (_, i) => ({
  h: 25 + (i * 7 + 11) % 60,
  delay: (i * 0.15).toFixed(2),
}));

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function StatCard({
  index, label, value, suffix, trigger,
}: {
  index: number; label: string; value: number; suffix: string; trigger: boolean;
}) {
  const count = useCountUp(value, 2200, trigger);
  const Icon  = ICONS[index] ?? Building2;
  const { color, glow, pct } = ACCENTS[index] ?? ACCENTS[0];
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="relative overflow-hidden rounded-3xl flex flex-col items-center text-center px-8 py-10 transition-all duration-500 hover:scale-[1.03] group"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
        border: `1px solid ${isDark ? `rgba(${color === "#3b82f6" ? "59,130,246" : color === "#10b981" ? "16,185,129" : "139,92,246"},0.15)` : "rgba(0,0,0,0.07)"}`,
        boxShadow: `0 0 60px ${glow.replace("0.25", "0.0")}, 0 2px 20px rgba(0,0,0,${isDark ? "0.2" : "0.05"})`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 60px ${glow}, 0 8px 40px rgba(0,0,0,0.2)` }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 60px ${glow.replace("0.25", "0.0")}, 0 2px 20px rgba(0,0,0,${isDark ? "0.2" : "0.05"})` }}
    >
      {/* Barres d'ambiance */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-[2px] px-2 opacity-[0.06] pointer-events-none h-20">
        {BARS.map((b, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: trigger ? `${b.h}%` : "0%",
              background: color,
              transition: `height 1.6s cubic-bezier(0.16,1,0.3,1) ${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Top stripe */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      {/* Ring + icône */}
      <div className="relative mb-5">
        <Ring pct={pct} color={color} trigger={trigger} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
            <Icon size={18} style={{ color }} />
          </div>
        </div>
      </div>

      {/* Nombre */}
      <div
        className="font-display font-black leading-none mb-2 tabular-nums"
        style={{
          fontSize: "clamp(2.4rem,4vw,3.5rem)",
          background: `linear-gradient(135deg, ${color} 0%, white 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}
      >
        {count.toLocaleString("fr-FR")}{suffix}
      </div>

      {/* Label */}
      <p className="text-sm font-semibold uppercase tracking-widest"
        style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>
        {label}
      </p>
    </div>
  );
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
            style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#94a3b8" }}>
            En chiffres
          </p>
          <h2 className="font-display font-bold" style={{
            fontSize: "clamp(1.5rem,3vw,2.25rem)",
            background: "linear-gradient(135deg,#3b82f6 0%,#10b981 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Oxalys à l&apos;échelle nationale
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {KEY_STATS.map((s, i) => (
            <StatCard key={s.label} index={i} {...s} trigger={triggered} />
          ))}
        </div>
      </div>
    </section>
  );
}
