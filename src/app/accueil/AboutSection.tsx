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
  const slideAnim = isLeft
    ? { animationName: "aboutRevealLeft", animationDuration: "0.75s", animationFillMode: "forwards", animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }
    : { animationName: "aboutRevealRight", animationDuration: "0.75s", animationFillMode: "forwards", animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)" };

  return (
    <div
      className="flex gap-6 items-start"
      style={{
        opacity: visible ? 1 : 0,
        ...( visible ? slideAnim : {}),
      }}
    >
      {/* Numéro watermark + icône */}
      <div className="shrink-0 flex flex-col items-center gap-2">
        {/* Icône */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}35`,
            boxShadow: `0 0 20px ${color}20`,
          }}
        >
          <step.icon size={20} style={{ color }} />
        </div>
        {/* Ligne verticale de connexion */}
        <div className="w-px flex-1 min-h-[40px]"
          style={{ background: `linear-gradient(to bottom, ${color}40, transparent)` }} />
      </div>

      {/* Contenu */}
      <div
        className="flex-1 pb-10 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)",
          border: `1px solid ${isDark ? `${color}18` : `${color}20`}`,
          boxShadow: isDark ? `inset 0 0 40px ${color}05` : `0 2px 16px rgba(0,0,0,0.04)`,
        }}
      >
        {/* Accent stripe gauche */}
        <div className="absolute top-0 left-0 bottom-0 w-0.5 rounded-l-3xl"
          style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }} />

        {/* Numéro watermark */}
        <div
          className="absolute top-2 right-4 font-display font-black select-none pointer-events-none leading-none"
          style={{
            fontSize: "4rem",
            color: isDark ? `${color}08` : `${color}10`,
          }}
        >
          {step.num}
        </div>

        <h3
          className="font-display font-bold text-lg mb-3"
          style={{ color: isDark ? "#ffffff" : "#0f172a" }}
        >
          {step.title}
        </h3>
        <p
          className="text-[0.9375rem] leading-relaxed"
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
    <section className="py-24 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Header split */}
        <div ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Gauche : accroche */}
          <div className="sticky top-28">
            <p className="text-xs font-bold uppercase tracking-[0.22em] mb-5"
              style={{ color: "#3b82f6" }}>
              Qui sommes-nous ?
            </p>
            <h2
              className="font-display font-black leading-tight tracking-tight mb-6"
              style={{ fontSize: "clamp(1.9rem,3.5vw,3rem)", color: isDark ? "#ffffff" : "#0f172a" }}
            >
              Une équipe passionnée au service des{" "}
              <span style={{
                background: "linear-gradient(135deg,#3b82f6 0%,#10b981 60%,#8b5cf6 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>
                makers
              </span>
            </h2>
            <p className="leading-relaxed text-[0.9375rem] mb-8"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#64748b" }}>
              Oxalys est né du constat que les FabLabs manquent d&apos;outils pour surveiller la qualité
              de l&apos;air. Imprimantes 3D, découpe laser, fraiseuses CNC — chaque machine peut libérer
              des particules dangereuses. Notre mission&nbsp;: protéger chaque étudiant.
            </p>

            {/* Mini stats en ligne */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: "2026", l: "Fondée à Evry-Courcouronnes", c: "#3b82f6" },
                { v: "<1s",  l: "Latence données", c: "#10b981" },
                { v: "99.9%", l: "Uptime station",  c: "#8b5cf6" },
                { v: "5",    l: "Capteurs/station", c: "#f59e0b" },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.75)",
                    border: `1px solid ${isDark ? `${c}18` : `${c}20`}`,
                  }}
                >
                  <p className="font-display font-bold text-lg" style={{
                    background: `linear-gradient(135deg,${c} 0%,white 150%)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>{v}</p>
                  <p className="text-[11px]" style={{ color: isDark ? "rgba(255,255,255,0.35)" : "#94a3b8" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Droite : timeline */}
          <div className="flex flex-col gap-0">
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
