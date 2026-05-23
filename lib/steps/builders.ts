import { heightUnits } from "../isometric";
import type { LessonStep, VizEdge, VizElement } from "../types";

export function blockRow(
  values: number[],
  highlights: Record<number, VizElement["highlight"]> = {}
): VizElement[] {
  return values.map((value, index) => ({
    id: `b-${index}`,
    kind: "block",
    x: index,
    y: 0,
    z: heightUnits(value),
    value,
    highlight: highlights[index],
  }));
}

export function linkedNodes(
  values: number[],
  highlights: Record<number, VizElement["highlight"]> = {}
): { elements: VizElement[]; edges: VizEdge[] } {
  const elements: VizElement[] = values.map((value, index) => ({
    id: `n-${index}`,
    kind: "node",
    x: index * 2,
    y: 0,
    z: 4,
    value,
    label: index === 0 ? "head" : undefined,
    highlight: highlights[index],
  }));

  const edges: VizEdge[] = values.slice(0, -1).map((_, index) => ({
    from: `n-${index}`,
    to: `n-${index + 1}`,
    highlight: highlights[index] === "pointer" ? "pointer" : undefined,
  }));

  return { elements, edges };
}

export function gridCells(
  width: number,
  height: number,
  walls: Set<string>,
  highlights: Record<string, VizElement["highlight"]> = {},
  labels: Record<string, string> = {}
): VizElement[] {
  const cells: VizElement[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      const isWall = walls.has(key);
      cells.push({
        id: `c-${key}`,
        kind: "cell",
        x,
        y,
        z: isWall ? 5 : 2,
        value: isWall ? "·" : labels[key] ?? "",
        highlight: highlights[key],
      });
    }
  }
  return cells;
}

export function step(
  id: string,
  caption: string,
  description: string,
  elements: VizElement[],
  edges?: VizEdge[],
  microPrompt?: LessonStep["microPrompt"]
): LessonStep {
  return { id, caption, description, elements, edges, microPrompt };
}
