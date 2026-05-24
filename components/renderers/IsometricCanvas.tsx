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
          fill={(gx + gy) % 2 === 0 ? "#f1f5f9" : "#e2e8f0"} // Clean slate floor tiles
          stroke="#cbd5e1"
          strokeWidth={0.5}
        />
      );
    }
  }

  // Draw rivets at the grid corners
  const rivets: React.ReactNode[] = [];
  for (let gy = minY; gy <= maxY + 1; gy++) {
    for (let gx = minX; gx <= maxX + 1; gx++) {
      const { x: rx, y: ry } = gridToScreen(gx - 0.5, gy - 0.5, 0);
      rivets.push(
        <circle
          key={`rivet-${gx}-${gy}`}
          cx={rx}
          cy={ry}
          r={2}
          fill="#cbd5e1"
          stroke="#94a3b8"
          strokeWidth={0.5}
          opacity={0.8}
        />
      );
    }
  }

  // Calculate high-visibility outer border
  const borderPoints = [
    gridToScreen(minX - 0.5, minY - 0.5, 0),
    gridToScreen(maxX + 0.5, minY - 0.5, 0),
    gridToScreen(maxX + 0.5, maxY + 0.5, 0),
    gridToScreen(minX - 0.5, maxY + 0.5, 0),
  ]
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <g aria-hidden="true">
      {tiles}
      {/* Outer yellow/black safety hazard border */}
      <polygon
        points={borderPoints}
        fill="none"
        stroke="url(#hazard-stripes)"
        strokeWidth={10}
        strokeLinejoin="round"
      />
      {/* Clean dark boundary outline */}
      <polygon
        points={borderPoints}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {rivets}
    </g>
  );
}

