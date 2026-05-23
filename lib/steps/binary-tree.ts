import type { VizEdge, VizElement } from "../types";
import { step } from "./builders";

type NodeSpec = { id: string; value: number; x: number; y: number; highlight?: VizElement["highlight"] };

function treeViz(nodes: NodeSpec[], edges: VizEdge[]): { elements: VizElement[]; edges: VizEdge[] } {
  const elements: VizElement[] = nodes.map((n) => ({
    id: n.id,
    kind: "node",
    x: n.x,
    y: n.y,
    z: 2,
    value: n.value,
    highlight: n.highlight,
  }));
  return { elements, edges };
}

const BALANCED: NodeSpec[] = [
  { id: "r", value: 4, x: 4, y: 0 },
  { id: "l", value: 2, x: 2, y: 2 },
  { id: "ri", value: 6, x: 6, y: 2 },
  { id: "ll", value: 1, x: 1, y: 4 },
  { id: "lr", value: 3, x: 3, y: 4 },
  { id: "rl", value: 5, x: 5, y: 4 },
  { id: "rr", value: 7, x: 7, y: 4 },
];

const BALANCED_EDGES: VizEdge[] = [
  { from: "r", to: "l" },
  { from: "r", to: "ri" },
  { from: "l", to: "ll" },
  { from: "l", to: "lr" },
  { from: "ri", to: "rl" },
  { from: "ri", to: "rr" },
];

const INORDER = ["ll", "l", "lr", "r", "rl", "ri", "rr"];

export function buildBinaryTreeDemo(preset = "balanced-5") {
  if (preset !== "balanced-5") {
    return buildBinaryTreeDemo("balanced-5");
  }

  const introViz = treeViz(BALANCED, BALANCED_EDGES);
  const steps = [
    step(
      "intro",
      "A binary tree: each node has at most two children.",
      "Balanced BST with 7 nodes.",
      introViz.elements,
      introViz.edges
    ),
  ];

  const visited = new Set<string>();
  for (let i = 0; i < INORDER.length; i++) {
    const id = INORDER[i];
    const nodes = BALANCED.map((n) => ({
      ...n,
      highlight: (visited.has(n.id) ? "visited" : undefined) as VizElement["highlight"] | undefined,
    }));
    const current = nodes.map((n) => ({
      ...n,
      highlight: (n.id === id ? "current" : n.highlight) as VizElement["highlight"] | undefined,
    }));
    const viz = treeViz(current, BALANCED_EDGES);
    steps.push(
      step(
        `visit-${id}`,
        i === 0 ? "In-order: go left, visit, go right." : `Visit node ${BALANCED.find((n) => n.id === id)?.value}.`,
        `Visiting ${BALANCED.find((n) => n.id === id)?.value}.`,
        viz.elements,
        viz.edges,
        i === 2
          ? {
              question: "In-order on a BST visits values in…",
              options: ["Random order", "Sorted ascending order", "Root-first order"],
              correctIndex: 1,
              hint: "Left → node → right produces sorted output.",
            }
          : undefined
      )
    );
    visited.add(id);
  }

  return steps;
}

export function buildBinaryTreeSandbox(preset: string) {
  return buildBinaryTreeDemo(preset);
}
