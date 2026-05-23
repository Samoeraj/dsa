import { blockRow, step } from "./builders";

export function buildArrayDemo(length = 8) {
  const values = [4, 2, 9, 1, 7, 3, 8, 5].slice(0, length);
  const target = 7;
  const targetIndex = values.indexOf(target);

  return [
    step(
      "intro",
      "An array stores items in contiguous slots — like a row of blocks.",
      `Array of ${length} elements.`,
      blockRow(values)
    ),
    step("index-0", "We access index 0 — the first slot.", "Index 0 highlighted.", blockRow(values, { 0: "current" })),
    step(
      "index-3",
      "Jump to index 3 using O(1) direct access.",
      "Index 3 highlighted.",
      blockRow(values, { 3: "current" }),
      undefined,
      {
        question: "Which index holds the value 1?",
        options: ["Index 1", "Index 3", "Index 5"],
        correctIndex: 1,
        hint: "Count from zero: 0→4, 1→2, 2→9, 3→1.",
      }
    ),
    step("search-start", `Linear search for ${target}, starting at index 0.`, "Checking index 0.", blockRow(values, { 0: "compare" })),
    step(
      "search-mid",
      "Not a match — move to the next index.",
      "Index 1 compared.",
      blockRow(values, { 0: "visited", 1: "compare" })
    ),
    step(
      "search-found",
      `Found ${target} at index ${targetIndex}!`,
      `Target at index ${targetIndex}.`,
      blockRow(
        values,
        Object.fromEntries(
          values.map((_, i) => [
            i,
            i === targetIndex ? "settled" : i < targetIndex ? "visited" : undefined,
          ])
        ) as Record<number, "settled" | "visited">
      )
    ),
  ];
}

export function buildArraySandbox(length: number) {
  const values = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  const target = values[Math.floor(values.length / 2)] ?? values[0];
  const targetIndex = values.indexOf(target);

  return [
    step("intro", "Sandbox array — random values generated.", `Length ${length}.`, blockRow(values)),
    step("search-found", `Found ${target} at index ${targetIndex}.`, "Search complete.", blockRow(values, { [targetIndex]: "settled" })),
  ];
}
