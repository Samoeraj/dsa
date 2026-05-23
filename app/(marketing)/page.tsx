import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TRACKS = [
  {
    id: "foundations" as const,
    title: "Production line A",
    description: "Arrays, belts, stacks, queues, sorting.",
  },
  {
    id: "trees" as const,
    title: "Production line B",
    description: "Trees and grid logistics (BFS).",
  },
];

const LEGEND = [
  { label: "Selected", color: "#fff59d" },
  { label: "Comparing", color: "#ff8a65" },
  { label: "Sorted", color: "#81c784" },
  { label: "Belt link", color: "#ffd54f" },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-5">
        <Badge>Beginners welcome</Badge>
        <h1 className="text-4xl font-black leading-tight tracking-tight text-fact-text md:text-5xl">
          Build intuition
          <br />
          <span className="text-fact-orange">on the factory floor.</span>
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-fact-muted">
          Data structures as crates, pointers as conveyor belts, algorithms as production steps —
          isometric, playful, Factorio-inspired.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/learn/array" className="inline-flex h-10 items-center rounded-sm border-2 border-[#c46a10] bg-gradient-to-b from-fact-orange to-[#c46a10] px-5 text-sm font-bold text-[#1a1000] no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110">
            Start: Arrays
          </Link>
          <Link href="/learn/bfs" className="inline-flex h-10 items-center rounded-sm border-2 border-fact-border-hi bg-fact-panel-light px-5 text-sm font-bold text-fact-text no-underline hover:border-fact-copper">
            Grid BFS
          </Link>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">Signal legend</div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
          {LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-5 w-5 rounded-sm border-2 border-black/30 shadow-inner"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-semibold text-fact-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {TRACKS.map((track, trackIdx) => {
        const lessons = LESSONS.filter((l) => l.track === track.id).sort((a, b) => a.order - b.order);
        return (
          <section key={track.id} className="space-y-4">
            <div>
              <p className="font-mono text-xs font-bold text-fact-copper">LINE {trackIdx + 1}</p>
              <h2 className="text-2xl font-black text-fact-text">{track.title}</h2>
              <p className="text-fact-muted">{track.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {lessons.map((lesson) => (
                <Card key={lesson.slug}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{lesson.title}</CardTitle>
                      {lesson.slug === "array" && <Badge>First</Badge>}
                    </div>
                    <CardDescription>{lesson.learningGoals[0]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/learn/${lesson.slug}`} className="text-sm font-bold text-fact-copper no-underline hover:text-fact-orange">
                      Open blueprint →
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
