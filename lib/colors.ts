import type { HighlightRole } from "./types";

export const HIGHLIGHT_COLORS: Record<HighlightRole, { fill: string; stroke: string }> = {
  current: { fill: "#60a5fa", stroke: "#2563eb" },
  compare: { fill: "#fb923c", stroke: "#ea580c" },
  settled: { fill: "#4ade80", stroke: "#16a34a" },
  pointer: { fill: "#c084fc", stroke: "#9333ea" },
  visited: { fill: "#94a3b8", stroke: "#64748b" },
  frontier: { fill: "#fbbf24", stroke: "#d97706" },
  path: { fill: "#2dd4bf", stroke: "#0d9488" },
  active: { fill: "#f472b6", stroke: "#db2777" },
};

export const DEFAULT_BLOCK = { fill: "#e2e8f0", stroke: "#94a3b8" };

export function colorsFor(role?: HighlightRole) {
  if (!role) return DEFAULT_BLOCK;
  return HIGHLIGHT_COLORS[role];
}
