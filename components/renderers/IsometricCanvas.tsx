"use client";

import { motion } from "framer-motion";
import { colorsFor } from "@/lib/colors";
import {
  BLOCK_H,
  TILE_H,
  TILE_W,
  getViewBox,
  gridToScreen,
  heightUnits,
} from "@/lib/isometric";
import type { VizEdge, VizElement } from "@/lib/types";

type Props = {
  elements: VizElement[];
  edges?: VizEdge[];
};

function FloorGrid({
  minX,
  maxX,
  minY,
  maxY,
}: {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}) {
  const tiles: React.ReactNode[] = [];
  for (let gy = minY; gy <= maxY; gy++) {
    for (let gx = minX; gx <= maxX; gx++) {
      const { x: cx, y: cy } = gridToScreen(gx, gy, 0);
      const w = TILE_W / 2;
      const h = TILE_H / 2;
      const points = [
        [cx, cy - h],
        [cx + w, cy],
        [cx, cy + h],
        [cx - w, cy],
      ]
        .map((p) => p.join(","))
        .join(" ");

      tiles.push(
        <polygon
          key={`floor-${gx}-${gy}`}
          points={points}
          fill={(gx + gy) % 2 === 0 ? "#f5f5f7" : "#ececf1"}
          stroke="#d2d2d7"
          strokeWidth={0.75}
        />
      );
    }
  }
  return <g aria-hidden="true">{tiles}</g>;
}

function IsometricBlock({ el, sortKey }: { el: VizElement; sortKey: number }) {
  const h = heightUnits(el.value, el.z ?? 2);
  const { x: sx, y: sy } = gridToScreen(el.x, el.y, h);
  const extrude = h * BLOCK_H;
  const colors = colorsFor(el.highlight);
  const w = TILE_W * 0.92;

  const topY = sy - extrude;
  const top = [
    [sx, topY],
    [sx + w / 2, topY + TILE_H / 2],
    [sx, topY + TILE_H],
    [sx - w / 2, topY + TILE_H / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const left = [
    [sx - w / 2, topY + TILE_H / 2],
    [sx, topY + TILE_H],
    [sx, sy + TILE_H],
    [sx - w / 2, sy + TILE_H / 2],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const right = [
    [sx, topY + TILE_H],
    [sx + w / 2, topY + TILE_H / 2],
    [sx + w / 2, sy + TILE_H / 2],
    [sx, sy + TILE_H],
  ]
    .map((p) => p.join(","))
    .join(" ");

  const shadow = [
    [sx - w / 2, sy + TILE_H / 2],
    [sx, sy + TILE_H],
    [sx + w / 2, sy + TILE_H / 2],
    [sx, sy + TILE_H * 1.4],
  ]
    .map((p) => p.join(","))
    .join(" ");

  return (
    <motion.g
      key={el.id}
      initial={{ opacity: 0.6, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ zIndex: sortKey }}
    >
      <polygon points={shadow} fill="rgba(0,0,0,0.06)" stroke="none" />
      <polygon points={left} fill={colors.left} stroke={colors.stroke} strokeWidth={1} strokeLinejoin="round" />
      <polygon points={right} fill={colors.right} stroke={colors.stroke} strokeWidth={1} strokeLinejoin="round" />
      <polygon points={top} fill={colors.top} stroke={colors.stroke} strokeWidth={1.25} strokeLinejoin="round" />
      {el.value !== undefined && el.value !== "" && el.value !== "·" && (
        <text
          x={sx}
          y={topY + TILE_H / 2 + 5}
          textAnchor="middle"
          fill={colors.text}
          style={{ fontSize: 13, fontWeight: 600, fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {el.value}
        </text>
      )}
      {el.label && (
        <text
          x={sx}
          y={sy + TILE_H + 16}
          textAnchor="middle"
          fill="#86868b"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}
        >
          {el.label}
        </text>
      )}
    </motion.g>
  );
}

export function IsometricCanvas({ elements, edges = [] }: Props) {
  const vb = getViewBox(elements);
  const byId = Object.fromEntries(elements.map((e) => [e.id, e]));

  const sorted = [...elements].sort((a, b) => {
    const da = a.x + a.y;
    const db = b.x + b.y;
    if (da !== db) return da - db;
    return a.x - b.x;
  });

  return (
    <div className="viz-stage">
      <div className="viz-stage__label">
        <span className="viz-stage__dot" aria-hidden="true" />
        Isometric view
      </div>
      <svg
        viewBox={`${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`}
        className="viz-stage__canvas"
        role="img"
        aria-label="Isometric visualization of data structure state"
      >
        <defs>
          <marker
            id="iso-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="#1d1d1f" />
          </marker>
        </defs>
        <FloorGrid
          minX={vb.floorMinX}
          maxX={vb.floorMaxX}
          minY={vb.floorMinY}
          maxY={vb.floorMaxY}
        />
        {edges.map((edge) => {
          const from = byId[edge.from];
          const to = byId[edge.to];
          if (!from || !to) return null;
          const fh = heightUnits(from.value, from.z ?? 2);
          const th = heightUnits(to.value, to.z ?? 2);
          const a = gridToScreen(from.x, from.y, fh + 0.6);
          const b = gridToScreen(to.x, to.y, th + 0.6);
          const accent = edge.highlight === "pointer";
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={accent ? "#ff9500" : "#1d1d1f"}
              strokeWidth={accent ? 2.5 : 1.5}
              strokeDasharray={accent ? "7 5" : undefined}
              markerEnd="url(#iso-arrow)"
              opacity={0.9}
            />
          );
        })}
        {sorted.map((el, i) => (
          <IsometricBlock key={el.id} el={el} sortKey={i} />
        ))}
      </svg>
    </div>
  );
}
