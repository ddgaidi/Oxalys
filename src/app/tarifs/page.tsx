"use client";

/*
 * Commentaires de structure : Construit la page tarifs avec les offres et explications commerciales.
 */
import { useState } from "react";
import { Building2, Cpu, LayoutDashboard, Mail, Check, Minus } from "lucide-react";
import { useTheme } from "@/lib/context/ThemeContext";
import TrustedSection from "@/components/ui/TrustedSection";
import { PLANS_DATA } from "@/lib/data";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const HOW_IT_WORKS = [
  {
    icon: Building2,
    step: "01",
    title: "Référencez votre FabLab",
    desc: "Créez la fiche de votre espace : équipements, localisation, contacts. Votre établissement est référencé sur la plateforme Oxalys.",
    color: "#3b82f6",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Mise en place des stations",
    desc: "Une station Oxalys est installée sur chaque machine de votre FabLab. Elle mesure en continu la qualité de l'air (COV, CO₂, PM2.5) et envoie les données en temps réel. En cas de défaillance d'un capteur, un technicien est automatiquement dispatché.",
    color: "#10b981",
  },
  {
    icon: LayoutDashboard,
    step: "03",
    title: "Dashboard professeur en temps réel",
    desc: "Le responsable accède à un dashboard complet avec toutes les données en direct. Avant qu'un étudiant entre dans la salle, il est automatiquement prévenu si les conditions sont risquées ou sécurisées.",
    color: "#8b5cf6",
  },
];

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function TarifsPage() {
  const [annual, setAnnual] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  /* ── Design tokens ── */
  const pageBg      = isDark ? "linear-gradient(160deg, #080c18 0%, #0a0f1e 40%, #06111a 100%)" : "linear-gradient(160deg, #f0f4ff 0%, #f8faff 40%, #eef6f2 100%)";
  const dotColor    = isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.07)";
  const titleColor  = isDark ? "#ffffff"               : "#0f172a";
  const bodyColor   = isDark ? "rgba(255,255,255,0.6)" : "#64748b";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.85)";
  const cardBorder  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const cardShadow  = isDark ? "none" : "0 2px 12px rgba(0,0,0,0.05)";
  const toggleBg    = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const toggleBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const toggleColor = isDark ? "rgba(255,255,255,0.5)"  : "#64748b";
  const toggleActiveColor = isDark ? "#ffffff" : "#0f172a";
  const glowBg      = isDark ? "radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)" : "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)";

  return (
    <div className="min-h-screen relative" style={{ background: pageBg }}>
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10">
        <section className="max-w-5xl mx-auto px-5 py-20">

          {/* ── Hero header ── */}
          <div className="text-center max-w-2xl mx-auto mb-16 relative">
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-[500px] h-40 pointer-events-none"
              style={{ background: glowBg }}
            />
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-sm font-medium"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Tarifs établissements
            </div>
            <h1
              className="font-display font-bold tracking-tight mb-5"
              style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", color: titleColor }}
            >
              Un tarif selon la taille{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                de votre FabLab
              </span>
            </h1>
            <p className="leading-relaxed text-[0.9375rem]" style={{ color: bodyColor }}>
              Le prix varie selon le nombre de machines de votre FabLab —
              car <strong style={{ color: isDark ? "#e2e8f0" : "#374151" }}>1 machine = 1 station</strong> de surveillance.
              Chaque station surveille en permanence la qualité de l&apos;air autour d&apos;une machine.
            </p>
          </div>

          {/* ── How it works ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc, color }) => (
              <div
                key={title}
                className="p-6 rounded-2xl relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
              >
                {/* Step watermark */}
                <span
                  className="absolute -right-2 -top-3 font-display font-black text-7xl leading-none pointer-events-none select-none"
                  style={{ color: `${color}12` }}
                >
                  {step}
                </span>
                {/* Safety stripe accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="font-display font-semibold text-sm mb-2" style={{ color: isDark ? "rgba(255,255,255,0.9)" : "#0f172a" }}>
                  {title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#64748b" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── Billing toggle ── */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="text-sm font-medium" style={{ color: !annual ? toggleActiveColor : toggleColor }}>
              Mensuel
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full transition-all duration-300"
              style={{
                background: annual
                  ? "linear-gradient(135deg, #2563eb, #059669)"
                  : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                border: `1px solid ${annual ? "transparent" : toggleBorder}`,
              }}
              aria-label="Toggle billing"
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
                style={{ left: annual ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
            <span
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: annual ? toggleActiveColor : toggleColor }}
            >
              Annuel
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}
              >
                −30%
              </span>
            </span>
          </div>

          {/* ── Plan cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {PLANS_DATA.map((plan) => {
              const price = annual ? plan.annual_price : plan.monthly_price;
              return (
                <div
                  key={plan.id}
                  className="relative flex flex-col rounded-2xl p-7 transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: plan.featured
                      ? isDark ? `linear-gradient(135deg, ${plan.color}18, ${plan.color}08)` : `linear-gradient(135deg, ${plan.color}10, rgba(255,255,255,0.9))`
                      : cardBg,
                    border: `1px solid ${plan.featured ? plan.color + "55" : cardBorder}`,
                    boxShadow: plan.featured
                      ? `0 0 40px ${plan.color}18, ${cardShadow}`
                      : cardShadow,
                  }}
                >
                  {/* Safety-stripe accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, transparent, ${plan.color}80, transparent)` }}
                  />

                  {plan.featured && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-semibold px-3.5 py-1 rounded-full shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` }}
                    >
                      Populaire
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <p className="font-display font-semibold text-base mb-4" style={{ color: plan.color }}>
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-display font-bold text-[2.5rem] leading-none"
                        style={{ color: isDark ? "#ffffff" : "#0f172a" }}
                      >
                        {price}€
                      </span>
                      <span className="text-sm ml-1" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "#94a3b8" }}>
                        / {annual ? "an" : "mois"}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span style={{ color: isDark ? "rgba(255,255,255,0.75)" : "#374151" }}>{f}</span>
                      </li>
                    ))}
                    {plan.missing.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Minus size={14} className="shrink-0 mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.2)" : "#cbd5e1" }} />
                        <span style={{ color: isDark ? "rgba(255,255,255,0.25)" : "#94a3b8" }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                    style={
                      plan.featured
                        ? { background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, color: "white", boxShadow: `0 4px 16px ${plan.color}35` }
                        : { background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${plan.color}55`, color: plan.color }
                    }
                  >
                    Choisir {plan.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* ── Station info ── */}
          <div
            className="p-5 mb-14 flex gap-4 items-start rounded-2xl"
            style={{
              background: isDark ? "rgba(59,130,246,0.06)" : "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.2)",
              boxShadow: isDark ? "0 0 20px rgba(59,130,246,0.08)" : "none",
            }}
          >
            <Cpu size={20} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: isDark ? "#ffffff" : "#0f172a" }}>
                Comment compter le nombre de stations ?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: bodyColor }}>
                Une station est installée par machine présente dans votre FabLab
                (imprimante 3D, découpe laser, fraiseuse CNC…).{" "}
                <strong style={{ color: isDark ? "#e2e8f0" : "#374151" }}>8 machines = 8 stations.</strong>{" "}
                Le plan <em>Starter</em> couvre jusqu&apos;à 5 machines, le plan <em>Pro</em> jusqu&apos;à 20,
                et le plan <em>Institution</em> est illimité.
              </p>
            </div>
          </div>

          {/* ── CTA contact ── */}
          <div
            className="text-center py-14 px-8 max-w-xl mx-auto rounded-2xl relative overflow-hidden"
            style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6), transparent)" }}
            />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
            >
              <Mail size={20} className="text-blue-500" />
            </div>
            <h3
              className="font-display font-bold text-xl tracking-tight mb-3"
              style={{ color: titleColor }}
            >
              FabLab de grande taille ou{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                réseau de campus ?
              </span>
            </h3>
            <p className="text-sm mb-7 leading-relaxed" style={{ color: bodyColor }}>
              Rectorats, collectivités, réseaux de grandes écoles — nous créons
              des offres sur mesure adaptées à votre volume et à vos contraintes techniques.
            </p>
            <button className="btn-primary px-8 py-3 text-sm rounded-xl" style={{ boxShadow: "0 8px 24px rgba(37,99,235,0.25)" }}>
              Contacter notre équipe
            </button>
          </div>

        </section>

        <TrustedSection title="Ils nous font confiance" />
      </div>
    </div>
  );
}
