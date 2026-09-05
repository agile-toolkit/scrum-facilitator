# Scrum Facilitator

> An interactive Scrum ceremony runner built on the Scrum Guide and ICAgile source materials.

**Live demo:** https://bthos.github.io/scrum-facilitator/

A guided, time-boxed runner for the four core Scrum ceremonies — Sprint Planning, Daily Stand-up, Sprint Review, and Retrospective. Facilitators get a countdown timer, per-step rationale, structured capture (retro board, sprint goal, impediments, demo checklist, stakeholder feedback), and a one-click Markdown export, all persisted client-side with no backend or account.

See `GOAL.md` for why this exists and its success criteria, and `ROADMAP.md` for what's shipped and what's next.

## Features

- **Ceremony selector** — Sprint Planning, Daily Stand-up, Sprint Review, Retrospective
- **Agenda runner** — time-boxed steps with countdown timer (start / pause / reset)
- **"Why this step?" tooltips** — Scrum rationale for each agenda item
- **Facilitation tips** — collapsible dos & don'ts per ceremony
- **Daily participant tracking** — add/remove participants, mark speaking/done, randomise order
- **Retrospective board** — 3-column sticky-note board (What went well / To improve / Actions)
- **Export** — Markdown summary copy to clipboard or download as `.md`
- **EN + RU** — full internationalisation via react-i18next
- **localStorage persistence** — participants and retro notes survive page reload

## Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS · react-i18next · vite-plugin-pwa · GitHub Pages

## Source Materials

Based on:
- Scrum Guide
- ICAgile Fundamentals of Agile Workbook
- Scrum Retrospectives (facilitation patterns)
- Scrum & Kanban (comparative reference)

## Development

```bash
npm install
npm run dev
```

## Dev commands

| Command | Does |
|---------|------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check (`tsc`) then produce a production build (`vite build`) |
| `npm run preview` | Serve the production build locally for a final check |
| `npm test` | Run the test suite (`vitest run` + `@testing-library/react`) — data layer (`ceremonies.ts`, `retroFormats.ts`, `sprintMetricsHandoff.ts`), hooks (`useTimer`, `useLocalStorage`), and `RetroBoard` note CRUD |

## localStorage keys

All keys below are written by this app (not read from other apps). Because `agile-toolkit` sibling apps share the same origin (`agile-toolkit.github.io`), other apps — notably the suite dashboard — read some of these keys directly (e.g. `scrum-facilitator-session` / `scrum-facilitator-history` for a home-screen dashboard card); that's a read by them, not a write by us.

