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
          fill={(gx + gy) % 2 === 0 ? "#f0efec" : "#e8e6e1"}
          stroke="#dddcd8"
          strokeWidth={0.5}
        />
      );
    }
  }
  return <g aria-hidden="true">{tiles}</g>;
}

function IsometricBlock({ el, sortKey }: { el: VizElement; sortKey: number }) {
  const isWall = el.value === "·";
  const h = isWall ? 5 : heightUnits(el.value, el.z ?? 2);
  const { x: sx, y: sy } = gridToScreen(el.x, el.y, h);
  const extrude = h * BLOCK_H;
  const colors = colorsFor(el.highlight, el.value);
  const w = TILE_W * 0.9;
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

  const isSelected = el.highlight === "current" || el.highlight === "active";

  return (
    <motion.g
      key={el.id}
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: sortKey }}
    >
      {isSelected && colors.glow && (
        <ellipse cx={sx} cy={sy + TILE_H / 2} rx={w * 0.5} ry={TILE_H * 0.45} fill={colors.glow} />
      )}
      <polygon points={left} fill={colors.left} stroke={colors.stroke} strokeWidth={1} />
      <polygon points={right} fill={colors.right} stroke={colors.stroke} strokeWidth={1} />
      <polygon points={top} fill={colors.top} stroke={colors.stroke} strokeWidth={1.25} />
      {el.value !== undefined && el.value !== "" && el.value !== "·" && (
        <text
          x={sx}
          y={topY + TILE_H / 2 + 4}
          textAnchor="middle"
          fill={colors.text}
          style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-raleway), sans-serif" }}
        >
          {el.value}
        </text>
      )}
      {el.label && (
        <text
          x={sx}
          y={sy + TILE_H + 14}
          textAnchor="middle"
          fill="#7a7a7a"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.06em" }}
        >
          {el.label}
        </text>
      )}
    </motion.g>
  );
}

function Connector({
  x1,
  y1,
  x2,
  y2,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? "#3a3a3a" : "#c8c6c0"}
        strokeWidth={active ? 2 : 1.5}
        strokeDasharray={active ? undefined : "5 4"}
        strokeLinecap="round"
      />
      <circle cx={x2} cy={y2} r={3} fill={active ? "#3a3a3a" : "#d4d2cc"} />
    </g>
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
      <div className="viz-stage__label">Isometric view</div>
      <svg
        viewBox={`${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`}
        className="viz-stage__canvas"
        role="img"
        aria-label="Isometric visualization"
      >
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
          const a = gridToScreen(from.x, from.y, fh + 0.5);
          const b = gridToScreen(to.x, to.y, th + 0.5);
          return (
            <Connector
              key={`${edge.from}-${edge.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              active={edge.highlight === "pointer"}
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
