import { blockRow, step } from "./builders";

export function buildStackQueueDemo() {
  const stack: { id: string; value: number }[] = [];
  let stackCount = 0;

  const stackPush = (v: number) => {
    stackCount++;
    stack.push({ id: `s-${v}-${stackCount}`, value: v });
    return blockRow([...stack], { [stack.length - 1]: "current" });
  };

  const stackPop = () => {
    stack.pop();
    return blockRow([...stack], { [stack.length - 1]: "settled" });
  };

  const stackSteps = [
    step("stack-empty", "A stack is LIFO — last in, first out.", "Empty stack.", blockRow([])),
    step("push-5", "Push 5 onto the stack.", "Stack contains 5.", stackPush(5)),
    step("push-3", "Push 3 — it becomes the new top.", "Stack: 5, 3. Top is 3.", stackPush(3)),
    step("push-8", "Push 8 — again on top.", "Stack: 5, 3, 8.", stackPush(8)),
    step(
      "pop",
      "Pop removes the top (8).",
      "8 removed. Top is now 3.",
      stackPop(),
      undefined,
      {
        question: "Which value will leave the stack on the next pop?",
        options: ["5", "3", "8"],
        correctIndex: 1,
        hint: "Only the top element can be removed.",
      }
    ),
  ];

  const queue: { id: string; value: number }[] = [];
  let queueCount = 0;

  const queuePush = (v: number) => {
    queueCount++;
    queue.push({ id: `q-${v}-${queueCount}`, value: v });
    const highlights: Record<number, "current" | "settled"> = {
      [queue.length - 1]: "current",
      0: "settled",
    };
    return blockRow([...queue], highlights);
  };

  const queuePop = () => {
    queue.shift();
    return blockRow([...queue], { 0: "current" });
  };

  const queueSteps = [
    step("queue-intro", "A queue is FIFO — first in, first out.", "Switching to queue view.", blockRow([])),
    step("enqueue-2", "Enqueue 2 at the back.", "Queue: 2.", queuePush(2)),
    step("enqueue-6", "Enqueue 6.", "Queue: 2, 6.", queuePush(6)),
    step("enqueue-1", "Enqueue 1.", "Queue: 2, 6, 1.", queuePush(1)),
    step("dequeue", "Dequeue removes from the front (2).", "Front removed. Queue: 6, 1.", queuePop()),
  ];

  return [...stackSteps, ...queueSteps];
}

export function buildStackQueueSandbox(itemCount: number) {
  const vals = Array.from({ length: Math.min(itemCount, 5) }, (_, i) => i + 1);
  const items = vals.map((v, i) => ({ id: `s-${v}-${i}`, value: v }));
  return [
    step("sandbox", `Stack demo with ${vals.length} pushes.`, "Sandbox stack run.", blockRow(items, { [vals.length - 1]: "current" })),
  ];
}
