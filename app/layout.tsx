import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Factory — Learn structures on the factory floor",
  description:
    "Factorio-inspired isometric visualizations for data structures and algorithms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b-2 border-fact-border bg-fact-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-3 no-underline hover:opacity-90">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm border-2 border-fact-orange bg-fact-panel-light text-xs font-black text-fact-orange">
                D
              </span>
              <span className="text-sm font-bold tracking-wide text-fact-text">DSA Factory</span>
            </Link>
            <nav className="flex gap-6 text-sm font-semibold text-fact-muted">
              <Link href="/" className="no-underline hover:text-fact-copper">
                Blueprints
              </Link>
              <Link href="/learn/array" className="no-underline hover:text-fact-copper">
                Start line
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-5 py-8">{children}</main>
      </body>
    </html>
  );
}
