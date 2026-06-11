"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CircuitBoard,
  Cpu,
  GraduationCap,
  Map,
  Monitor,
  Shield,
  Target,
  Telescope,
  Thermometer,
  Users2,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { useTheme } from "@/lib/context/ThemeContext";
import { fetchFabLabs } from "@/lib/supabase/fablabs";
import { KEY_STATS } from "@/lib/data";

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="relative"
      style={{
        background: isDark
          ? "linear-gradient(160deg, #080c18 0%, #0a0f1e 40%, #06111a 100%)"
          : "linear-gradient(160deg, #f0f4ff 0%, #f8faff 40%, #eef6f2 100%)",
      }}
    >
      {/* Fixed dot grid shared by all sections */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.07)"} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative z-10">
        <HeroSection />
        <StatsSection />
        <StationSection />
        <TechnologiesSection />
        <PartnersSection />
        <AboutSection />
      </div>
    </div>
  );
}

/* ── Capteurs simulés ── */
const SENSORS = [
  { icon: Wind,        label: "CO₂",        value: "412",  unit: "ppm",   ok: true },
  { icon: Activity,    label: "COV",         value: "0.08", unit: "mg/m³", ok: true },
  { icon: Shield,      label: "PM2.5",       value: "12",   unit: "μg/m³", ok: true },
  { icon: Thermometer, label: "Température", value: "21.4", unit: "°C",    ok: true },
  { icon: Wifi,        label: "Station",     value: "LIVE", unit: "",      ok: true },
];

/* Flottaisons : un tableau de paramètres statiques pour éviter l'hydration mismatch */
const PARTICLE_PARAMS = [
  { s:2, t:"8%",  l:"12%", d:"0s",    dur:"5s",  o:0.07 },
  { s:3, t:"22%", l:"88%", d:"0.4s",  dur:"6s",  o:0.05 },
  { s:2, t:"65%", l:"5%",  d:"1s",    dur:"5.5s",o:0.08 },
  { s:4, t:"78%", l:"72%", d:"0.7s",  dur:"7s",  o:0.06 },
  { s:2, t:"42%", l:"55%", d:"1.5s",  dur:"4.5s",o:0.04 },
  { s:3, t:"15%", l:"45%", d:"2s",    dur:"6.5s",o:0.06 },
  { s:2, t:"90%", l:"30%", d:"0.2s",  dur:"5s",  o:0.05 },
  { s:4, t:"35%", l:"92%", d:"1.2s",  dur:"7.5s",o:0.07 },
  { s:2, t:"55%", l:"20%", d:"0.9s",  dur:"4s",  o:0.05 },
  { s:3, t:"72%", l:"50%", d:"1.8s",  dur:"6s",  o:0.04 },
  { s:2, t:"5%",  l:"70%", d:"0.3s",  dur:"5.5s",o:0.06 },
  { s:3, t:"48%", l:"78%", d:"2.5s",  dur:"7s",  o:0.05 },
];
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const PARTICLE_COLORS = ["#3b82f6","#10b981","#8b5cf6"];

