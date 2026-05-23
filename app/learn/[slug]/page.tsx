import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/LessonPlayer";
import { Badge } from "@/components/ui/badge";
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
  return { title: `${lesson.title} — DSA Factory` };
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
    <article className="space-y-8">
      <header className="panel overflow-hidden">
        <div className="panel-header">Blueprint</div>
        <div className="space-y-3 p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">
              {lesson.track === "foundations" ? "Line A" : "Line B"}
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-fact-text">{lesson.title}</h1>
          <ul className="space-y-1 text-sm text-fact-muted">
            {lesson.learningGoals.map((g) => (
              <li key={g}>▸ {g}</li>
            ))}
          </ul>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">Briefing</div>
        <div className="space-y-3 p-4 text-fact-text">
          {lesson.intro.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      <LessonPlayer
        lesson={lesson}
        initialStep={shared.step ?? 0}
        initialPreset={shared.preset}
        initialLength={shared.length}
      />

      <section className="panel">
        <div className="panel-header">Debrief</div>
        <div className="space-y-3 p-4 text-fact-muted">
          {lesson.outro.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>
      </section>

      <footer className="flex flex-wrap gap-4 border-t-2 border-fact-border pt-6 text-sm font-semibold">
        <Link href="/" className="text-fact-muted no-underline hover:text-fact-copper">
          ← Blueprints
        </Link>
        {next && (
          <Link href={`/learn/${next.slug}`} className="text-fact-copper no-underline hover:text-fact-orange">
            Next: {next.title} →
          </Link>
        )}
      </footer>
    </article>
  );
}
