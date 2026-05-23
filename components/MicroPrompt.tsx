"use client";

import { useState } from "react";
import type { MicroPrompt as MicroPromptType } from "@/lib/types";
import { Button } from "./ui/button";

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
      <div className="panel-header">Quality check</div>
      <div className="space-y-3 p-4">
        <p className="font-semibold text-fact-text">{prompt.question}</p>
        <div className="flex flex-col gap-2" role="group" aria-label="Answer choices">
          {prompt.options.map((opt, i) => (
            <Button
              key={opt}
              variant={selected === i ? (i === prompt.correctIndex ? "default" : "secondary") : "secondary"}
              className="w-full justify-start"
              onClick={() => handleSelect(i)}
              disabled={selected === prompt.correctIndex}
            >
              {opt}
            </Button>
          ))}
        </div>
        {showHint && selected !== prompt.correctIndex && (
          <p className="text-sm text-fact-copper" role="status">
            Hint: {prompt.hint}
          </p>
        )}
        {selected === prompt.correctIndex && (
          <p className="text-sm font-bold text-[#81c784]" role="status">
            Approved — continue.
          </p>
        )}
      </div>
    </div>
  );
}