/* Positions orbitales fixes (calculées une seule fois, pas au render) */
const ORBIT_POSITIONS = SENSORS.map((_, i) => {
  const angle = (i / SENSORS.length) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * 170,
    y: Math.sin(angle) * 145,
    floatAnim: ["animate-sensor-a","animate-sensor-b","animate-sensor-c","animate-sensor-b","animate-sensor-a"][i],
    delay:     ["0s","0.5s","1s","1.5s","2s"][i],
  };
});

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const WORDS = ["Protégez", "vos", "espaces", "de création"];

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tickerNames, setTickerNames] = useState<string[]>([]);

  useEffect(() => {
    fetchFabLabs().then((labs) => {
      if (labs.length > 0) setTickerNames(labs.map((l) => l.name));
    });
  }, []);

  const textColor        = isDark ? "#ffffff"               : "#0f172a";
  const subColor         = isDark ? "rgba(255,255,255,0.55)" : "#64748b";
  const cardBg           = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.82)";
  const cardBorder       = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const outlineBtnBg     = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.85)";
  const outlineBtnBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const tickerBg         = isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)";
  const tickerBorder     = isDark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.07)";
  const tickerColor      = isDark ? "rgba(255,255,255,0.3)"   : "#94a3b8";
  const hubBg            = isDark
    ? "radial-gradient(circle,rgba(59,130,246,0.2),rgba(16,185,129,0.08))"
    : "radial-gradient(circle,rgba(59,130,246,0.12),rgba(16,185,129,0.05))";

  const displayTicker = tickerNames.length > 0 ? tickerNames : [
    "Université de Lille","Université de Lyon","Sorbonne Université",
    "Paris-Saclay","INSA Lyon","Grenoble INP","Université de Bordeaux",
    "Paris Cité","CY Cergy","Université de Nantes",
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-5 pb-16 pt-24">

      {/* ── Fond ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full blur-[130px] animate-pulse-glow"
          style={{ background: isDark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.06)" }} />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full blur-[110px] animate-pulse-glow"
          style={{ background: isDark ? "rgba(16,185,129,0.07)" : "rgba(16,185,129,0.04)", animationDelay: "2s" }} />
        <div className="absolute top-2/3 left-1/2 w-[300px] h-[200px] rounded-full blur-[90px] animate-pulse-glow"
          style={{ background: isDark ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.03)", animationDelay: "4s" }} />
        {/* Particules */}
        {PARTICLE_PARAMS.map((p, i) => (
          <div key={i}
            className="absolute rounded-full"
            style={{
              width: p.s, height: p.s, top: p.t, left: p.l, opacity: p.o,
              background: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
              animation: `sensorFloat ${p.dur} ease-in-out ${p.d} infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Contenu ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* ══ Gauche ══ */}
        <div>
          {/* Badge live */}
          <div
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-10 text-sm font-semibold animate-fade-in-up"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, color: "#60a5fa" }}
          >
            <span className="w-2 h-2 rounded-full animate-dot-pulse"
              style={{ background: "#10b981", boxShadow: "0 0 8px #10b981" }} />
            Surveillance en temps réel
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
              LIVE
            </span>
          </div>

          {/* Titre avec reveal par mot */}
          <h1
            className="font-display font-black tracking-[-0.03em] leading-[1.0] mb-7"
            style={{ fontSize: "clamp(2.8rem,6vw,5rem)" }}
          >
            {WORDS.map((word, i) => (
              <span
                key={word}
                className="inline-block mr-[0.25em] animate-word-reveal"
                style={{ animationDelay: `${i * 0.13}s`, opacity: 0, color: textColor }}
              >
                {i === 2 ? (
                  <span style={{
                    background: "linear-gradient(135deg,#3b82f6 0%,#10b981 60%,#8b5cf6 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    {word}
                  </span>
                ) : word}
              </span>
            ))}
          </h1>

          {/* Sous-titre */}
          <p
            className="max-w-xl leading-relaxed mb-10 animate-word-reveal"
            style={{ fontSize: "clamp(1rem,1.8vw,1.1rem)", color: subColor, animationDelay: "0.55s", opacity: 0 }}
          >
            Oxalys surveille la qualité de l&apos;air dans chaque FabLab universitaire —
            CO₂, COV, PM2.5 — et prévient étudiants et enseignants{" "}
            <strong style={{ color: isDark ? "rgba(255,255,255,0.8)" : "#374151" }}>avant</strong>{" "}
            qu&apos;ils entrent dans l&apos;espace.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap mb-12 animate-word-reveal" style={{ animationDelay: "0.66s", opacity: 0 }}>
            <Link
              href="/ton-fablab"
              className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-base text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#2563eb 0%,#059669 100%)",
                boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
              }}
            >
              Explorer les FabLabs
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-base transition-all duration-200 hover:scale-105"
              style={{
                background: outlineBtnBg, border: `1px solid ${outlineBtnBorder}`,
                color: isDark ? "rgba(255,255,255,0.75)" : "#374151",
              }}
            >
              Créer un compte
            </Link>
          </div>

          {/* Mini stats */}
          <div className="flex items-center gap-5 flex-wrap animate-word-reveal" style={{ animationDelay: "0.78s", opacity: 0 }}>
            {[
              { v: "20+",   l: "Universités" },
              { v: "100%",  l: "Temps réel" },
              { v: "5",     l: "Capteurs/station" },
            ].map(({ v, l }) => (
              <div key={l} className="flex items-center gap-1.5 text-sm">
                <span className="font-display font-bold" style={{
                  background: "linear-gradient(90deg,#3b82f6,#10b981)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>
                  {v}
                </span>
                <span style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Droite : dashboard flottant ══ */}
        <div className="hidden lg:block relative" style={{ height: "460px" }}>

          {/* Hub central */}
          <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            {/* Rings ping */}
            {[1,2,3].map((i) => (
              <div key={i}
                className="absolute rounded-full animate-hub-ping pointer-events-none"
                style={{
                  inset: `-${i * 26}px`,
                  border: `1px solid rgba(59,130,246,${0.3 / i})`,
                  animationDelay: `${i * 0.65}s`,
                }} />
            ))}
            {/* Core */}
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: hubBg,
                border: "1px solid rgba(59,130,246,0.45)",
                boxShadow: "0 0 40px rgba(59,130,246,0.25)",
              }}>
              <Shield size={28} style={{ color: "#3b82f6" }} />
            </div>
          </div>

          {/* ── Cartes capteurs : outer = position, inner = float ── */}
          {SENSORS.map((s, i) => {
            const { x, y, floatAnim, delay } = ORBIT_POSITIONS[i];
            return (
              /* Outer div : gère uniquement la position orbitale */
              <div
                key={s.label}
                className="absolute"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  zIndex: 10,
                }}
              >
                {/* Inner div : gère uniquement l'animation de flottaison */}
                <div className={floatAnim} style={{ animationDelay: delay }}>
                  <div
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl whitespace-nowrap"
                    style={{
                      background: isDark ? "rgba(8,12,26,0.88)" : "rgba(255,255,255,0.92)",
                      border: `1px solid ${s.ok ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
                      boxShadow: `0 4px 24px ${s.ok ? "rgba(16,185,129,0.18)" : "rgba(239,68,68,0.18)"}, 0 2px 8px rgba(0,0,0,0.15)`,
                      backdropFilter: "blur(14px)",
                    }}
                  >
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)" }}>
                      <s.icon size={13} style={{ color: s.ok ? "#10b981" : "#ef4444" }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider leading-none"
                        style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>
                        {s.label}
                      </p>
                      <p className="text-sm font-bold leading-tight mt-0.5" style={{ color: s.ok ? "#10b981" : "#ef4444" }}>
                        {s.value}
                        {s.unit && (
                          <span className="text-[9px] font-medium ml-0.5"
                            style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#94a3b8" }}>
                            {s.unit}
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-dot-pulse"
                      style={{ background: s.ok ? "#10b981" : "#ef4444", boxShadow: `0 0 5px ${s.ok ? "#10b981" : "#ef4444"}` }} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Lignes de connexion SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: isDark ? 0.1 : 0.06 }}
          >
            {ORBIT_POSITIONS.map(({ x, y }, i) => (
              <line key={i}
                x1="50%" y1="50%"
                x2={`calc(50% + ${x}px)`}
                y2={`calc(50% + ${y}px)`}
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="4 5"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* ── Ticker universités (données DB) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden"
        style={{ background: tickerBg, borderTop: `1px solid ${tickerBorder}` }}
      >
        <div className="flex animate-ticker" style={{ width: "max-content" }}>
          {[...displayTicker, ...displayTicker].map((name, i) => (
            <span
              key={i}
              className="flex items-center gap-2.5 px-6 text-xs font-semibold whitespace-nowrap shrink-0"
              style={{ color: tickerColor }}
            >
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#3b82f6", opacity: 0.5 }} />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

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
function StatsSection() {
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

const TECHNOLOGY_TABS = [
  {
    id: "oxalys",
    label: "Oxalys",
    color: "#3b82f6",
    items: ["Next.js", "React", "TypeScript", "TailwindCSS", "Supabase Auth", "Stripe Checkout"],
  },
  {
    id: "teach",
    label: "OxalysTeach",
    color: "#f97316",
    items: ["Next.js", "React", "Framer Motion", "Recharts", "Supabase", "Role based access"],
  },
  {
    id: "monitor",
    label: "OxalysMonitor",
    color: "#8b5cf6",
    items: ["Next.js", "React", "Three.js", "@react-three/fiber", "@react-three/drei", "Supabase Realtime"],
  },
] as const;

function TechnologiesSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState<(typeof TECHNOLOGY_TABS)[number]["id"]>("oxalys");
  const current = TECHNOLOGY_TABS.find((tab) => tab.id === active) ?? TECHNOLOGY_TABS[0];
  const panelBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.82)";
  const panelBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = isDark ? "#ffffff" : "#0f172a";
  const muted = isDark ? "rgba(255,255,255,0.48)" : "#64748b";

  return (
    <section className="py-20 px-5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: current.color }}>
            Stack technique
          </p>
          <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", color: textColor }}>
            Technologies utilisees
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TECHNOLOGY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className="rounded-xl px-4 py-2 text-sm font-bold transition-all"
              style={{
                background: active === tab.id ? `${tab.color}22` : panelBg,
                border: `1px solid ${active === tab.id ? `${tab.color}66` : panelBorder}`,
                color: active === tab.id ? tab.color : muted,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ background: panelBg, border: `1px solid ${panelBorder}` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {current.items.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)", border: `1px solid ${current.color}24` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: current.color, boxShadow: `0 0 8px ${current.color}` }} />
                <span className="text-sm font-semibold" style={{ color: textColor }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const r = 35; // pentagon radius as % of container (slightly inset so all nodes stay in view)
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const CX = 50;
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const CY = 50;

/** viewBox 0–100: start past hub glow (~72px ⌀), end just inside card face */
const HUB_LINE_INSET = 8;
// Configuration locale qui pilote le rendu ou le comportement de ce module.
const NODE_LINE_INSET = 2.5;

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function toPos(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: +(CX + r * Math.sin(rad)).toFixed(2),
    y: +(CY - r * Math.cos(rad)).toFixed(2),
  };
}

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function lineEndpoints(angleDeg: number) {
  const pos = toPos(angleDeg);
  const dx = pos.x - CX;
  const dy = pos.y - CY;
  const L = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / L;
  const uy = dy / L;
  return {
    x1: +(CX + ux * HUB_LINE_INSET).toFixed(2),
    y1: +(CY + uy * HUB_LINE_INSET).toFixed(2),
    x2: +(pos.x - ux * NODE_LINE_INSET).toFixed(2),
    y2: +(pos.y - uy * NODE_LINE_INSET).toFixed(2),
  };
}

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const FLOAT_CLASSES = [
  "node-float-a",
  "node-float-b",
  "node-float-c", // sensorHeartbeat
  "node-float-d",
  "node-float-e",
];

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const COMPS = [
  {
    id: "rpi",
    name: "Raspberry Pi",
    role: "Cerveau de la station",
    desc: "Centralise toutes les mesures des capteurs et les transmet en temps réel au dashboard professeur via le réseau de l'établissement.",
    color: "#f97316",
    dimColor: "rgba(249,115,22,0.15)",
    icon: Cpu,
    angle: 0,
    critical: false,
    tag: null as string | null,
  },
  {
    id: "esp32",
    name: "ESP32",
    role: "Module WiFi / Bluetooth",
    desc: "Micro-contrôleur ultra-basse consommation qui assure la transmission sans fil des données entre les capteurs et le Raspberry Pi.",
    color: "#3b82f6",
    dimColor: "rgba(59,130,246,0.15)",
    icon: Wifi,
    angle: 72,
    critical: false,
    tag: null as string | null,
  },
  {
    id: "sensor",
    name: "Capteur qualité d'air",
    role: "Pièce maîtresse",
    desc: "Mesure en continu COV, CO₂, particules fines PM2.5, température et humidité. En cas de défaillance, le dashboard alerte en temps réel et un technicien est automatiquement dispatché.",
    color: "#10b981",
    dimColor: "rgba(16,185,129,0.15)",
    icon: Wind,
    angle: 144,
    critical: true,
    tag: "Critique" as string | null,
  },
  {
    id: "lcd",
    name: "Écran LCD Tactile",
    role: "Interface locale",
    desc: "Affiche en direct toutes les valeurs du capteur. Placé à l'entrée du FabLab, il permet aux étudiants de consulter la qualité de l'air avant d'entrer.",
    color: "#8b5cf6",
    dimColor: "rgba(139,92,246,0.15)",
    icon: Monitor,
    angle: 216,
    critical: false,
    tag: null as string | null,
  },
  {
    id: "arduino",
    name: "Arduino UNO",
    role: "Contrôleur d'affichage",
    desc: "Orchestre l'affichage de l'écran LCD tactile et sert de passerelle entre l'interface locale et le Raspberry Pi central.",
    color: "#06b6d4",
    dimColor: "rgba(6,182,212,0.15)",
    icon: CircuitBoard,
    angle: 288,
    critical: false,
    tag: null as string | null,
  },
];

/* ── Component ───────────────────────────────────────────────────────────── */

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
function StationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [activeId, setActiveId] = useState<string>("rpi");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const activeComp = COMPS.find((c) => c.id === activeId) ?? COMPS[0];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-5 overflow-x-hidden overflow-y-visible"
      style={{
        background: isDark
          ? "linear-gradient(180deg, #050810 0%, #060c18 100%)"
          : "linear-gradient(180deg, #f0f4ff 0%, #e8f0fe 100%)",
      }}
    >
      {/* ── Circuit grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Ambient blobs ── */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(59,130,246,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none animate-pulse-glow"
        style={{
          background: isDark
            ? "radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)",
          animationDelay: "2s",
        }}
      />

      {/* ── Section header ── */}
      <div className="relative z-10 text-center mb-16">
        <div
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
          style={{
            borderColor: "rgba(59,130,246,0.3)",
            color: isDark ? "#60a5fa" : "#2563eb",
            background: "rgba(59,130,246,0.08)",
          }}
        >
          <Zap size={14} />
          Technologie Oxalys
        </div>
        <h2
          className="font-display font-bold text-[clamp(1.6rem,3.5vw,2.5rem)] leading-tight tracking-tight mb-4"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          Qu&apos;est-ce qu&apos;une{" "}
          <span
            className="font-bold"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Station Oxalys ?
          </span>
        </h2>
        <p
          className="text-[0.9375rem] max-w-xl mx-auto leading-relaxed"
          style={{ color: isDark ? "#94a3b8" : "#4b5563" }}
        >
          Chaque machine de votre FabLab est équipée d&apos;une station autonome composée de
          5 composants électroniques qui surveillent la qualité de l&apos;air en temps réel.
        </p>
      </div>

      {/* ── Main diagram + detail ── */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

        {/* ── Pentagon diagram ── */}
        <div className="lg:col-span-3 flex justify-center items-center px-2 sm:px-4">
          <div
            className="relative w-full mx-auto"
            style={{
              maxWidth: 520,
              aspectRatio: "1 / 1",
              padding: "clamp(14px, 6.5vw, 40px)",
            }}
          >
            {/* Outer decorative rings */}
            <div
              className="absolute inset-0 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(59,130,246,0.07)", margin: "4%" }}
            />
            <div
              className="absolute inset-0 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(59,130,246,0.04)", margin: "8%" }}
            />

            {/* Radar sweep */}
            {triggered && (
              <div
                className="absolute rounded-full overflow-hidden animate-radar pointer-events-none"
                style={{
                  inset: "4%",
                  background: "conic-gradient(from 0deg, transparent 0deg, rgba(59,130,246,0.1) 30deg, transparent 60deg)",
                }}
              />
            )}

            {/* Scan line */}
            {triggered && (
              <div
                className="absolute left-[10%] right-[10%] h-px pointer-events-none animate-scan"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }}
              />
            )}

            {/* SVG connection lines */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ overflow: "visible" }}
            >
              {COMPS.map((comp, i) => {
                const { x1, y1, x2, y2 } = lineEndpoints(comp.angle);
                const isActive = comp.id === activeId;
                const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                return (
                  <g key={comp.id}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={comp.color}
                      strokeWidth={isActive ? 0.6 : 0.3}
                      strokeLinecap="round"
                      strokeDasharray={lineLength}
                      strokeDashoffset={triggered ? 0 : lineLength}
                      style={{
                        transition: `stroke-dashoffset 0.7s ease ${i * 0.12}s, stroke-width 0.3s, opacity 0.3s`,
                        opacity: isActive ? 0.9 : 0.25,
                      }}
                    />
                    {triggered && isActive && (
                      <circle r="0.8" fill={comp.color}>
                        <animateMotion
                          dur="1.5s"
                          repeatCount="indefinite"
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Center hub */}
            <div
              className="absolute animate-station-hub"
              style={{
                left: `${CX}%`, top: `${CY}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Expanding rings */}
              {triggered && [0, 1, 2].map((ring) => (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border animate-ring"
                  style={{
                    borderColor: "rgba(59,130,246,0.3)",
                    animationDelay: `${ring * 0.8}s`,
                  }}
                />
              ))}
              <div
                className="relative flex flex-col items-center justify-center rounded-full border"
                style={{
                  width: 72, height: 72,
                  background: isDark
                    ? "linear-gradient(135deg, rgba(37,99,235,0.25) 0%, rgba(5,150,105,0.15) 100%)"
                    : "linear-gradient(135deg, rgba(37,99,235,0.18) 0%, rgba(5,150,105,0.12) 100%)",
                  borderColor: "rgba(59,130,246,0.5)",
                  boxShadow: "0 0 30px rgba(59,130,246,0.3), inset 0 0 20px rgba(59,130,246,0.1)",
                }}
              >
                <span
                  className="font-display font-bold text-[9px] tracking-[0.15em] uppercase leading-none"
                  style={{ color: isDark ? "#ffffff" : "#1e3a8a" }}
                >
                  STATION
                </span>
                <span className="text-blue-500 text-[8px] font-medium mt-0.5">v2.4</span>
              </div>
            </div>

            {/* Component nodes */}
            {COMPS.map((comp, i) => {
              const pos = toPos(comp.angle);
              const isActive = comp.id === activeId;
              const Icon = comp.icon;
              return (
                <div
                  key={comp.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: "translate(-50%, -50%)",
                    opacity: triggered ? 1 : 0,
                    transition: `opacity 0.5s ease ${i * 0.15 + 0.4}s`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(comp.id)}
                    className={`pointer-events-auto ${FLOAT_CLASSES[i]} group block border-0 bg-transparent p-0`}
                  >
                  <div
                    className="relative rounded-xl border transition-all duration-300 cursor-pointer"
                    style={{
                      width: 88,
                      padding: comp.tag ? "10px 10px 18px" : "10px 10px",
                      background: isActive
                        ? `linear-gradient(135deg, ${comp.dimColor}, ${isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)"})`
                        : isDark ? "rgba(8, 12, 24, 0.85)" : "rgba(255,255,255,0.88)",
                      borderColor: isActive ? comp.color : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      boxShadow: isActive
                        ? `0 0 20px ${comp.color}55, 0 0 40px ${comp.color}22`
                        : "none",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {/* Glow dot */}
                    {comp.critical && (
                      <span
                        className="absolute top-2 right-2 z-10 w-2 h-2 rounded-full border border-[#050810]/80"
                        style={{ background: comp.color, boxShadow: `0 0 6px ${comp.color}` }}
                        aria-hidden
                      />
                    )}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center mb-2 mx-auto"
                      style={{ background: `${comp.color}22`, border: `1px solid ${comp.color}44` }}
                    >
                      <Icon size={14} style={{ color: comp.color }} />
                    </div>
                    <p
                      className="font-display font-semibold text-center leading-tight"
                      style={{
                        fontSize: 9,
                        color: isActive
                          ? isDark ? "#ffffff" : "#111827"
                          : isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {comp.name}
                    </p>
                    {comp.tag && (
                      <span
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap"
                        style={{
                          background: `${comp.color}30`,
                          color: comp.color,
                          border: `1px solid ${comp.color}50`,
                        }}
                      >
                        {comp.tag}
                      </span>
                    )}
                  </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Active component detail */}
          <div
            key={activeComp.id}
            className="rounded-2xl border p-6"
            style={{
              background: isDark
                ? `linear-gradient(135deg, ${activeComp.dimColor}, rgba(8,12,24,0.9))`
                : `linear-gradient(135deg, ${activeComp.dimColor}, rgba(255,255,255,0.95))`,
              borderColor: `${activeComp.color}40`,
              boxShadow: `0 0 30px ${activeComp.color}18`,
              animation: "fadeInUp 0.35s ease forwards",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${activeComp.color}20`, border: `1.5px solid ${activeComp.color}50` }}
              >
                <activeComp.icon size={20} style={{ color: activeComp.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className="font-display font-semibold text-base leading-tight"
                    style={{ color: isDark ? "#ffffff" : "#111827" }}
                  >
                    {activeComp.name}
                  </h3>
                  {activeComp.critical && (
                    <span
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${activeComp.color}25`, color: activeComp.color, border: `1px solid ${activeComp.color}40` }}
                    >
                      <AlertTriangle size={9} />
                      Critique
                    </span>
                  )}
                </div>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: isDark ? "#94a3b8" : "#6b7280" }}
                >
                  {activeComp.role}
                </p>
              </div>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: isDark ? "#cbd5e1" : "#374151" }}
            >
              {activeComp.desc}
            </p>
          </div>

          {/* Component list */}
          <div className="flex flex-col gap-1.5">
            {COMPS.map((comp) => {
              const Icon = comp.icon;
              const isActive = comp.id === activeId;
              return (
                <button
                  key={comp.id}
                  onClick={() => setActiveId(comp.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200"
                  style={{
                    background: isActive ? `${comp.color}15` : "transparent",
                    border: `1px solid ${isActive ? comp.color + "40" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${comp.color}20` }}
                  >
                    <Icon size={14} style={{ color: comp.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-xs truncate"
                      style={{
                        color: isActive
                          ? isDark ? "#ffffff" : "#111827"
                          : isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                      }}
                    >
                      {comp.name}
                    </p>
                    <p
                      className="text-[10px] truncate"
                      style={{ color: isDark ? "#64748b" : "#9ca3af" }}
                    >
                      {comp.role}
                    </p>
                  </div>
                  {comp.critical && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: comp.color, boxShadow: `0 0 6px ${comp.color}` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom note ── */}
      <p
        className="relative z-10 text-center text-xs mt-14"
        style={{ color: isDark ? "#64748b" : "#9ca3af" }}
      >
        1 station · 1 machine · 1 contrat de surveillance · données transmises toutes les{" "}
        <span style={{ color: isDark ? "#94a3b8" : "#6b7280" }} className="font-medium">10 secondes</span>
      </p>
    </section>
  );
}

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
function PartnersSection() {
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

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const STEPS = [
  {
    num: "01",
    icon: Target,
    color: "#3b82f6",
    title: "Notre mission",
    desc: "Sécuriser chaque FabLab universitaire en surveillant la qualité de l'air en continu — COV, CO₂, PM2.5 — pour que chaque étudiant entre en toute confiance.",
    dir: "left",
  },
  {
    num: "02",
    icon: Cpu,
    color: "#10b981",
    title: "La technologie",
    desc: "Des stations IoT intelligentes combinant RaspberryPi, ESP32 et capteurs haute précision. Les données remontent en temps réel sur le dashboard professeur.",
    dir: "right",
  },
  {
    num: "03",
    icon: Telescope,
    color: "#8b5cf6",
    title: "Notre vision",
    desc: "Un réseau national de FabLabs connectés, transparent et centré sur la sécurité. Chaque université peut piloter ses espaces depuis un seul tableau de bord.",
    dir: "left",
  },
  {
    num: "04",
    icon: Users2,
    color: "#f59e0b",
    title: "La communauté",
    desc: "Étudiants, enseignants, responsables de FabLabs — tous unis autour d'un objectif&nbsp;: créer sans risque. Fondée en 2026 en Île-de-France.",
    dir: "right",
  },
];

// Helper interne : isole une transformation ou une regle metier du rendu principal.
function StepCard({ step, visible }: { step: typeof STEPS[0]; visible: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { color } = step;

  const isLeft = step.dir === "left";

  return (
    <div
      className={[
        "about-step-card flex flex-col gap-3 min-w-0 sm:flex-row sm:gap-6 sm:items-start",
        visible ? "about-step-visible" : "",
        isLeft ? "about-step-anim-left" : "about-step-anim-right",
      ].join(" ")}
    >
      {/* Icône + connecteur (connecteur uniquement ≥ sm) */}
      <div className="flex flex-row items-center gap-3 shrink-0 sm:flex-col sm:items-center sm:gap-2">
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}35`,
            boxShadow: `0 0 20px ${color}20`,
          }}
        >
          <step.icon size={20} style={{ color }} />
        </div>
        <div
          className="hidden sm:block w-px flex-1 min-h-[40px]"
          style={{ background: `linear-gradient(to bottom, ${color}40, transparent)` }}
        />
      </div>

      <div
        className="flex-1 min-w-0 pb-6 rounded-2xl sm:rounded-3xl p-4 sm:p-6 sm:pb-10 relative overflow-hidden transition-all duration-300 sm:hover:scale-[1.01]"
        style={{
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)",
          border: `1px solid ${isDark ? `${color}18` : `${color}20`}`,
          boxShadow: isDark ? `inset 0 0 40px ${color}05` : `0 2px 16px rgba(0,0,0,0.04)`,
        }}
      >
        <div
          className="absolute top-0 left-0 bottom-0 w-0.5 rounded-l-2xl sm:rounded-l-3xl"
          style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
        />

        <div
          className="absolute top-1 right-2 sm:top-2 sm:right-4 font-display font-black select-none pointer-events-none leading-none text-[clamp(2.75rem,18vw,4rem)]"
          style={{
            color: isDark ? `${color}08` : `${color}10`,
          }}
        >
          {step.num}
        </div>

        <h3
          className="font-display font-bold text-base sm:text-lg mb-2 sm:mb-3 pr-14 sm:pr-20 break-words"
          style={{ color: isDark ? "#ffffff" : "#0f172a" }}
        >
          {step.title}
        </h3>
        <p
          className="text-[0.875rem] sm:text-[0.9375rem] leading-relaxed break-words"
          style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#64748b" }}
          dangerouslySetInnerHTML={{ __html: step.desc }}
        />
      </div>
    </div>
  );
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
function AboutSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState<boolean[]>(Array(STEPS.length).fill(false));

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-5 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header split */}
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Gauche : accroche */}
          <div className="lg:sticky lg:top-28 min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-5"
              style={{ color: "#3b82f6" }}>
              Qui sommes-nous ?
            </p>
            <h2
              className="font-display font-black leading-tight tracking-tight mb-6 break-words"
              style={{ fontSize: "clamp(1.65rem,5.5vw,3rem)", color: isDark ? "#ffffff" : "#0f172a" }}
            >
              Une équipe passionnée au service des{" "}
              <span style={{
                background: "linear-gradient(135deg,#3b82f6 0%,#10b981 60%,#8b5cf6 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                makers
              </span>
            </h2>
            <p className="leading-relaxed text-[0.875rem] sm:text-[0.9375rem] mb-6 sm:mb-8 break-words"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#64748b" }}>
              Oxalys est né du constat que les FabLabs manquent d&apos;outils pour surveiller la qualité
              de l&apos;air. Imprimantes 3D, découpe laser, fraiseuses CNC — chaque machine peut libérer
              des particules dangereuses. Notre mission&nbsp;: protéger chaque étudiant.
            </p>

            {/* Mini stats en ligne */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[
                { v: "2026", l: "Fondée à Evry-Courcouronnes", c: "#3b82f6" },
                { v: "<1s",  l: "Latence données", c: "#10b981" },
                { v: "99.9%", l: "Uptime station",  c: "#8b5cf6" },
                { v: "5",    l: "Capteurs/station", c: "#f59e0b" },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl min-w-0"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)",
                    border: `1px solid ${isDark ? `${c}18` : `${c}20`}`,
                  }}
                >
                  <p className="font-display font-bold text-base sm:text-lg tabular-nums" style={{
                    background: `linear-gradient(135deg,${c} 0%,white 150%)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>{v}</p>
                  <p className="text-[10px] sm:text-[11px] leading-snug break-words hyphens-auto" lang="fr" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Droite : timeline */}
          <div className="flex flex-col gap-0 min-w-0">
            {STEPS.map((step, i) => (
              <div key={step.num} ref={(el) => { cardRefs.current[i] = el; }}>
                <StepCard step={step} visible={visible[i]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
