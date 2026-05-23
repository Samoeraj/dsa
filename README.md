# DSA Diorama

Playful **isometric 2.5D** visualizations for learning data structures and algorithms — built for beginners and self-learners.

## Features

- **6 curated lessons**: Arrays, Linked Lists, Stack & Queue, Binary Trees, Insertion Sort, BFS
- **Two tracks** on the home page: Foundations and Trees & graphs
- **Guided demo** → **Try it** sandbox per lesson
- **Micro-prompts** at key steps
- **Dual renderer**: isometric SVG on desktop, flat schematic on mobile
- **Progress** in `localStorage` + **safe share links** (`?step=&preset=&length=`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Import the [GitHub repo](https://github.com/Samoeraj/dsa) on [vercel.com](https://vercel.com)
2. Framework preset: **Next.js**
3. Deploy — no env vars required for v1

## Agent skills

The [grill-me](.agents/skills/grill-me/SKILL.md) skill is available for plan stress-testing. Install others with:

```bash
npx skills experimental_install
```

## Stack

- Next.js 15 (App Router)
- Tailwind CSS 4
- Framer Motion
- Zod (share URL validation)