function IsometricBlock({ el, sortKey }: { el: VizElement; sortKey: number }) {
  const isWall = el.value === "·";
  const h = isWall ? 5 : heightUnits(el.value, el.z ?? 2);
  const { x: sx, y: sy } = gridToScreen(el.x, el.y, h);
  const extrude = h * BLOCK_H;
  const colors = colorsFor(el.highlight, el.value);
  const w = TILE_W * 0.9;
  const topY = sy - extrude;

  // Face geometries
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

  // Cargo container lid inset
  const topCenterY = topY + TILE_H / 2;
  const s = 0.8;
  const topInset = [
    [sx, topCenterY - (TILE_H / 2) * s],
    [sx + (w / 2) * s, topCenterY],
    [sx, topCenterY + (TILE_H / 2) * s],
    [sx - (w / 2) * s, topCenterY],
  ]
    .map((p) => p.join(","))
    .join(" ");

  // Corrugation ridges on container sides
  const leftCorr = [0.25, 0.5, 0.75].map((t, idx) => {
    const tx = sx - (w / 2) * (1 - t);
    const tyTop = (topY + TILE_H / 2) * (1 - t) + (topY + TILE_H) * t;
    const tyBot = (sy + TILE_H / 2) * (1 - t) + (sy + TILE_H) * t;
    return { id: idx, x1: tx, y1: tyTop, x2: tx, y2: tyBot };
  });

  const rightCorr = [0.25, 0.5, 0.75].map((t, idx) => {
    const tx = sx + (w / 2) * t;
    const tyTop = (topY + TILE_H) * (1 - t) + (topY + TILE_H / 2) * t;
    const tyBot = (sy + TILE_H) * (1 - t) + (sy + TILE_H / 2) * t;
    return { id: idx, x1: tx, y1: tyTop, x2: tx, y2: tyBot };
  });

  const isSelected = el.highlight === "current" || el.highlight === "active";

  return (
    <motion.g
      key={el.id}
      initial={{ opacity: 0, scale: 0.3, y: -80 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 14 }}
      style={{ zIndex: sortKey, transformOrigin: `${sx}px ${sy + TILE_H / 2}px` }}
    >
      {isSelected && colors.glow && (
        <motion.ellipse
          animate={{ cx: sx, cy: sy + TILE_H / 2 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          rx={w * 0.5}
          ry={TILE_H * 0.45}
          fill={colors.glow}
        />
      )}

      {/* Main container sides */}
      <motion.polygon
        animate={{ points: left }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        fill={colors.left}
        stroke={colors.stroke}
        strokeWidth={1}
      />
      <motion.polygon
        animate={{ points: right }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        fill={colors.right}
        stroke={colors.stroke}
        strokeWidth={1}
      />

      {/* Corrugation lines */}
      {leftCorr.map((c) => (
        <motion.line
          key={`left-corr-${c.id}`}
          animate={{ x1: c.x1, y1: c.y1, x2: c.x2, y2: c.y2 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          stroke={colors.stroke}
          strokeWidth={1}
          opacity={0.4}
        />
      ))}
      {rightCorr.map((c) => (
        <motion.line
          key={`right-corr-${c.id}`}
          animate={{ x1: c.x1, y1: c.y1, x2: c.x2, y2: c.y2 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          stroke={colors.stroke}
          strokeWidth={1}
          opacity={0.4}
        />
      ))}

      {/* Container top & inset lid */}
      <motion.polygon
        animate={{ points: top }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        fill={colors.top}
        stroke={colors.stroke}
        strokeWidth={1.25}
      />
      <motion.polygon
        animate={{ points: topInset }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        fill={colors.top}
        opacity={0.55}
        stroke={colors.stroke}
        strokeWidth={0.75}
      />

      {el.value !== undefined && el.value !== "" && el.value !== "·" && (
        <motion.text
          animate={{ x: sx, y: topY + TILE_H / 2 + 4 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          textAnchor="middle"
          fill={colors.text}
          style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-raleway), sans-serif" }}
        >
          {el.value}
        </motion.text>
      )}

      {el.label && (
        <motion.text
          animate={{ x: sx, y: sy + TILE_H + 14 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          textAnchor="middle"
          fill="#64748b"
          style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}
        >
          {el.label}
        </motion.text>
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
      {/* Outer casing */}
      <motion.line
        animate={{ x1, y1, x2, y2 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        stroke={active ? "#1e293b" : "#cbd5e1"}
        strokeWidth={active ? 5 : 4}
        strokeLinecap="round"
      />
      {/* Inner pneumatic core with running bubbles */}
      <motion.line
        animate={{
          x1,
          y1,
          x2,
          y2,
          strokeDashoffset: active ? [0, -24] : 0,
        }}
        transition={{
          x1: { type: "spring", stiffness: 120, damping: 15 },
          y1: { type: "spring", stiffness: 120, damping: 15 },
          x2: { type: "spring", stiffness: 120, damping: 15 },
          y2: { type: "spring", stiffness: 120, damping: 15 },
          strokeDashoffset: active
            ? { repeat: Infinity, ease: "linear", duration: 1.2 }
            : { duration: 0 },
        }}
        stroke={active ? "#38bdf8" : "#f8fafc"}
        strokeWidth={active ? 2.5 : 2}
        strokeLinecap="round"
        strokeDasharray={active ? "6 6" : undefined}
      />
      {/* Joint caps */}
      <motion.circle
        animate={{ cx: x1, cy: y1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        r={3.5}
        fill={active ? "#334155" : "#94a3b8"}
      />
      <motion.circle
        animate={{ cx: x2, cy: y2 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        r={3.5}
        fill={active ? "#334155" : "#94a3b8"}
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
      <div className="viz-stage__label">Conveyor view</div>
      <svg
        viewBox={`${vb.minX} ${vb.minY} ${vb.width} ${vb.height}`}
        className="viz-stage__canvas"
        role="img"
        aria-label="Isometric visualization"
      >
        <defs>
          {/* Diagonal safety warning stripes */}
          <pattern
            id="hazard-stripes"
            width="24"
            height="24"
            patternTransform="rotate(45 0 0)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="24" stroke="#eab308" strokeWidth="12" />
            <line x1="12" y1="0" x2="12" y2="24" stroke="#1e293b" strokeWidth="12" />
          </pattern>
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
