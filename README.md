# Scrum Facilitator

> An interactive Scrum ceremony runner built on Management 3.0 and ICAgile source materials.

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

React 18 · TypeScript · Vite · Tailwind CSS · react-i18next · GitHub Pages

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
| `theme` | `'dark' \| 'light'` | Theme preference (shared key convention with sibling apps' `ThemeToggle`) |

## Tech notes

- **State management** — no global store; each localStorage key is a `useLocalStorage` hook (`src/hooks/useLocalStorage.ts`) backing local component state, kept in sync via `useEffect`. Ceremony session state lives in `CeremonyRunner.tsx` and is auto-saved on every change.
- **i18n** — `react-i18next` with four locale files (`src/i18n/{en,es,be,ru}.json`), a language-cycle toggle in the header (EN→ES→BE→RU→EN), and `i18next-browser-languagedetector` for the initial guess. Locale key parity across all four files is checked manually each release (see `.artefacts/BRIEF.md` agent log).
- **Theme** — Tailwind `darkMode: 'class'`; an anti-flash inline script in `index.html` applies the stored `theme` class before first paint; `ThemeToggle.tsx` is copied in from the shared `agile-toolkit` design system.
- **Cross-app integration** — "Open Planning Poker →" deep-links to `https://agile-toolkit.github.io/planning-poker/` with participants pre-filled via a `?participants=` query param (no localStorage read); the Daily Scrum impediment log deep-links to `https://agile-toolkit.github.io/improvement-board/`. Because all `agile-toolkit` apps share one origin, `localStorage` keys written here are also directly readable by sibling apps (e.g. the suite dashboard).
- **Timer alerts** — a 440 Hz tone via the Web Audio API plus an `animate-pulse` CSS flash when a step's countdown hits zero.

## Screenshots

<!-- TODO: add screenshots after first deploy -->
