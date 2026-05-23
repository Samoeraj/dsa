import type { Metadata } from "next";
import { Playfair_Display, Raleway } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DSA — Isometric visualizations",
  description: "Learn data structures and algorithms through clean isometric visualizations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${raleway.variable} ${playfair.variable}`}>
      <body className={raleway.className}>
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="site-logo">
              DSA
            </Link>
            <nav className="site-nav">
              <Link href="/">Lessons</Link>
              <Link href="/learn/array">Start</Link>
            </nav>
          </div>
        </header>
        <main className="site-main">{children}</main>
      </body>
    </html>
  );
}
