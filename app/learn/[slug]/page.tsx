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
    <article className="space-y-10">
      <header className="space-y-4 border-b border-[#d2d2d7] pb-8">
        <Badge variant="muted">
          {lesson.track === "foundations" ? "Foundations" : "Trees & graphs"}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">{lesson.title}</h1>
        <ul className="space-y-1 text-sm text-[#86868b]">
          {lesson.learningGoals.map((g) => (
            <li key={g}>— {g}</li>
          ))}
        </ul>
      </header>

      <section className="space-y-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">Before</h2>
        {lesson.intro.map((p) => (
          <p key={p} className="leading-relaxed text-[#1d1d1f]">
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

      <section className="space-y-3 border-t border-[#d2d2d7] pt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">After</h2>
        {lesson.outro.map((p) => (
          <p key={p} className="leading-relaxed text-[#86868b]">
            {p}
          </p>
        ))}
      </section>

      <footer className="flex flex-wrap gap-4 border-t border-[#d2d2d7] pt-8 text-sm">
        <Link href="/" className="text-[#86868b] no-underline hover:text-[#1d1d1f]">
          ← Index
        </Link>
        {next && (
          <Link href={`/learn/${next.slug}`} className="font-medium text-[#1d1d1f] no-underline hover:opacity-70">
            Next: {next.title} →
          </Link>
        )}
      </footer>
    </article>
  );
}
