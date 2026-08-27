export type SlaLevel = "good" | "warning" | "critical";

// Fixed status palette - never themed, never reused for series colors.
export const SLA_COLOR: Record<SlaLevel, string> = {
  good: "#0ca30c",
  warning: "#fab219",
  critical: "#d03b3b",
};

export function slaLevel(pct: number): SlaLevel {
  if (pct >= 90) return "good";
  if (pct >= 75) return "warning";
  return "critical";
}
