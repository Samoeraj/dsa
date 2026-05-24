import { blockRow, step } from "./builders";

export function buildInsertionSortDemo(length = 6) {
  const initialValues = [5, 2, 8, 1, 9, 3].slice(0, length);
  // Generate stable objects with unique IDs based on value and original index
  const initial = initialValues.map((v, i) => ({ id: `b-${v}-${i}`, value: v }));

  const steps = [
    step(
      "intro",
      "Insertion sort grows a sorted section from the left.",
      `Unsorted array: ${initialValues.join(", ")}.`,
      blockRow(initial)
    ),
  ];

  const arr = [...initial];
  for (let i = 1; i < arr.length; i++) {
    const keyItem = arr[i];
    const key = keyItem.value;
    const comparing: Record<number, "compare" | "settled" | "current"> = {};
    for (let k = 0; k < i; k++) comparing[k] = "settled";
    comparing[i] = "current";

    steps.push(
      step(
        `pick-${i}`,
        `Pick ${key} at index ${i} to insert into the sorted left side.`,
        `Key ${key} at index ${i}.`,
        blockRow([...arr], comparing),
        undefined,
        i === 1
          ? {
              question: "Which part of the array is already sorted before index 1?",
              options: ["Nothing", "Only index 0", "The whole array"],
              correctIndex: 1,
              hint: "After the first pass, index 0 alone is sorted.",
            }
          : undefined
      )
    );

    let j = i - 1;
    while (j >= 0 && arr[j].value > key) {
      const shiftHighlights: Record<number, "compare" | "settled" | "current"> = {};
      for (let k = 0; k < i; k++) shiftHighlights[k] = "settled";
      shiftHighlights[j] = "compare";
      shiftHighlights[j + 1] = "compare";
      shiftHighlights[i] = "current";

      steps.push(
        step(
          `shift-${i}-${j}`,
          `${arr[j].value} > ${key}: shift ${arr[j].value} right.`,
          `Comparing ${arr[j].value} with key ${key}.`,
          blockRow([...arr], shiftHighlights)
        )
      );

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = keyItem;
    const done: Record<number, "settled"> = {};
    for (let k = 0; k <= i; k++) done[k] = "settled";

    steps.push(
      step(`placed-${i}`, `Place ${key} — sorted section is indices 0..${i}.`, `Key ${key} placed.`, blockRow([...arr], done))
    );
  }

  steps.push(
    step("done", "Array fully sorted!", "All elements settled.", blockRow(arr, Object.fromEntries(arr.map((_, i) => [i, "settled" as const]))))
  );

  return steps;
}

export function buildInsertionSortSandbox(length: number) {
  const initialValues = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  const initial = initialValues.map((v, i) => ({ id: `b-${v}-${i}`, value: v }));

  return [
    step("intro", "Sandbox array — random values generated.", `Length ${length}.`, blockRow(initial)),
    step("search-found", `Sorted array.`, "Sort complete.", blockRow([...initial].sort((a, b) => a.value - b.value), Object.fromEntries(initial.map((_, i) => [i, "settled" as const])))),
  ];
}
