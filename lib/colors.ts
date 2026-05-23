import type { HighlightRole } from "./types";

/** Neutral 3D block faces — top / left / right */
export type BlockFaces = {
  top: string;
  left: string;
  right: string;
  stroke: string;
  text: string;
};

export const HIGHLIGHT_COLORS: Record<HighlightRole, BlockFaces> = {
  current: {
    top: "#1d1d1f",
    left: "#3a3a3c",
    right: "#2c2c2e",
    stroke: "#1d1d1f",
    text: "#ffffff",
  },
  compare: {
    top: "#aeaeb2",
    left: "#8e8e93",
    right: "#9a9aa0",
    stroke: "#636366",
    text: "#1d1d1f",
  },
  settled: {
    top: "#ffffff",
    left: "#e8e8ed",
    right: "#f0f0f5",
    stroke: "#d2d2d7",
    text: "#1d1d1f",
  },
  pointer: {
    top: "#ff9500",
    left: "#e08600",
    right: "#f0a030",
    stroke: "#c93400",
    text: "#1d1d1f",
  },
  visited: {
    top: "#d1d1d6",
    left: "#b8b8be",
    right: "#c4c4ca",
    stroke: "#aeaeb2",
    text: "#3a3a3c",
  },
  frontier: {
    top: "#f5f5f7",
    left: "#e5e5ea",
    right: "#ececf1",
    stroke: "#1d1d1f",
    text: "#1d1d1f",
  },
  path: {
    top: "#424245",
    left: "#2c2c2e",
    right: "#353537",
    stroke: "#1d1d1f",
    text: "#f5f5f7",
  },
  active: {
    top: "#1d1d1f",
    left: "#3a3a3c",
    right: "#2c2c2e",
    stroke: "#d71921",
    text: "#ffffff",
  },
};

export const DEFAULT_BLOCK: BlockFaces = {
  top: "#f5f5f7",
  left: "#d1d1d6",
  right: "#e5e5ea",
  stroke: "#c7c7cc",
  text: "#1d1d1f",
};

export function colorsFor(role?: HighlightRole): BlockFaces {
  if (!role) return DEFAULT_BLOCK;
  return HIGHLIGHT_COLORS[role];
}
