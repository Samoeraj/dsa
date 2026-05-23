"use client";

import { motion } from "framer-motion";
import { colorsFor } from "@/lib/colors";
import type { VizEdge, VizElement } from "@/lib/types";

type Props = {
  elements: VizElement[];
  edges?: VizEdge[];
};

export function FlatSchematic({ elements, edges = [] }: Props) {
  const isGrid = elements.some((e) => e.kind === "cell");
  const byId = Object.fromEntries(elements.map((e) => [e.id, e]));

  if (isGrid) {
    const maxX = Math.max(...elements.map((e) => e.x)) + 1;
    const maxY = Math.max(...elements.map((e) => e.y)) + 1;
    return (
      <div
        className="mx-auto grid gap-1 p-2"
        style={{ gridTemplateColumns: `repeat(${maxX}, minmax(0, 2.5rem))` }}
        role="img"
        aria-hidden="true"
      >
        {Array.from({ length: maxY }, (_, y) =>
          Array.from({ length: maxX }, (_, x) => {
            const el = elements.find((e) => e.x === x && e.y === y);
            if (!el) return <div key={`${x}-${y}`} />;
            const c = colorsFor(el.highlight);
            return (
              <motion.div
                key={el.id}
                layout
                className="flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xs font-bold"
                style={{ backgroundColor: c.fill, borderColor: c.stroke }}
              >
                {el.value || ""}
              </motion.div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4" role="img" aria-hidden="true">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {elements
          .filter((e) => e.kind !== "cell")
          .sort((a, b) => a.x - b.x || a.y - b.y)
          .map((el) => {
            const c = colorsFor(el.highlight);
            return (
              <motion.div
                key={el.id}
                layout
                className="flex h-12 min-w-12 items-center justify-center rounded-xl border-2 px-2 text-sm font-bold shadow-sm"
                style={{ backgroundColor: c.fill, borderColor: c.stroke }}
              >
                {el.value}
                {el.label && <span className="ml-1 text-[10px] text-violet-700">{el.label}</span>}
              </motion.div>
            );
          })}
      </div>
      {edges.length > 0 && (
        <p className="text-xs text-slate-500">{edges.length} pointer link(s) — see isometric view on larger screens</p>
      )}
      <svg className="h-8 w-full max-w-md overflow-visible" aria-hidden="true">
        {edges.map((edge) => {
          const from = byId[edge.from];
          const to = byId[edge.to];
          if (!from || !to) return null;
          const c = colorsFor(edge.highlight ?? "pointer");
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={`${(from.x + 1) * 10}%`}
              y1="50%"
              x2={`${(to.x + 1) * 10}%`}
              y2="50%"
              stroke={c.stroke}
              strokeWidth={2}
            />
          );
        })}
      </svg>
    </div>
  );
}
