"use client";

import { useState } from "react";
import type { MicroPrompt as MicroPromptType } from "@/lib/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
    <Card className="border-amber-200 bg-amber-50/80">
      <CardHeader>
        <CardTitle className="text-base">Quick check</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-medium text-slate-800">{prompt.question}</p>
        <div className="flex flex-col gap-2" role="group" aria-label="Answer choices">
          {prompt.options.map((opt, i) => (
            <Button
              key={opt}
              variant={selected === i ? (i === prompt.correctIndex ? "default" : "secondary") : "secondary"}
              className="justify-start text-left"
              onClick={() => handleSelect(i)}
              disabled={selected === prompt.correctIndex}
            >
              {opt}
            </Button>
          ))}
        </div>
        {showHint && selected !== prompt.correctIndex && (
          <p className="text-sm text-amber-900" role="status">
            Hint: {prompt.hint}
          </p>
        )}
        {selected === prompt.correctIndex && (
          <p className="text-sm font-medium text-emerald-700" role="status">
            Correct — advancing to the next step.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
