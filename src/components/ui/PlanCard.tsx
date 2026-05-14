"use client";

/*
 * Commentaires de structure : Affiche une offre tarifaire avec ses avantages et limites.
 */
import { Check, Minus } from "lucide-react";
import type { Plan } from "@/types";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  plan: Plan;
  annual: boolean;
}

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function PlanCard({ plan, annual }: Props) {
  const price = annual ? plan.annual_price : plan.monthly_price;

  return (
    <div
      className={`relative flex flex-col rounded-xl p-7 transition-all duration-300
        ${plan.featured
          ? "border-2 shadow-xl shadow-blue-500/10"
          : "card hover:border-[var(--border-strong)]"
        }`}
      style={plan.featured ? { borderColor: plan.color + "55" } : undefined}
    >
      {plan.featured && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-semibold px-3.5 py-1 rounded-full shadow"
          style={{ background: plan.color }}
        >
          Populaire
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p
          className="font-display font-semibold text-base mb-4"
          style={{ color: plan.color }}
        >
          {plan.name}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-bold text-[2.5rem] text-[var(--text)] leading-none">
            {price}€
          </span>
          <span className="text-[var(--text-muted)] text-sm ml-1">
            / {annual ? "an" : "mois"}
          </span>
        </div>
      </div>

      {/* Features */}
      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text)]">
            <Check size={15} className="text-emerald-500 shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
        {plan.missing.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--text-subtle)]">
            <Minus size={15} className="shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
          plan.featured
            ? "text-white"
            : "border bg-transparent hover:opacity-90"
        }`}
        style={
          plan.featured
            ? { background: plan.color }
            : { borderColor: plan.color + "66", color: plan.color }
        }
      >
        Choisir {plan.name}
      </button>
    </div>
  );
}
