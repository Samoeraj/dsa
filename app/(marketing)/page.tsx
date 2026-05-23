import Link from "next/link";
import { LESSONS } from "@/lib/lessons";

const TRACKS = [
  {
    id: "foundations" as const,
    title: "Foundations",
    description: "Arrays, linked lists, stacks, queues, and sorting.",
  },
  {
    id: "trees" as const,
    title: "Trees & graphs",
    description: "Binary trees and breadth-first search.",
  },
];

export default function HomePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
      <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <p className="label-caps">For beginners</p>
        <h1 className="heading-display">
          Data structures,
          <br />
          seen in three dimensions.
        </h1>
        <p className="text-lead">
          Step through algorithms on an isometric board. Clear, quiet, and built for understanding.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <Link href="/learn/array" className="btn btn-primary">
            Begin with arrays
          </Link>
          <Link href="/learn/bfs" className="btn btn-secondary">
            Breadth-first search
          </Link>
        </div>
      </section>

      {TRACKS.map((track) => {
        const lessons = LESSONS.filter((l) => l.track === track.id).sort((a, b) => a.order - b.order);
        return (
          <section key={track.id} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <h2 className="heading-section">{track.title}</h2>
              <p className="text-muted" style={{ marginTop: "0.35rem" }}>
                {track.description}
              </p>
            </div>
            <div className="lesson-list">
              {lessons.map((lesson) => (
                <div key={lesson.slug} className="lesson-row">
                  <div>
                    <h3 className="lesson-row__title">{lesson.title}</h3>
                    <p className="text-muted" style={{ marginTop: "0.2rem", fontSize: "0.875rem" }}>
                      {lesson.learningGoals[0]}
                    </p>
                  </div>
                  <Link href={`/learn/${lesson.slug}`} className="lesson-row__link">
                    Open lesson
                  </Link>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