| Key | Shape | Purpose |
|-----|-------|---------|
| `scrum-facilitator-session` | `{ ceremonyType, stepIndex, totalSteps, currentStepId, completedSteps, participants, participantCount, retroNotes, retroNotesCount, retroFormat, teamName?, sprintGoal?, impediments?, demoItems?, stepTimings?, stepStartedAt?, feedbackItems?, savedAt }` | Auto-saved in-progress ceremony session; powers the resume banner and dashboard reads |
| `scrum-facilitator-history` | `{ id, exportData, savedAt }[]` (max 5) | Completed ceremony summaries, most recent 5 |
| `scrum-facilitator-retro-format` | `RetroFormat` string | Last-selected retrospective format |
| `scrum-facilitator-muted` | `'true' \| 'false'` | Timer audio alert mute preference |
| `scrum-facilitator-demo-items` | `DemoItem[]` | Sprint Review demo checklist pre-filled before the ceremony starts; cleared on completion |
| `scrum-facilitator-team-name` | `string` | Last-used team/label name |
| `scrum-facilitator-timebox-overrides` | `Record<CeremonyType, Record<stepId, seconds>>` | Custom per-step durations |
| `sf_participants` | `Participant[]` | Daily Scrum / Sprint Review participant list |
| `scrum-facilitator-ti-import-dismissed` | `'1'` once dismissed | Suppresses the "Import from Team Identity" banner in `ParticipantPanel` after the facilitator dismisses it once |
| `theme` | `'dark' \| 'light'` | Theme preference (shared key convention with sibling apps' `ThemeToggle`) |
| `scrum-facilitator:facilitatorMode` (`sessionStorage`) | `'1' \| '0'` | Facilitator (projector) mode toggle — per-tab, not persisted across sessions. See `src/components/useFacilitatorMode.ts`. |

**Read from another app:** `team-identity-charter` (written by `team-identity`, shape `{ teamName?: string, members?: string[], ...other charter fields, savedAt: number }` — flat, not nested under a `charter` key). `ParticipantPanel.tsx` reads `members` to offer a one-click import when the participant list is empty, instead of asking the facilitator to re-type names already entered in Team Identity.

## Tech notes

- **State management** — no global store; each localStorage key is a `useLocalStorage` hook (`src/hooks/useLocalStorage.ts`) backing local component state, kept in sync via `useEffect`. Ceremony session state lives in `CeremonyRunner.tsx` and is auto-saved on every change.
- **Ceremony data** (`src/data/ceremonies.ts`) — `totalMinutes` (shown on the ceremony selection card, before any step ever runs) must equal the sum of that ceremony's own step `duration`s; `ceremonies.test.ts` asserts this for every ceremony after Sprint Planning and Retrospective were found drifted (240/90 declared vs. an actual 135/65 minutes of guided steps) during a suite-wide audit.
- **i18n** — `react-i18next` with four locale files (`src/i18n/{en,es,be,ru}.json`), a language-cycle toggle in the header (EN→ES→BE→RU→EN), and `i18next-browser-languagedetector` for the initial guess. Locale key parity across all four files is checked manually each release (see `.artefacts/BRIEF.md` agent log).
- **Theme** — Tailwind `darkMode: 'class'`; an anti-flash inline script in `index.html` applies the stored `theme` class before first paint; `ThemeToggle.tsx` is copied in from the shared `agile-toolkit` design system.
- **Cross-app integration** — "Open Planning Poker →" deep-links to `https://agile-toolkit.github.io/planning-poker/` with participants pre-filled via a `?participants=` query param (no localStorage read); the Daily Scrum impediment log deep-links to `https://agile-toolkit.github.io/improvement-board/`. Because all `agile-toolkit` apps share one origin, `localStorage` keys written here are also directly readable by sibling apps (e.g. the suite dashboard). `ParticipantPanel.tsx` also reads `team-identity-charter.members` to offer a one-click "import from Team Identity" suggestion when the participant list is empty — a point-to-point read chosen over the Dashboard's newer `agile-toolkit:activeTeam` contract because this needs the full member *list*, not just a team name. "Export to Sprint Metrics" (`ExportView.tsx`) appends a sprint entry into Sprint Metrics' active project (`sprint-metrics-projects`, falling back to the legacy `sprint-metrics-sprints` key only on a fresh Sprint Metrics install) — see `src/utils/sprintMetricsHandoff.ts`. That same module also *receives* Sprint Metrics' handoff: `?ceremony=<type>` jumps straight into a ceremony instead of Home, and `sprint-metrics:lastSession` surfaces as a dismissible context banner during a retro.
- **Timer alerts** — a 440 Hz tone via the Web Audio API plus a `motion-safe:animate-pulse` CSS flash (skipped for `prefers-reduced-motion` users, WCAG 2.3.3) when a step's countdown hits zero.
- **Destructive-action confirmation** — `useConfirmAction` (`src/hooks/useConfirmAction.ts`) is a shared inline two-step confirm: first click arms a ~3s pending state, second click (or blur) fires or cancels it. Used by the sticky-note delete button and the resume-banner Discard button — no native `window.confirm()` anywhere in the app.
- **Offline/installable (PWA)** — `vite-plugin-pwa` precaches the built app shell and Google Fonts (`vite.config.ts`), so the app loads and runs offline after a first visit; state is unaffected since it's already 100% `localStorage`-driven. `public/icons/icon.svg` is a temporary placeholder app icon (brand-500 green) — `public/favicon.svg` is corrupted and excluded, tracked separately as a blocked brand decision (#5).

## Screenshots

<!-- TODO: add screenshots after first deploy -->
