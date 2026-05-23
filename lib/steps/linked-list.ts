import { linkedNodes, step } from "./builders";

export function buildLinkedListDemo(length = 5) {
  const values = [10, 20, 30, 40, 50].slice(0, length);

  const intro = linkedNodes(values);
  const t1 = linkedNodes(values, { 0: "current" });
  t1.edges[0] = { ...t1.edges[0], highlight: "pointer" };

  const t2 = linkedNodes(values, { 0: "visited", 1: "current" });
  if (t2.edges[1]) t2.edges[1] = { ...t2.edges[1], highlight: "pointer" };

  const extended = [...values, 60];
  const t3 = linkedNodes(extended, {
    [extended.length - 2]: "current",
    [extended.length - 1]: "settled",
  });

  return [
    step("intro", "A linked list chains nodes together with pointers.", `Linked list with ${length} nodes.`, intro.elements, intro.edges),
    step("traverse-1", "Start at head and follow the pointer to the next node.", "Head node highlighted.", t1.elements, t1.edges),
    step(
      "traverse-2",
      "Move to the next node — no index math, just follow the link.",
      "Second node is current.",
      t2.elements,
      t2.edges,
      {
        question: "How do we reach node 2 from the head?",
        options: ["Jump to index 2 in O(1)", "Follow two pointers from the head", "Sort the list first"],
        correctIndex: 1,
        hint: "Linked lists have no random access — walk the chain.",
      }
    ),
    step("insert-end", "Insert 60 at the end — walk to the tail, then link a new node.", "New node 60 appended.", t3.elements, t3.edges),
  ];
}

export function buildLinkedListSandbox(length: number) {
  return buildLinkedListDemo(length);
}
