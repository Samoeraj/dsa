import type { HighlightRole } from "./types";

export type BlockFaces = {
  top: string;
  left: string;
  right: string;
  stroke: string;
  text: string;
  glow?: string;
};

/** Neutral stone tones — slight variation by value */
const NEUTRAL_STEPS: BlockFaces[] = [
  { top: "#f5f4f1", left: "#dddcd8", right: "#ebeae6", stroke: "#c8c6c0", text: "#2a2a2a" },
  { top: "#eeedea", left: "#d4d3cf", right: "#e4e3df", stroke: "#c0beb8", text: "#2a2a2a" },
  { top: "#e8e7e4", left: "#cecdca", right: "#deddd9", stroke: "#b8b6b0", text: "#2a2a2a" },
  { top: "#e2e1de", left: "#c8c7c4", right: "#d8d7d4", stroke: "#b0aea8", text: "#2a2a2a" },
  { top: "#dcdcd9", left: "#c2c2bf", right: "#d2d2cf", stroke: "#a8a6a0", text: "#2a2a2a" },
  { top: "#d6d6d3", left: "#bcbcba", right: "#ccccca", stroke: "#a0a09c", text: "#2a2a2a" },
];

export const HIGHLIGHT_COLORS: Record<HighlightRole, BlockFaces> = {
  current: {
    top: "#3a3a3a",
    left: "#2a2a2a",
    right: "#323232",
    stroke: "#1a1a1a",
    text: "#f8f7f4",
    glow: "rgba(42, 42, 42, 0.12)",
  },
  compare: {
    top: "#a8a6a0",
    left: "#8a8884",
    right: "#989690",
    stroke: "#6a6864",
    text: "#1a1a1a",
  },
  settled: {
    top: "#ffffff",
    left: "#e8e6e1",
    right: "#f0efec",
    stroke: "#d4d2cc",
    text: "#2a2a2a",
  },
  pointer: {
    top: "#6a6864",
    left: "#524f4c",
    right: "#5c5956",
    stroke: "#3a3836",
    text: "#f8f7f4",
  },
  visited: {
    top: "#d4d2cc",
    left: "#b8b6b0",
    right: "#c4c2bc",
    stroke: "#a8a6a0",
    text: "#4a4a4a",
  },
  frontier: {
    top: "#eceae6",
    left: "#d0cec8",
    right: "#e0deda",
    stroke: "#2a2a2a",
    text: "#2a2a2a",
    glow: "rgba(42, 42, 42, 0.08)",
  },
  path: {
    top: "#5a5a5a",
    left: "#424242",
    right: "#4e4e4e",
    stroke: "#2a2a2a",
    text: "#f8f7f4",
  },
  active: {
    top: "#3a3a3a",
    left: "#2a2a2a",
    right: "#323232",
    stroke: "#1a1a1a",
    text: "#f8f7f4",
    glow: "rgba(42, 42, 42, 0.12)",
  },
};

export const WALL_BLOCK: BlockFaces = {
  top: "#b8b6b0",
  left: "#9a9894",
  right: "#a8a6a0",
  stroke: "#7a7874",
  text: "#4a4a4a",
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
