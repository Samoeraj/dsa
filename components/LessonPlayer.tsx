"use client";

import { ChevronLeft, ChevronRight, Copy, Pause, Play, RotateCcw, Share2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LessonDefinition } from "@/lib/types";
import { getSandboxSteps } from "@/lib/lessons";
import { getLessonProgress, saveLessonProgress } from "@/lib/progress";
import { buildShareUrl } from "@/lib/share-params";
import { IsometricCanvas } from "./renderers/IsometricCanvas";
import { MicroPrompt } from "./MicroPrompt";

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
    <div className="player-stack">
      <div className="player-toolbar">
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
        <span className="step-meta">
          {stepIndex + 1} / {steps.length}
          {getLessonProgress(lesson.slug)?.completed ? " · Complete" : ""}
        </span>
      </div>

      {mode === "sandbox" && (
        <div className="panel">
          <div className="panel-header">Sandbox</div>
          <div className="panel-body sandbox-row">
            {"minLength" in lesson.sandbox && (
              <label className="field-label">
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
                />
                <span style={{ fontSize: "0.875rem", textTransform: "none", letterSpacing: 0 }}>{sandboxLength}</span>
              </label>
            )}
            {"presets" in lesson.sandbox && (
              <label className="field-label">
                Preset
                <select
                  value={sandboxPreset}
                  onChange={(e) => {
                    setSandboxPreset(e.target.value);
                    setStepIndex(0);
                  }}
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
              <label className="field-label">
                Items
                <input
                  type="range"
                  min={1}
                  max={lesson.sandbox.maxItems}
                  value={sandboxLength}
                  onChange={(e) => setSandboxLength(Number(e.target.value))}
                />
              </label>
            )}
            <button type="button" className="btn btn-secondary" onClick={regenerateSandbox}>
              <RotateCcw size={16} /> Regenerate
            </button>
          </div>
        </div>
      )}

      <IsometricCanvas elements={step.elements} edges={step.edges} />

      <div aria-live="polite" aria-atomic="true" style={{ overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${stepIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <p className="caption-serif">{step.caption}</p>
            <p className="text-muted" style={{ marginTop: "0.5rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step.microPrompt && !promptCleared && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            style={{ overflow: "hidden" }}
          >
            <MicroPrompt prompt={step.microPrompt} onAnswered={() => setPromptCleared(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="controls-row">
        <button type="button" className="icon-btn" onClick={goPrev} disabled={stepIndex === 0} aria-label="Previous step">
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setPlaying((p) => !p)}
          disabled={atEnd || blockedByPrompt}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--primary"
          onClick={goNext}
          disabled={atEnd || blockedByPrompt}
          aria-label="Next step"
        >
          <ChevronRight size={18} />
        </button>
        <button type="button" className="ghost-btn" onClick={() => setStepIndex(0)}>
          Reset
        </button>
        <button type="button" className="ghost-btn" onClick={copyLink} style={{ marginLeft: "auto" }}>
          {copied ? <Copy size={16} /> : <Share2 size={16} />}
          {copied ? "Copied" : "Share step"}
        </button>
      </div>

      <ol className="step-outline">
        <li className="label-caps" style={{ listStyle: "none", marginBottom: "0.5rem" }}>
          Steps
        </li>
        {steps.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              className={i === stepIndex ? "is-active" : undefined}
              onClick={() => setStepIndex(i)}
            >
              {String(i + 1).padStart(2, "0")}. {s.caption}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
