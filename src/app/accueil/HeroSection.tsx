"use client";

/*
 * Commentaires de structure : Construit le hero de la page d accueil avec l accroche principale.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Wind, Thermometer, Activity, Wifi, Shield } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import { fetchFabLabs } from "@/lib/supabase/fablabs";

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
export default function HeroSection() {
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
