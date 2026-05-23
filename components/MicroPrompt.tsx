"use client";

import { useState } from "react";
import type { MicroPrompt as MicroPromptType } from "@/lib/types";

type Props = {
  prompt: MicroPromptType;
  onAnswered: (correct: boolean) => void;
};

export function MicroPrompt({ prompt, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (index: number) => {
    setSelected(index);
    const correct = index === prompt.correctIndex;
    if (!correct) setShowHint(true);
    else onAnswered(true);
  };

  return (
    <div className="panel">
      <div className="panel-header">Question</div>
      <div className="panel-body" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <p style={{ fontWeight: 500, margin: 0 }}>{prompt.question}</p>
        <div role="group" aria-label="Answer choices" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {prompt.options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              className={`btn ${selected === i && i === prompt.correctIndex ? "btn-primary" : "btn-secondary"}`}
              style={{ width: "100%", justifyContent: "flex-start" }}
              onClick={() => handleSelect(i)}
              disabled={selected === prompt.correctIndex}
            >
              {opt}
            </button>
          ))}
        </div>
        {showHint && selected !== prompt.correctIndex && (
          <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }} role="status">
            {prompt.hint}
          </p>
        )}
        {selected === prompt.correctIndex && (
          <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }} role="status">
            Correct.
          </p>
        )}
      </div>
    </div>
  );
}
