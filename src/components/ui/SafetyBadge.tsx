import type { SafetyLevel } from "@/types";
import { CheckCircle2, AlertTriangle, Ban } from "lucide-react";

interface Props {
  level: SafetyLevel;
  size?: "sm" | "md" | "lg";
}

const SAFETY_CONFIG: Record<
  SafetyLevel,
  { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }
> = {
  safe: {
    label: "Accessible – 100% Safe",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-400/10",
    border: "border-emerald-200 dark:border-emerald-400/25",
    icon: CheckCircle2,
  },
  caution: {
    label: "Accessible – Faire attention",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-400/10",
    border: "border-amber-200 dark:border-amber-400/25",
    icon: AlertTriangle,
  },
  danger: {
    label: "Interdit d'accès",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-400/10",
    border: "border-red-200 dark:border-red-400/25",
    icon: Ban,
  },
};

const SIZE_CLASSES = {
  sm: "text-xs px-2.5 py-1 gap-1.5",
  md: "text-sm px-3 py-1.5 gap-2",
  lg: "text-sm px-4 py-2 gap-2",
};

const ICON_SIZES = { sm: 12, md: 14, lg: 16 };

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
