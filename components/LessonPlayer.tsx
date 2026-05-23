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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="segmented" role="tablist" aria-label="Lesson mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "demo"}
            onClick={() => {
              setMode("demo");
              setStepIndex(0);
              setPlaying(false);
            }}
          >
            Demo
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "sandbox"}
            onClick={() => {
              setMode("sandbox");
              setStepIndex(0);
              setPlaying(false);
            }}
          >
            Try it
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="muted">
            {stepIndex + 1} / {steps.length}
          </Badge>
          {getLessonProgress(lesson.slug)?.completed && <Badge variant="accent">Done</Badge>}
        </div>
      </div>

      {mode === "sandbox" && (
        <Card>
          <CardContent className="flex flex-wrap items-end gap-6 pt-4">
            {"minLength" in lesson.sandbox && (
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
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
                <span className="font-mono text-sm normal-case tracking-normal text-[#1d1d1f]">{sandboxLength}</span>
              </label>
            )}
            {"presets" in lesson.sandbox && (
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                Preset
                <select
                  value={sandboxPreset}
                  onChange={(e) => {
                    setSandboxPreset(e.target.value);
                    setStepIndex(0);
                  }}
                  className="rounded-lg border border-[#d2d2d7] bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1d1d1f]"
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
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-wider text-[#86868b]">
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

      <IsometricCanvas elements={step.elements} edges={step.edges} />

      <details className="group rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] lg:hidden">
        <summary className="cursor-pointer px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">
          Schematic (flat)
        </summary>
        <div className="border-t border-[#d2d2d7] bg-white">
          <FlatSchematic elements={step.elements} edges={step.edges} />
        </div>
      </details>

      <div aria-live="polite" aria-atomic="true" className="space-y-2 border-t border-[#d2d2d7] pt-6">
        <p className="text-xl font-semibold tracking-tight text-[#1d1d1f]">{step.caption}</p>
        <p className="text-sm leading-relaxed text-[#86868b]">{step.description}</p>
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

      <ol className="mt-8 space-y-2 border-t border-[#d2d2d7] pt-6 text-sm">
        <li className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">Outline</li>
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={cn(
                "text-left text-[#86868b] hover:text-[#1d1d1f]",
                i === stepIndex && "font-medium text-[#1d1d1f]"
              )}
              onClick={() => setStepIndex(i)}
            >
              {String(i + 1).padStart(2, "0")} — {s.caption}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
