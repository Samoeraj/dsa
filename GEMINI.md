# DSA Diorama

Interactive 2.5D isometric visualizations for learning Data Structures and Algorithms.

## Project Overview

- **Purpose**: A playful, beginner-friendly learning platform for DSA.
- **Tech Stack**: Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Framer Motion, Lucide React, Zod.
- **Key Features**:
  - **Guided Lessons**: Step-by-step demonstrations of algorithms.
  - **Sandbox Mode**: Interactive "Try it" mode for testing concepts with custom inputs.
  - **Dual Rendering**: Isometric SVG for desktop, flat schematic for mobile.
  - **Micro-prompts**: Contextual quizzes to reinforce learning.
  - **Progress Tracking**: Saved in `localStorage`.
  - **Shareable Links**: State serialized into URL parameters.

## Architecture

- **`lib/types.ts`**: Centralized TypeScript definitions for the entire application (Lessons, Steps, VizElements, etc.).
- **`lib/lessons.ts`**: Definition and registry of all available lessons.
- **`lib/steps/`**: Procedural generators for visualization steps (e.g., `array.ts`, `bfs.ts`).
- **`components/LessonPlayer.tsx`**: The main controller for the lesson experience, managing playback, state, and mode switching.
- **`components/renderers/`**: Visual rendering logic. `IsometricCanvas.tsx` handles the 2.5D projection.
- **`app/`**: Next.js App Router structure. `(marketing)` group for landing pages, `learn/[slug]` for lesson pages.

## Development Conventions

- **Visual Logic**: All visualizations are built from `VizElement` and `VizEdge` primitives.
- **Styling**: Uses Tailwind CSS 4. Custom theme variables and base components are defined in `app/globals.css`.
- **Interactivity**: Prefer `framer-motion` for animations.
- **Type Safety**: Ensure all new lesson steps or visualization types are reflected in `lib/types.ts`.
- **State**: Keep the `LessonPlayer` as the source of truth for current lesson state.

## Building and Running

### Development
```bash
npm install
npm run dev
```
Starts the development server at `http://localhost:3000`.

### Production
```bash
npm run build
npm start
```
Builds the application for production and starts the server.

### Linting
```bash
npm run lint
```
Runs ESLint to check for code quality and style issues.

## Adding a New Lesson

1. Define the lesson metadata and sandbox config in `lib/lessons.ts`.
2. Create a new step builder in `lib/steps/`.
3. Export the `buildDemo` and `buildSandbox` functions.
4. Add the new lesson to the `LESSONS` array in `lib/lessons.ts`.
