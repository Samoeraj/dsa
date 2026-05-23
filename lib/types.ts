export type TrackId = "foundations" | "trees";

export type HighlightRole =
  | "current"
  | "compare"
  | "settled"
  | "pointer"
  | "visited"
  | "frontier"
  | "path"
  | "active";

export type VizElement = {
  id: string;
  kind: "block" | "node" | "cell";
  x: number;
  y: number;
  z?: number;
  value?: string | number;
  label?: string;
  highlight?: HighlightRole;
};

export type VizEdge = {
  from: string;
  to: string;
  highlight?: HighlightRole;
  label?: string;
};

export type MicroPrompt = {
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
};

export type LessonStep = {
  id: string;
  caption: string;
  description: string;
  elements: VizElement[];
  edges?: VizEdge[];
  microPrompt?: MicroPrompt;
};

export type SandboxConfig =
  | {
      type: "array" | "sort";
      minLength: number;
      maxLength: number;
      defaultLength: number;
    }
  | {
      type: "linked-list";
      minLength: number;
      maxLength: number;
      defaultLength: number;
    }
  | {
      type: "stack-queue";
      maxItems: number;
      defaultItems: number;
    }
  | {
      type: "binary-tree";
      presets: string[];
      defaultPreset: string;
    }
  | {
      type: "bfs";
      presets: string[];
      defaultPreset: string;
    };

export type LessonDefinition = {
  slug: string;
  title: string;
  track: TrackId;
  order: number;
  intro: string[];
  outro: string[];
  learningGoals: string[];
  demoSteps: LessonStep[];
  sandbox: SandboxConfig;
};

export type LessonProgress = {
  completed: boolean;
  lastStep: number;
  lastVisited: string;
};

export type ShareParams = {
  lesson?: string;
  step?: number;
  preset?: string;
  length?: number;
};
