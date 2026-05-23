import type { LessonProgress } from "./types";

const STORAGE_KEY = "dsa-lesson-progress";

type ProgressStore = Record<string, LessonProgress>;

function readStore(): ProgressStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressStore;
  } catch {
    return {};
  }
}

function writeStore(store: ProgressStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function getLessonProgress(slug: string): LessonProgress | null {
  return readStore()[slug] ?? null;
}

export function saveLessonProgress(slug: string, update: Partial<LessonProgress>) {
  const store = readStore();
  const current = store[slug] ?? {
    completed: false,
    lastStep: 0,
    lastVisited: new Date().toISOString(),
  };
  store[slug] = {
    ...current,
    ...update,
    lastVisited: new Date().toISOString(),
  };
  writeStore(store);
}

export function getAllProgress(): ProgressStore {
  return readStore();
}
