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
  if (!lesson) return { title: "Lesson not found" };
  return { title: `${lesson.title} — DSA Diorama` };
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
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{lesson.track === "foundations" ? "Foundations" : "Trees & graphs"}</Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">{lesson.title}</h1>
        <ul className="list-inside list-disc text-slate-600">
          {lesson.learningGoals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </header>

      <section className="prose prose-slate max-w-none rounded-2xl border border-violet-100 bg-white/80 p-6">
        <h2 className="mt-0 text-lg font-bold text-violet-900">Before you play</h2>
        {lesson.intro.map((p) => (
          <p key={p} className="text-slate-700">
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

      <section className="prose prose-slate max-w-none rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
        <h2 className="mt-0 text-lg font-bold text-emerald-900">Wrap-up</h2>
        {lesson.outro.map((p) => (
          <p key={p} className="text-slate-700">
            {p}
          </p>
        ))}
      </section>

      <footer className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
        <Link href="/" className="text-sm font-medium text-slate-600">
          ← All lessons
        </Link>
        {next && (
          <Link href={`/learn/${next.slug}`} className="text-sm font-semibold text-violet-700">
            Recommended next: {next.title} →
          </Link>
        )}
      </footer>
    </article>
  );
}
