"use client";

import { motion } from "framer-motion";
import { colorsFor } from "@/lib/colors";
import { BLOCK_H, TILE_H, TILE_W, getViewBox, gridToScreen } from "@/lib/isometric";
import type { VizEdge, VizElement } from "@/lib/types";

type Props = {
  elements: VizElement[];
  edges?: VizEdge[];
};

function IsometricBlock({ el }: { el: VizElement }) {
  const { x: sx, y: sy } = gridToScreen(el.x, el.y, el.z ?? 1);
  const h = (el.z ?? 1) * BLOCK_H;
  const colors = colorsFor(el.highlight);
  const w = TILE_W * 0.85;
  const top = [
    [sx, sy - h],
    [sx + w / 2, sy - h + TILE_H / 2],
    [sx, sy - h + TILE_H],
    [sx - w / 2, sy - h + TILE_H / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");
  const left = [
    [sx - w / 2, sy - h + TILE_H / 2],
    [sx, sy - h + TILE_H],
    [sx, sy + TILE_H],
    [sx - w / 2, sy + TILE_H / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");
  const right = [
    [sx, sy - h + TILE_H],
    [sx + w / 2, sy - h + TILE_H / 2],
    [sx + w / 2, sy + TILE_H / 2],
    [sx, sy + TILE_H],
  ]
    .map((p) => p.join(","))
    .join(" ");

  return (
    <motion.g
      key={el.id}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <polygon points={left} fill={shade(colors.fill, -12)} stroke={colors.stroke} strokeWidth={1.5} />
      <polygon points={right} fill={shade(colors.fill, -24)} stroke={colors.stroke} strokeWidth={1.5} />
      <polygon points={top} fill={colors.fill} stroke={colors.stroke} strokeWidth={1.5} />
      {el.value !== undefined && el.value !== "" && (
        <text
          x={sx}
          y={sy - h + TILE_H / 2 + 4}
          textAnchor="middle"
          className="fill-slate-800 text-[11px] font-bold"
        >
          {el.value}
        </text>
      )}
      {el.label && (
        <text x={sx} y={sy + TILE_H + 12} textAnchor="middle" className="fill-violet-700 text-[10px] font-semibold">
          {el.label}
        </text>
      )}
    </motion.g>
  );
}

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}

export function IsometricCanvas({ elements, edges = [] }: Props) {
  const vb = getViewBox(elements);
  const byId = Object.fromEntries(elements.map((e) => [e.id, e]));

  return (
    <svg
      viewBox={`${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`}
      className="mx-auto h-[min(52vh,380px)] w-full max-w-3xl"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
        </filter>
      </defs>
      {edges.map((edge) => {
        const from = byId[edge.from];
        const to = byId[edge.to];
        if (!from || !to) return null;
        const a = gridToScreen(from.x, from.y, (from.z ?? 1) + 0.5);
        const b = gridToScreen(to.x, to.y, (to.z ?? 1) + 0.5);
        const c = colorsFor(edge.highlight ?? "pointer");
        return (
          <line
            key={`${edge.from}-${edge.to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={c.stroke}
            strokeWidth={3}
            strokeDasharray={edge.highlight === "pointer" ? "6 4" : undefined}
            markerEnd="url(#arrow)"
          />
        );
      })}
      <g filter="url(#shadow)">{elements.map((el) => (
        <IsometricBlock key={el.id} el={el} />
      ))}</g>
    </svg>
  );
}
