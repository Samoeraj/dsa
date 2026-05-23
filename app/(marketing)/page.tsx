import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TRACKS = [
  {
    id: "foundations" as const,
    title: "Foundations",
    description: "Arrays, lists, stacks, queues, sorting.",
  },
  {
    id: "trees" as const,
    title: "Trees & graphs",
    description: "Binary trees and breadth-first search on grids.",
  },
];

const LEGEND = [
  { label: "Active", role: "current" as const },
  { label: "Compare", role: "compare" as const },
  { label: "Done", role: "settled" as const },
  { label: "Link", role: "pointer" as const },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <Badge variant="muted">Beginners</Badge>
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#1d1d1f] md:text-5xl">
          Data structures,
          <br />
          isometric board.
        </h1>
        <p className="max-w-lg text-lg leading-relaxed text-[#86868b]">
          Step through algorithms on a 3D isometric grid. Neutral, readable, no noise — just the
          structure.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/learn/array"
            className="inline-flex h-10 items-center rounded-full bg-[#1d1d1f] px-5 text-sm font-medium text-white no-underline hover:bg-[#424245]"
          >
            Start — Arrays
          </Link>
          <Link
            href="/learn/bfs"
            className="inline-flex h-10 items-center rounded-full border border-[#d2d2d7] bg-white px-5 text-sm font-medium text-[#1d1d1f] no-underline hover:bg-[#f5f5f7]"
          >
            BFS
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#d2d2d7] bg-[#d2d2d7] sm:grid-cols-4">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-3 bg-white px-4 py-3">
            <span
              className="h-3 w-3 rounded-sm border border-[#c7c7cc]"
              style={{
                background:
                  item.role === "current"
                    ? "#1d1d1f"
                    : item.role === "compare"
                      ? "#aeaeb2"
                      : item.role === "settled"
                        ? "#fff"
                        : "#ff9500",
              }}
            />
            <span className="text-xs font-medium text-[#86868b]">{item.label}</span>
          </div>
        ))}
      </section>

      {TRACKS.map((track) => {
        const lessons = LESSONS.filter((l) => l.track === track.id).sort((a, b) => a.order - b.order);
        return (
          <section key={track.id} className="space-y-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">
                {track.id === "foundations" ? "01" : "02"}
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1d1d1f]">{track.title}</h2>
              <p className="mt-1 text-[#86868b]">{track.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {lessons.map((lesson) => (
                <Card key={lesson.slug} className="transition hover:border-[#aeaeb2]">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{lesson.title}</CardTitle>
                      {lesson.slug === "array" && <Badge variant="accent">Start</Badge>}
                    </div>
                    <CardDescription>{lesson.learningGoals[0]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/learn/${lesson.slug}`}
                      className="text-sm font-medium text-[#1d1d1f] no-underline hover:opacity-70"
                    >
                      Open →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
