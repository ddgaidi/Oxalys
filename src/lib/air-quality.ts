import type { SafetyLevel } from "@/types";

export const AIR_QUALITY_THRESHOLDS = {
  optimalMaxExclusive: 180,
  mediumMinInclusive: 180,
  alertMinInclusive: 260,
  dangerMinInclusive: 390,
} as const;

export function safetyFromAirQualityValue(value?: number | null): SafetyLevel {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "offline";
  }

  if (value < AIR_QUALITY_THRESHOLDS.optimalMaxExclusive) return "optimal";
  if (value < AIR_QUALITY_THRESHOLDS.alertMinInclusive) return "medium";
  if (value < AIR_QUALITY_THRESHOLDS.dangerMinInclusive) return "alert";
  return "danger";
}
