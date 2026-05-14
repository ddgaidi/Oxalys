"use client";

/*
 * Commentaires de structure : Ajoute les interactions client de la page tarifs.
 */
import { useState } from "react";
import PlanCard from "@/components/ui/PlanCard";
import TrustedSection from "@/components/ui/TrustedSection";
import { PLANS_DATA } from "@/lib/data";
import { Mail, ShieldCheck, BarChart3, Building2 } from "lucide-react";
import type { FabLab } from "@/types";

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const HOW_IT_WORKS = [
  {
    icon: Building2,
    title: "Référencez votre FabLab",
    desc: "Créez la fiche de votre espace de fabrication : équipements, horaires, localisation, contacts.",
  },
  {
    icon: ShieldCheck,
    title: "Obtenez votre badge sécurité",
    desc: "Notre équipe évalue l'accessibilité et les conditions de sécurité de votre FabLab. Le badge certifié est affiché publiquement.",
  },
  {
    icon: BarChart3,
    title: "Suivez vos consultations",
    desc: "Mesurez combien d'étudiants consultent votre FabLab et optimisez votre visibilité sur la plateforme.",
  },
];

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function TarifsClient({ fablabs = [] }: { fablabs?: FabLab[] }) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      <section className="max-w-5xl mx-auto px-5 py-20">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-[0.18em] mb-4">
            Tarifs établissements
          </p>
          <h1 className="font-display font-bold text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight mb-5">
            Certifiez la sécurité de votre{" "}
            <span className="text-gradient">FabLab</span>
          </h1>
          <p className="text-[var(--text-muted)] leading-relaxed text-[0.9375rem]">
            Oxalys permet aux écoles, universités et centres de formation de référencer
            et certifier l&apos;accessibilité de leur FabLab. Vos étudiants savent ainsi,
            avant d&apos;entrer, si l&apos;espace est sécurisé ou nécessite des précautions.
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-blue-500" />
                </div>
                <span className="text-xs font-semibold text-[var(--text-subtle)] uppercase tracking-widest">
                  Étape {i + 1}
                </span>
              </div>
              <p className="font-display font-semibold text-sm text-[var(--text)] mb-2">{title}</p>
              <p className="text-[var(--text-muted)] text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3.5 mb-10">
          <span className={`text-sm font-medium ${!annual ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full border-0 transition-all duration-300 ${
              annual ? "bg-gradient-brand" : "bg-[var(--border-strong)]"
            }`}
            aria-label="Toggle billing"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${
                annual ? "left-[calc(100%-22px)]" : "left-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 ${annual ? "text-[var(--text)]" : "text-[var(--text-muted)]"}`}>
            Annuel
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
              −30%
            </span>
          </span>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {PLANS_DATA.map((plan) => (
            <PlanCard key={plan.id} plan={plan} annual={annual} />
          ))}
        </div>

        {/* Note on who can consult */}
        <div className="card border-blue-500/20 bg-blue-500/[0.04] p-5 mb-14 flex gap-4 items-start">
          <ShieldCheck size={20} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-[var(--text)] mb-1">
              La consultation est toujours gratuite pour les étudiants
            </p>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Les étudiants, enseignants et makers accèdent gratuitement aux informations
              de sécurité de chaque FabLab. Les abonnements s&apos;adressent exclusivement
              aux <strong>établissements</strong> qui souhaitent référencer et gérer leur(s) FabLab(s) sur la plateforme.
            </p>
          </div>
        </div>

        {/* Custom CTA */}
        <div className="card text-center py-12 px-8 max-w-xl mx-auto">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <Mail size={20} className="text-blue-500" />
          </div>
          <h3 className="font-display font-bold text-xl tracking-tight mb-2">
            Besoin d&apos;une offre{" "}
            <span className="text-gradient">sur mesure</span> ?
          </h3>
          <p className="text-[var(--text-muted)] text-sm mb-7 leading-relaxed">
            Collectivités, rectorats, réseaux de grandes écoles — nous créons
            des offres adaptées à vos besoins spécifiques et à votre volume.
          </p>
          <button className="btn-primary px-8 py-3 text-sm shadow-lg shadow-blue-600/20">
            Contacter notre équipe
          </button>
        </div>
      </section>

      <TrustedSection title="Ils nous font confiance" fablabs={fablabs} />
    </>
  );
}
