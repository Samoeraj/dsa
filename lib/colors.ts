import type { HighlightRole } from "./types";

export type BlockFaces = {
  top: string;
  left: string;
  right: string;
  stroke: string;
  text: string;
  glow?: string;
};

/** Playful steel/container neutral tones — slight variation by value */
const NEUTRAL_STEPS: BlockFaces[] = [
  { top: "#e2e8f0", left: "#cbd5e1", right: "#d8e2ed", stroke: "#94a3b8", text: "#1e293b" },
  { top: "#cbd5e1", left: "#94a3b8", right: "#aebfcb", stroke: "#64748b", text: "#1e293b" },
  { top: "#f1f5f9", left: "#e2e8f0", right: "#ebf1f6", stroke: "#cbd5e1", text: "#1e293b" },
];

export const HIGHLIGHT_COLORS: Record<HighlightRole, BlockFaces> = {
  current: {
    top: "#ff9f1c", // High-visibility cargo orange
    left: "#e68500",
    right: "#f29310",
    stroke: "#b36200",
    text: "#ffffff",
    glow: "rgba(255, 159, 28, 0.28)",
  },
  active: {
    top: "#ff9f1c", // High-visibility cargo orange
    left: "#e68500",
    right: "#f29310",
    stroke: "#b36200",
    text: "#ffffff",
    glow: "rgba(255, 159, 28, 0.28)",
  },
  compare: {
    top: "#ffd166", // Safety warning yellow
    left: "#e5b847",
    right: "#f7ca54",
    stroke: "#bd911c",
    text: "#3d2900",
  },
  settled: {
    top: "#06d6a0", // Quality control mint green
    left: "#05b386",
    right: "#06c795",
    stroke: "#037d5e",
    text: "#ffffff",
  },
  pointer: {
    top: "#475569", // Industrial steel gray pointer
    left: "#334155",
    right: "#3f4e64",
    stroke: "#1e293b",
    text: "#ffffff",
  },
  visited: {
    top: "#e2e8f0", // Clean, processed gray
    left: "#cbd5e1",
    right: "#d9e2ec",
    stroke: "#94a3b8",
    text: "#475569",
  },
  frontier: {
    top: "#a5f3fc", // Chute-blue/cyan frontier
    left: "#67e8f9",
    right: "#8beafd",
    stroke: "#0891b2",
    text: "#0891b2",
    glow: "rgba(103, 232, 249, 0.2)",
  },
  path: {
    top: "#f72585", // Neon hot-pink route
    left: "#b5179e",
    right: "#d91e84",
    stroke: "#7209b7",
    text: "#ffffff",
  },
};

export const WALL_BLOCK: BlockFaces = {
  top: "#94a3b8", // Concrete heavy barrier
  left: "#64748b",
  right: "#475569",
  stroke: "#334155",
  text: "#1e293b",
};

export const DEFAULT_BLOCK = NEUTRAL_STEPS[0];

export function resourceColor(value?: string | number): BlockFaces {
  if (value === undefined || value === "" || value === "·") return WALL_BLOCK;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (Number.isNaN(n)) return NEUTRAL_STEPS[0];
  return NEUTRAL_STEPS[Math.abs(n) % NEUTRAL_STEPS.length];
}

export function colorsFor(role?: HighlightRole, value?: string | number): BlockFaces {
  if (role) return HIGHLIGHT_COLORS[role];
  return resourceColor(value);
}
