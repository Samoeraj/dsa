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

  if (isGrid) {
    const maxX = Math.max(...elements.map((e) => e.x)) + 1;
    const maxY = Math.max(...elements.map((e) => e.y)) + 1;
    return (
      <div
        className="mx-auto grid gap-1 p-4"
        style={{ gridTemplateColumns: `repeat(${maxX}, minmax(0, 2.75rem))` }}
        role="img"
        aria-label="Simplified grid view"
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
                className="flex h-11 w-11 items-center justify-center rounded-md border text-xs font-semibold"
                style={{ backgroundColor: c.top, borderColor: c.stroke, color: c.text }}
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
    <div className="flex flex-col items-center gap-3 p-4" role="img" aria-label="Simplified schematic view">
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
                className="flex h-11 min-w-11 items-center justify-center rounded-md border px-2 text-sm font-semibold"
                style={{ backgroundColor: c.top, borderColor: c.stroke, color: c.text }}
              >
                {el.value}
              </motion.div>
            );
          })}
      </div>
      {edges.length > 0 && (
        <p className="text-[11px] font-medium uppercase tracking-widest text-[#86868b]">
          {edges.length} link{edges.length > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
