import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA — Isometric structures",
  description:
    "Learn data structures and algorithms on a clean isometric board. For beginners and self-learners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[#d2d2d7] bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
            <Link href="/" className="flex items-center gap-2 no-underline hover:opacity-80">
              <span className="h-2 w-2 rounded-full bg-[#d71921]" aria-hidden="true" />
              <span className="text-sm font-semibold tracking-tight text-[#1d1d1f]">DSA</span>
            </Link>
            <nav className="flex gap-6 text-sm text-[#86868b]">
              <Link href="/" className="no-underline hover:text-[#1d1d1f]">
                Index
              </Link>
              <Link href="/learn/array" className="no-underline hover:text-[#1d1d1f]">
                Start
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-5 py-10">{children}</main>
      </body>
    </html>
  );
}
