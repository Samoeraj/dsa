import type { HighlightRole } from "./types";

export type BlockFaces = {
  top: string;
  left: string;
  right: string;
  stroke: string;
  text: string;
  glow?: string;
};

/** Factorio-ish resource crate colors by numeric value */
const RESOURCES: BlockFaces[] = [
  { top: "#c8d0d8", left: "#8a939c", right: "#a8b0b8", stroke: "#5c646c", text: "#1a1a1a" }, // iron
  { top: "#f0a060", left: "#b86a28", right: "#d88840", stroke: "#8a5020", text: "#1a1008" }, // copper
  { top: "#5a5a5a", left: "#3a3a3a", right: "#484848", stroke: "#2a2a2a", text: "#e0e0e0" }, // coal
  { top: "#d8ccb8", left: "#a89888", right: "#c0b4a4", stroke: "#786858", text: "#2a2018" }, // stone
  { top: "#c49a6a", left: "#8a6848", right: "#a88058", stroke: "#604830", text: "#1a1008" }, // wood
  { top: "#70e888", left: "#40b858", right: "#58d070", stroke: "#289040", text: "#0a2810" }, // green
  { top: "#f07068", left: "#c04038", right: "#d85850", stroke: "#902820", text: "#fff" }, // red science
  { top: "#58c8a0", left: "#389878", right: "#48b090", stroke: "#206850", text: "#0a2018" }, // oil
];

export const HIGHLIGHT_COLORS: Record<HighlightRole, BlockFaces> = {
  current: {
    top: "#fff59d",
    left: "#e6c84a",
    right: "#f0d060",
    stroke: "#fff176",
    text: "#2a2000",
    glow: "rgba(255, 241, 118, 0.65)",
  },
  compare: {
    top: "#ff8a65",
    left: "#e64a2e",
    right: "#f06040",
    stroke: "#ff5722",
    text: "#1a0800",
    glow: "rgba(255, 87, 34, 0.5)",
  },
  settled: {
    top: "#81c784",
    left: "#4caf50",
    right: "#66bb6a",
    stroke: "#2e7d32",
    text: "#0a2008",
  },
  pointer: {
    top: "#ffd54f",
    left: "#ffb300",
    right: "#ffc107",
    stroke: "#ff8f00",
    text: "#3a2800",
  },
  visited: {
    top: "#78909c",
    left: "#546e7a",
    right: "#607d8b",
    stroke: "#37474f",
    text: "#eceff1",
  },
  frontier: {
    top: "#4dd0e1",
    left: "#00acc1",
    right: "#26c6da",
    stroke: "#00838f",
    text: "#002028",
    glow: "rgba(77, 208, 225, 0.45)",
  },
  path: {
    top: "#b0bec5",
    left: "#78909c",
    right: "#90a4ae",
    stroke: "#455a64",
    text: "#1a1a1a",
  },
  active: {
    top: "#fff59d",
    left: "#e6c84a",
    right: "#f0d060",
    stroke: "#ff9800",
    text: "#2a2000",
    glow: "rgba(255, 152, 0, 0.55)",
  },
};

export const WALL_BLOCK: BlockFaces = {
  top: "#5a5a5a",
  left: "#3d3d3d",
  right: "#484848",
  stroke: "#2a2a2a",
  text: "#888",
};

export const DEFAULT_BLOCK = RESOURCES[0];

export function resourceColor(value?: string | number): BlockFaces {
  if (value === undefined || value === "" || value === "·") return WALL_BLOCK;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (Number.isNaN(n)) return RESOURCES[0];
  return RESOURCES[Math.abs(n) % RESOURCES.length];
}

export function colorsFor(role?: HighlightRole, value?: string | number): BlockFaces {
  if (role) return HIGHLIGHT_COLORS[role];
  return resourceColor(value);
}
