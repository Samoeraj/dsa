import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA Diorama — Learn data structures in isometric 3D",
  description:
    "Playful isometric visualizations for arrays, linked lists, trees, sorting, and BFS. Built for beginners and self-learners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-violet-100 bg-white/70 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold text-violet-800 no-underline hover:text-violet-600">
              DSA Diorama
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <Link href="/" className="no-underline text-slate-600 hover:text-violet-700">
                Home
              </Link>
              <Link href="/learn/array" className="no-underline text-slate-600 hover:text-violet-700">
                Start learning
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
