/*
 * Commentaires de structure : Traduit une valeur de qualite de l air en niveau de securite exploitable par l interface.
 */
import type { SafetyLevel } from "@/types";

// Donnees ou configuration exportees pour etre reutilisees ailleurs dans l application.
export const AIR_QUALITY_THRESHOLDS = {
  optimalMaxExclusive: 180,
  mediumMinInclusive: 180,
  alertMinInclusive: 260,
  dangerMinInclusive: 390,
} as const;

// Fonction exportee : point d entree reutilisable par les pages ou composants.
export function safetyFromAirQualityValue(value?: number | null): SafetyLevel {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "offline";
  }

  if (value < AIR_QUALITY_THRESHOLDS.optimalMaxExclusive) return "optimal";
  if (value < AIR_QUALITY_THRESHOLDS.alertMinInclusive) return "medium";
  if (value < AIR_QUALITY_THRESHOLDS.dangerMinInclusive) return "alert";
  return "danger";
}
