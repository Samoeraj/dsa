import type { LessonDefinition, LessonStep } from "./types";
import { buildArrayDemo, buildArraySandbox } from "./steps/array";
import { buildBfsDemo, buildBfsSandbox } from "./steps/bfs";
import { buildBinaryTreeDemo, buildBinaryTreeSandbox } from "./steps/binary-tree";
import { buildInsertionSortDemo, buildInsertionSortSandbox } from "./steps/insertion-sort";
import { buildLinkedListDemo, buildLinkedListSandbox } from "./steps/linked-list";
import { buildStackQueueDemo, buildStackQueueSandbox } from "./steps/stack-queue";

export const LESSONS: LessonDefinition[] = [
  {
    slug: "array",
    title: "Arrays",
    track: "foundations",
    order: 1,
    intro: [
      "Arrays store elements in contiguous memory. Each slot has an index starting at 0.",
      "Watch how direct index access differs from scanning the whole array.",
    ],
    outro: [
      "You can jump to any index in O(1) time, but searching an unsorted array takes O(n).",
    ],
    learningGoals: [
      "Read index labels on an isometric row of blocks",
      "Trace a linear search step by step",
    ],
    demoSteps: buildArrayDemo(8),
    sandbox: { type: "array", minLength: 5, maxLength: 12, defaultLength: 8 },
  },
  {
    slug: "linked-list",
    title: "Linked Lists",
    track: "foundations",
    order: 2,
    intro: [
      "Nodes hold data and a pointer to the next node. No random access — you walk the chain.",
    ],
    outro: ["Insertion at a known position can be O(1), but finding that position is O(n)."],
    learningGoals: ["Follow pointer edges", "Contrast with array indexing"],
    demoSteps: buildLinkedListDemo(5),
    sandbox: { type: "linked-list", minLength: 3, maxLength: 7, defaultLength: 5 },
  },
  {
    slug: "stack-queue",
    title: "Stack & Queue",
    track: "foundations",
    order: 3,
    intro: [
      "Stacks are LIFO (last in, first out). Queues are FIFO (first in, first out).",
      "Same blocks — different rules for what leaves first.",
    ],
    outro: ["Pick the structure that matches your access pattern."],
    learningGoals: ["Identify top vs front", "Predict pop vs dequeue"],
    demoSteps: buildStackQueueDemo(),
    sandbox: { type: "stack-queue", maxItems: 5, defaultItems: 3 },
  },
  {
    slug: "binary-tree",
    title: "Binary Trees",
    track: "trees",
    order: 4,
    intro: [
      "Each node has at most two children. A binary search tree keeps left smaller, right larger.",
    ],
    outro: ["In-order traversal on a BST visits values in sorted order."],
    learningGoals: ["Navigate parent/child layout", "Trace in-order visits"],
    demoSteps: buildBinaryTreeDemo("balanced-5"),
    sandbox: {
      type: "binary-tree",
      presets: ["balanced-5", "left-heavy", "right-heavy"],
      defaultPreset: "balanced-5",
    },
  },
  {
    slug: "insertion-sort",
    title: "Insertion Sort",
    track: "foundations",
    order: 5,
    intro: [
      "Build a sorted left section one element at a time — like sorting playing cards in your hand.",
    ],
    outro: ["Simple and stable; slow for large n, but excellent for teaching sorting logic."],
    learningGoals: ["Track the sorted prefix", "See shifts vs comparisons"],
    demoSteps: buildInsertionSortDemo(6),
    sandbox: { type: "sort", minLength: 4, maxLength: 8, defaultLength: 6 },
  },
  {
    slug: "bfs",
    title: "Breadth-First Search",
    track: "trees",
    order: 6,
    intro: [
      "BFS explores all neighbors at the current depth before going deeper — perfect for shortest paths on grids.",
    ],
    outro: ["On unweighted grids, BFS finds a shortest path."],
    learningGoals: ["See the frontier expand", "Reconstruct the path to the goal"],
    demoSteps: buildBfsDemo("open-room"),
    sandbox: {
      type: "bfs",
      presets: ["open-room", "small-maze", "corner-start"],
      defaultPreset: "open-room",
    },
  },
];

export function getLesson(slug: string): LessonDefinition | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonSlugs(): string[] {
  return LESSONS.map((l) => l.slug);
}

export function getSandboxSteps(
  lesson: LessonDefinition,
  options: { length?: number; preset?: string }
): LessonStep[] {
  const len = options.length ?? ("defaultLength" in lesson.sandbox ? lesson.sandbox.defaultLength : 8);
  const preset = options.preset ?? ("defaultPreset" in lesson.sandbox ? lesson.sandbox.defaultPreset : "");

  switch (lesson.slug) {
    case "array":
      return buildArraySandbox(len);
    case "linked-list":
      return buildLinkedListSandbox(len);
    case "stack-queue":
      return buildStackQueueSandbox(len);
    case "binary-tree":
      return buildBinaryTreeSandbox(preset);
    case "insertion-sort":
      return buildInsertionSortSandbox(len);
    case "bfs":
      return buildBfsSandbox(preset);
    default:
      return lesson.demoSteps;
  }
}
