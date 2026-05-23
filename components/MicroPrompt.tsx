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
    <div className="rounded-xl border border-[#d2d2d7] bg-white p-5">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">Check</p>
      <p className="mb-4 text-base font-medium text-[#1d1d1f]">{prompt.question}</p>
      <div className="flex flex-col gap-2" role="group" aria-label="Answer choices">
        {prompt.options.map((opt, i) => (
          <Button
            key={opt}
            variant={selected === i ? (i === prompt.correctIndex ? "default" : "secondary") : "secondary"}
            className="w-full justify-start rounded-lg"
            onClick={() => handleSelect(i)}
            disabled={selected === prompt.correctIndex}
          >
            {opt}
          </Button>
        ))}
      </div>
      {showHint && selected !== prompt.correctIndex && (
        <p className="mt-3 text-sm text-[#86868b]" role="status">
          {prompt.hint}
        </p>
      )}
      {selected === prompt.correctIndex && (
        <p className="mt-3 text-sm font-medium text-[#1d1d1f]" role="status">
          Correct.
        </p>
      )}
    </div>
  );
}
