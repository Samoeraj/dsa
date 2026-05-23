import { z } from "zod";

const LESSON_SLUGS = [
  "array",
  "linked-list",
  "stack-queue",
  "binary-tree",
  "insertion-sort",
  "bfs",
] as const;

const BFS_PRESETS = ["open-room", "small-maze", "corner-start"] as const;
const TREE_PRESETS = ["balanced-5", "left-heavy", "right-heavy"] as const;

export const shareParamsSchema = z.object({
  lesson: z.enum(LESSON_SLUGS).optional(),
  step: z.coerce.number().int().min(0).max(200).optional(),
  preset: z.string().max(40).optional(),
  length: z.coerce.number().int().min(3).max(16).optional(),
});

export type ParsedShareParams = z.infer<typeof shareParamsSchema>;

export function parseShareParams(
  searchParams: Record<string, string | string[] | undefined>
): ParsedShareParams {
  const raw = {
    lesson: getFirst(searchParams.lesson),
    step: getFirst(searchParams.step),
    preset: getFirst(searchParams.preset),
    length: getFirst(searchParams.length),
  };

  const result = shareParamsSchema.safeParse(raw);
  if (!result.success) return {};

  const data = { ...result.data };

  if (data.preset) {
    const allowed = [...BFS_PRESETS, ...TREE_PRESETS];
    if (!allowed.includes(data.preset as (typeof allowed)[number])) {
      delete data.preset;
    }
  }

  return data;
}

function getFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function buildShareUrl(
  origin: string,
  slug: string,
  step: number,
  extras?: { preset?: string; length?: number }
) {
  const url = new URL(`/learn/${slug}`, origin);
  url.searchParams.set("step", String(step));
  if (extras?.preset) url.searchParams.set("preset", extras.preset);
  if (extras?.length) url.searchParams.set("length", String(extras.length));
  return url.toString();
}
