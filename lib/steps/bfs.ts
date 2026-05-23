import { gridCells, step } from "./builders";

type Coord = { x: number; y: number };

const PRESETS: Record<
  string,
  { width: number; height: number; walls: string[]; start: Coord; goal: Coord }
> = {
  "open-room": {
    width: 5,
    height: 5,
    walls: [],
    start: { x: 0, y: 0 },
    goal: { x: 4, y: 4 },
  },
  "small-maze": {
    width: 5,
    height: 5,
    walls: ["1,0", "1,1", "1,2", "3,2", "3,3", "3,4"],
    start: { x: 0, y: 4 },
    goal: { x: 4, y: 0 },
  },
  "corner-start": {
    width: 4,
    height: 4,
    walls: ["1,1", "2,1", "1,2"],
    start: { x: 0, y: 3 },
    goal: { x: 3, y: 0 },
  },
};

function bfsSteps(preset: string) {
  const cfg = PRESETS[preset] ?? PRESETS["open-room"];
  const wallSet = new Set(cfg.walls);
  const { width, height, start, goal } = cfg;

  const queue: Coord[] = [start];
  const visited = new Set<string>([`${start.x},${start.y}`]);
  const parent = new Map<string, string>();
  const order: Coord[] = [start];

  const dirs = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.x === goal.x && cur.y === goal.y) break;

    for (const d of dirs) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;
      const key = `${nx},${ny}`;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (wallSet.has(key) || visited.has(key)) continue;
      visited.add(key);
      parent.set(key, `${cur.x},${cur.y}`);
      queue.push({ x: nx, y: ny });
      order.push({ x: nx, y: ny });
    }
  }

  const path = new Set<string>();
  let cur: string | undefined = `${goal.x},${goal.y}`;
  while (cur) {
    path.add(cur);
    cur = parent.get(cur);
  }

  const steps = [
    step(
      "intro",
      "BFS explores layer by layer — shortest path in unweighted grids.",
      `Grid ${width}×${height}. Start (${start.x},${start.y}), goal (${goal.x},${goal.y}).`,
      gridCells(width, height, wallSet, {
        [`${start.x},${start.y}`]: "current",
        [`${goal.x},${goal.y}`]: "settled",
      }, { [`${start.x},${start.y}`]: "S", [`${goal.x},${goal.y}`]: "G" })
    ),
  ];

  const seen = new Set<string>();
  for (let i = 0; i < order.length; i++) {
    const c = order[i];
    const key = `${c.x},${c.y}`;
    seen.add(key);
    const highlights: Record<string, "visited" | "frontier" | "current" | "path" | "settled"> = {};
    for (const s of seen) {
      if (s === key) highlights[s] = "current";
      else if (path.has(s)) highlights[s] = "path";
      else highlights[s] = "visited";
    }
    highlights[`${start.x},${start.y}`] = "visited";
    highlights[`${goal.x},${goal.y}`] = "settled";
    if (i < order.length - 1) {
      const next = order[i + 1];
      highlights[`${next.x},${next.y}`] = "frontier";
    }

    steps.push(
      step(
        `expand-${i}`,
        i === 0 ? "Start BFS — enqueue neighbors of start." : `Dequeue (${c.x},${c.y}), enqueue neighbors.`,
        `BFS step ${i + 1} at (${c.x},${c.y}).`,
        gridCells(width, height, wallSet, highlights, {
          [`${start.x},${start.y}`]: "S",
          [`${goal.x},${goal.y}`]: "G",
        }),
        undefined,
        i === 2
          ? {
              question: "BFS guarantees shortest path when…",
              options: ["Edges have different weights", "All edges cost the same", "Graph is directed only"],
              correctIndex: 1,
              hint: "BFS is optimal for unweighted graphs.",
            }
          : undefined
      )
    );
  }

  const finalHighlights: Record<string, "path" | "settled" | "visited"> = {};
  for (const s of seen) finalHighlights[s] = path.has(s) ? "path" : "visited";
  for (const p of path) finalHighlights[p] = "path";
  finalHighlights[`${goal.x},${goal.y}`] = "settled";

  steps.push(
    step("goal", "Goal reached — path reconstructed!", "BFS found shortest path.", gridCells(width, height, wallSet, finalHighlights, {
      [`${start.x},${start.y}`]: "S",
      [`${goal.x},${goal.y}`]: "G",
    }))
  );

  return steps;
}

export function buildBfsDemo(preset = "open-room") {
  return bfsSteps(preset in PRESETS ? preset : "open-room");
}

export function buildBfsSandbox(preset: string) {
  return buildBfsDemo(preset);
}
