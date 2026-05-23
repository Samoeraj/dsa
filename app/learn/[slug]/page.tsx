import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/LessonPlayer";
import { LESSONS, getLesson, getLessonSlugs } from "@/lib/lessons";
import { parseShareParams } from "@/lib/share-params";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return getLessonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Not found" };
  return { title: `${lesson.title} — DSA` };
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const query = await searchParams;
  const shared = parseShareParams(query);

  const ordered = [...LESSONS].sort((a, b) => a.order - b.order);
  const idx = ordered.findIndex((l) => l.slug === slug);
  const next = ordered[idx + 1];

  return (
    <article style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <header style={{ paddingBottom: "2rem", borderBottom: "1px solid #e8e6e1" }}>
        <p className="label-caps" style={{ marginBottom: "0.75rem" }}>
          {lesson.track === "foundations" ? "Foundations" : "Trees & graphs"}
        </p>
        <h1 className="heading-lesson">{lesson.title}</h1>
        <ul className="text-muted" style={{ marginTop: "1rem", fontSize: "0.875rem", paddingLeft: 0, listStyle: "none" }}>
          {lesson.learningGoals.map((g) => (
            <li key={g} style={{ marginTop: "0.25rem" }}>
              {g}
            </li>
          ))}
        </ul>
      </header>

      <section>
        <p className="label-caps" style={{ marginBottom: "0.75rem" }}>
          Introduction
        </p>
        {lesson.intro.map((p) => (
          <p key={p} style={{ lineHeight: 1.65, marginBottom: "0.75rem" }}>
            {p}
          </p>
        ))}
      </section>

      <LessonPlayer
        lesson={lesson}
        initialStep={shared.step ?? 0}
        initialPreset={shared.preset}
        initialLength={shared.length}
      />

      <section>
        <p className="label-caps" style={{ marginBottom: "0.75rem" }}>
          Summary
        </p>
        {lesson.outro.map((p) => (
          <p key={p} className="text-muted" style={{ lineHeight: 1.65, marginBottom: "0.75rem" }}>
            {p}
          </p>
        ))}
      </section>

      <footer style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", paddingTop: "2rem", borderTop: "1px solid #e8e6e1", fontSize: "0.875rem" }}>
        <Link href="/" className="text-muted" style={{ textDecoration: "none" }}>
          All lessons
        </Link>
        {next && (
          <Link href={`/learn/${next.slug}`} style={{ fontWeight: 500, textDecoration: "none" }}>
            Next: {next.title}
          </Link>
        )}
      </footer>
    </article>
  );
}
