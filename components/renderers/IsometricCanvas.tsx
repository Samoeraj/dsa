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

      const isLight = (gx + gy) % 2 === 0;
      tiles.push(
        <polygon
          key={`floor-${gx}-${gy}`}
          points={points}
          fill={isLight ? "#5a9e47" : "#4a8538"}
          stroke="#3d6b32"
          strokeWidth={0.6}
        />
      );
      if (isLight) {
        tiles.push(
          <circle key={`dot-${gx}-${gy}`} cx={cx} cy={cy} r={1.2} fill="#6bb85a" opacity={0.35} />
        );
      }
    }
  }
  return <g aria-hidden="true">{tiles}</g>;
}

function IsometricCrate({ el, sortKey }: { el: VizElement; sortKey: number }) {
  const isWall = el.value === "·" || el.kind === "cell" && el.z && el.z >= 5;
  const h = isWall ? 6 : heightUnits(el.value, el.z ?? 2);
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
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ zIndex: sortKey }}
    >
      {isSelected && colors.glow && (
        <ellipse
          cx={sx}
          cy={sy + TILE_H / 2}
          rx={w * 0.55}
          ry={TILE_H * 0.5}
          fill={colors.glow}
          opacity={0.9}
        />
      )}
      <polygon points={left} fill={colors.left} stroke={colors.stroke} strokeWidth={1.5} />
      <polygon points={right} fill={colors.right} stroke={colors.stroke} strokeWidth={1.5} />
      <polygon points={top} fill={colors.top} stroke={colors.stroke} strokeWidth={2} />
      {/* Crate lid lines */}
      {!isWall && (
        <>
          <line
            x1={sx - w / 4}
            y1={topY + TILE_H / 4}
            x2={sx + w / 4}
            y2={topY + TILE_H * 0.75}
            stroke={colors.stroke}
            strokeWidth={0.75}
            opacity={0.35}
          />
          <line
            x1={sx + w / 4}
            y1={topY + TILE_H / 4}
            x2={sx - w / 4}
            y2={topY + TILE_H * 0.75}
            stroke={colors.stroke}
            strokeWidth={0.75}
            opacity={0.35}
          />
        </>
      )}
      {el.value !== undefined && el.value !== "" && el.value !== "·" && (
        <text
          x={sx}
          y={topY + TILE_H / 2 + 5}
          textAnchor="middle"
          fill={colors.text}
          stroke="#000"
          strokeWidth={0.4}
          paintOrder="stroke"
          style={{ fontSize: 14, fontWeight: 800, fontFamily: "var(--font-sans)" }}
        >
          {el.value}
        </text>
      )}
      {el.label && (
        <text
          x={sx}
          y={sy + TILE_H + 14}
          textAnchor="middle"
          fill="#ffe082"
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" }}
        >
          {el.label}
        </text>
      )}
    </motion.g>
  );
}

function ConveyorBelt({
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
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 4;
  const ny = (dx / len) * 4;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a3a3a" strokeWidth={10} strokeLinecap="round" />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? "#ffd54f" : "#9e9e9e"}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={x1 + dx * t + nx}
          y1={y1 + dy * t + ny}
          x2={x1 + dx * t - nx}
          y2={y1 + dy * t - ny}
          stroke="#5d4037"
          strokeWidth={1.5}
          opacity={0.6}
        />
      ))}
      <polygon
        points={`${x2},${y2} ${x2 - dx / len * 10 + nx},${y2 - dy / len * 10 + ny} ${x2 - dx / len * 10 - nx},${y2 - dy / len * 10 - ny}`}
        fill={active ? "#ffb300" : "#757575"}
      />
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
      <div className="viz-stage__label">Factory floor — isometric</div>
      <svg
        viewBox={`${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`}
        className="viz-stage__canvas"
        role="img"
        aria-label="Isometric factory visualization"
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
            <ConveyorBelt
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
          <IsometricCrate key={el.id} el={el} sortKey={i} />
        ))}
      </svg>
    </div>
  );
}
