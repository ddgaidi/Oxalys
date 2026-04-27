"use client";

import { useEffect, useRef, useState } from "react";
import { Target, Telescope, Cpu, Users2 } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";

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

export default function AboutSection() {
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
