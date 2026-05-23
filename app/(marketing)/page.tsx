import Link from "next/link";
import { LESSONS } from "@/lib/lessons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const TRACKS = [
  {
    id: "foundations" as const,
    title: "Foundations",
    description: "Arrays, lists, stacks, queues, and your first sort.",
  },
  {
    id: "trees" as const,
    title: "Trees & graphs",
    description: "Binary trees and grid BFS — same playful world, new shapes.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <Badge>Beginners & self-learners</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Learn data structures on an isometric board
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Step through guided demos, answer quick checks, then tweak inputs in sandbox mode — all in a
          playful diorama you can read at a glance.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/learn/array" className="inline-flex h-10 items-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-md no-underline hover:bg-violet-500">
            Start here: Arrays
          </Link>
          <Link href="/learn/bfs" className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 no-underline hover:bg-slate-50">
            Jump to BFS
          </Link>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-violet-100 bg-white/60 p-4 md:grid-cols-4">
        {[
          { label: "Current", color: "bg-blue-400" },
          { label: "Compare", color: "bg-orange-400" },
          { label: "Settled", color: "bg-green-400" },
          { label: "Pointer", color: "bg-purple-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className={`h-4 w-4 rounded ${item.color}`} />
            {item.label}
          </div>
        ))}
      </section>

      {TRACKS.map((track) => {
        const lessons = LESSONS.filter((l) => l.track === track.id).sort((a, b) => a.order - b.order);
        return (
          <section key={track.id} className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{track.title}</h2>
              <p className="text-slate-600">{track.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {lessons.map((lesson, index) => (
                <Card key={lesson.slug} className="transition hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>{lesson.title}</CardTitle>
                      {index > 0 && <Badge variant="muted">Recommended next</Badge>}
                      {lesson.slug === "array" && <Badge>Start here</Badge>}
                    </div>
                    <CardDescription>{lesson.learningGoals[0]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/learn/${lesson.slug}`}
                      className="flex h-10 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 no-underline hover:bg-slate-50"
                    >
                      Open lesson
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
