/*
 * Commentaires de structure : Affiche un badge visuel pour le niveau de securite.
 */
import type { SafetyLevel } from "@/types";
import { AlertCircle, AlertTriangle, Ban, CheckCircle2, WifiOff, type LucideIcon } from "lucide-react";

// Contrat local : precise les valeurs manipulees uniquement dans ce fichier.
interface Props {
  level: SafetyLevel;
  size?: "sm" | "md" | "lg";
}

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const SAFETY_CONFIG: Record<
  SafetyLevel,
  { label: string; color: string; bg: string; border: string; icon: LucideIcon }
> = {
  optimal: {
    label: "Optimal",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-400/10",
    border: "border-emerald-200 dark:border-emerald-400/25",
    icon: CheckCircle2,
  },
  medium: {
    label: "Moyen",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-400/10",
    border: "border-yellow-200 dark:border-yellow-400/25",
    icon: AlertCircle,
  },
  alert: {
    label: "Alerte",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-400/10",
    border: "border-orange-200 dark:border-orange-400/25",
    icon: AlertTriangle,
  },
  danger: {
    label: "Danger",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-400/10",
    border: "border-red-200 dark:border-red-400/25",
    icon: Ban,
  },
  offline: {
    label: "Hors service",
    color: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-400/10",
    border: "border-slate-200 dark:border-slate-400/25",
    icon: WifiOff,
  },
};

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const SIZE_CLASSES = {
  sm: "text-xs px-2.5 py-1 gap-1.5",
  md: "text-sm px-3 py-1.5 gap-2",
  lg: "text-sm px-4 py-2 gap-2",
};

// Configuration locale qui pilote le rendu ou le comportement de ce module.
const ICON_SIZES = { sm: 12, md: 14, lg: 16 };

// Composant principal : orchestre les donnees, le theme et le rendu de cette vue.
export default function SafetyBadge({ level, size = "md" }: Props) {
  const cfg = SAFETY_CONFIG[level];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium
        ${cfg.color} ${cfg.bg} ${cfg.border} ${SIZE_CLASSES[size]}`}
    >
      <Icon size={ICON_SIZES[size]} className="shrink-0" />
      {cfg.label}
    </span>
  );
}
