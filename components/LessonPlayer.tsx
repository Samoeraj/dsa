"use client";

import { ChevronLeft, ChevronRight, Copy, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LessonDefinition } from "@/lib/types";
import { getSandboxSteps } from "@/lib/lessons";
import { getLessonProgress, saveLessonProgress } from "@/lib/progress";
import { buildShareUrl } from "@/lib/share-params";
import { cn } from "@/lib/utils";
import { FlatSchematic } from "./renderers/FlatSchematic";
import { IsometricCanvas } from "./renderers/IsometricCanvas";
import { MicroPrompt } from "./MicroPrompt";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  lesson: LessonDefinition;
  initialStep?: number;
  initialPreset?: string;
  initialLength?: number;
};

export function LessonPlayer({
  lesson,
  initialStep = 0,
  initialPreset,
  initialLength,
}: Props) {
  const [mode, setMode] = useState<"demo" | "sandbox">("demo");
  const [stepIndex, setStepIndex] = useState(initialStep);
  const [playing, setPlaying] = useState(false);
  const [promptCleared, setPromptCleared] = useState(false);
  const [sandboxLength, setSandboxLength] = useState(
    initialLength ??
      ("defaultLength" in lesson.sandbox ? lesson.sandbox.defaultLength : 8)
  );
  const [sandboxPreset, setSandboxPreset] = useState(
    initialPreset ??
      ("defaultPreset" in lesson.sandbox ? lesson.sandbox.defaultPreset : "open-room")
  );
  const [copied, setCopied] = useState(false);
  const [sandboxSeed, setSandboxSeed] = useState(0);

  const steps = useMemo(() => {
    if (mode === "demo") return lesson.demoSteps;
    void sandboxSeed;
    return getSandboxSteps(lesson, { length: sandboxLength, preset: sandboxPreset });
  }, [mode, lesson, sandboxLength, sandboxPreset, sandboxSeed]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const atEnd = stepIndex >= steps.length - 1;

  useEffect(() => {
    const saved = getLessonProgress(lesson.slug);
    if (saved && initialStep === 0) {
      setStepIndex(Math.min(saved.lastStep, lesson.demoSteps.length - 1));
    }
  }, [lesson.slug, lesson.demoSteps.length, initialStep]);

  useEffect(() => {
    saveLessonProgress(lesson.slug, {
      lastStep: stepIndex,
      completed: atEnd && mode === "demo",
    });
  }, [lesson.slug, stepIndex, atEnd, mode]);

  useEffect(() => {
    if (!playing || atEnd) return;
    const id = setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 1400);
    return () => clearInterval(id);
  }, [playing, atEnd, steps.length]);

  useEffect(() => {
    setPromptCleared(false);
  }, [stepIndex, mode]);

  const blockedByPrompt = Boolean(step?.microPrompt) && !promptCleared;

  const goNext = useCallback(() => {
    if (blockedByPrompt) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [blockedByPrompt, steps.length]);

  const goPrev = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const copyLink = async () => {
    const url = buildShareUrl(window.location.origin, lesson.slug, stepIndex, {
      preset: sandboxPreset,
      length: sandboxLength,
    });
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateSandbox = () => {
    setStepIndex(0);
    setPlaying(false);
    setPromptCleared(false);
    setSandboxSeed((s) => s + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={mode === "demo" ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            setMode("demo");
            setStepIndex(0);
            setPlaying(false);
          }}
        >
          Guided demo
        </Button>
        <Button
          variant={mode === "sandbox" ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            setMode("sandbox");
            setStepIndex(0);
            setPlaying(false);
          }}
        >
          Try it
        </Button>
        <Badge variant="muted">
          Step {stepIndex + 1} / {steps.length}
        </Badge>
        {getLessonProgress(lesson.slug)?.completed && <Badge variant="success">Completed</Badge>}
      </div>

      {mode === "sandbox" && (
        <Card className="bg-violet-50/50">
          <CardContent className="flex flex-wrap items-end gap-4 pt-4">
            {"minLength" in lesson.sandbox && (
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Size
                <input
                  type="range"
                  min={lesson.sandbox.minLength}
                  max={lesson.sandbox.maxLength}
                  value={sandboxLength}
                  onChange={(e) => {
                    setSandboxLength(Number(e.target.value));
                    setStepIndex(0);
                  }}
                  className="w-40"
                />
                <span className="text-xs text-slate-500">{sandboxLength}</span>
              </label>
            )}
            {"presets" in lesson.sandbox && (
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Preset
                <select
                  value={sandboxPreset}
                  onChange={(e) => {
                    setSandboxPreset(e.target.value);
                    setStepIndex(0);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  {lesson.sandbox.presets.map((p) => (
                    <option key={p} value={p}>
                      {p.replace(/-/g, " ")}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {"maxItems" in lesson.sandbox && (
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Items
                <input
                  type="range"
                  min={1}
                  max={lesson.sandbox.maxItems}
                  value={sandboxLength}
                  onChange={(e) => setSandboxLength(Number(e.target.value))}
                  className="w-40"
                />
              </label>
            )}
            <Button variant="secondary" size="sm" onClick={regenerateSandbox}>
              <RotateCcw className="h-4 w-4" /> Regenerate
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="rounded-2xl border border-violet-100 bg-gradient-to-b from-sky-50 to-violet-50 p-4">
        <div className="hidden md:block">
          <IsometricCanvas elements={step.elements} edges={step.edges} />
        </div>
        <div className="md:hidden">
          <FlatSchematic elements={step.elements} edges={step.edges} />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="space-y-2">
        <p className="text-lg font-semibold text-slate-900">{step.caption}</p>
        <p className="text-sm text-slate-600">{step.description}</p>
      </div>

      {step.microPrompt && !promptCleared && (
        <MicroPrompt prompt={step.microPrompt} onAnswered={() => setPromptCleared(true)} />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="icon" onClick={goPrev} disabled={stepIndex === 0} aria-label="Previous step">
          <ChevronLeft />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setPlaying((p) => !p)}
          disabled={atEnd || blockedByPrompt}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={goNext}
          disabled={atEnd || blockedByPrompt}
          aria-label="Next step"
        >
          <ChevronRight />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setStepIndex(0)}>
          Reset
        </Button>
        <Button variant="ghost" size="sm" onClick={copyLink} className="ml-auto">
          {copied ? <Copy className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Copied!" : "Share step"}
        </Button>
      </div>

      <ol className="mt-6 space-y-1 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <li className="font-semibold text-slate-800">Lesson outline</li>
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={cn(
                "text-left hover:text-violet-700",
                i === stepIndex && "font-semibold text-violet-700"
              )}
              onClick={() => setStepIndex(i)}
            >
              {i + 1}. {s.caption}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
