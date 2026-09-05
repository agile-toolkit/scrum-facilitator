# Changelog

## Unreleased

## 0.3.3 — Consistent destructive-action confirmation (2026-09-05)

- **feat**: new `useConfirmAction` hook (`src/hooks/`) — an inline
  two-step confirm: first call arms a ~3s pending state (auto-cancels on
  timeout or blur), second call while armed runs the action.
- **fix**: `StickyNote.tsx`'s delete button replaced `window.confirm()`
  (the only native browser dialog in the app — broke dark theme,
  inconsistent focus/announcement behavior) with the new hook; the
  button shows a red "Sure?" state instead.
- **fix**: `HomeScreen.tsx`'s resume-banner Discard button had zero
  confirmation at all despite being able to destroy an entire
  in-progress ceremony (retro notes, sprint goal, impediments, demo
  checklist, timings) with one click. Now uses the same hook, showing
  "Yes, discard" before actually discarding. `App.tsx`'s
  `discardSession()` no longer confirms itself — confirmation now lives
  in the UI, once, shared by both call sites.
- **fix**: `CountdownTimer.tsx`'s timer-done `animate-pulse` now uses
  Tailwind's `motion-safe:` variant, so it doesn't fire for users who
  set `prefers-reduced-motion` (WCAG 2.3.3 gap) — the existing
  color-change on done state stays as the non-motion signal.
- **chore**: closed #44 (Team Identity participant import) — already
  shipped 2026-09-02, never formally closed.

## 0.3.2 — Add glass effect to the header; dedupe icons.tsx (2026-09-04)

- **fix**: `AppHeader.tsx`'s background changed from opaque `bg-white`/
  `dark:bg-gray-900` to `bg-[var(--glass)] backdrop-blur-sm` — the
  Dashboard's own nav has always had this translucent blur effect, but
  the shared header every app copies did not. User-reported
  inconsistency. This app's header already carried a local
  `dark:border-gray-700`/`dark:bg-brand-700/20` variation from the
  canonical source — left untouched, only the background line changed.
  Verified in both themes.
- **chore**: a concurrent PR against `design-system` (merged before this
  cycle) independently added `ClapperIcon`/`StopwatchIcon`/`PlayIcon`/
  `PauseIcon` to the shared `icons.tsx`, duplicating the
  `ClapperboardIcon`/`StopwatchIcon`/`PlayIcon`/`PauseIcon` this app had
  added locally in 0.3.1 pending its own backport. Synced `icons.tsx`
  fully from the now-canonical source (65 icons) and renamed this app's
  `ClapperboardIcon` usages (`CeremonyComplete.tsx`,
  `DemoChecklistPanel.tsx`) to `ClapperIcon`; `StopwatchIcon`/`PlayIcon`/
  `PauseIcon` kept the same names so no other call sites changed.

## 0.3.1 — Replace remaining decorative emoji with SVG icons (2026-09-04)

- **feat**: finished the emoji→SVG sweep started in 0.2.8 — the ~30
  remaining instances across `HomeScreen`, `CeremonyCard`, `CeremonyRunner`,
  `DemoChecklistPanel`, `CeremonyComplete`, `RetroBoard`, `ExportView`,
  `ImpedimentPanel`, `FacilitationTips`, `FeedbackPanel`, `ParticipantPanel`,
  `StickyColumn`, and `StickyNote` now use the shared `icons.tsx` instead of
  raw emoji. Synced the full file from `design-system/` first (also drops
  the unused, broken `HandshakeIcon` removed there for bad geometry), then
  added 3 new icons this app needed that don't exist upstream yet —
  `ClapperboardIcon` (Demo Checklist), `StopwatchIcon` (overtime badge),
  `PlayIcon`/`PauseIcon` (timer controls) — each rendered and screenshotted
  standalone before use. All three are backport candidates for
  `design-system/components/icons.tsx` next time that repo is picked.
- **refactor**: `Ceremony.icon` (a raw emoji string in `data/ceremonies.ts`)
  removed from the data model — the four ceremony-card icons are now
  looked up by `CeremonyType` via a new `ceremonyIcons.tsx` map instead of
  being carried as string data.
- The `✅` inside `ExportView`'s generated Markdown ("## ✅ Action Items")
  is exported file content, not live UI — left untouched, matching the
  precedent set for Planning Poker's `☕` card value. Inline `→` notation
  (planned → actual duration) and the literal `<Kbd>←</Kbd>`/`<Kbd>→</Kbd>`
  keyboard-shortcut hints are typographic/functional, not decorative —
  also left as-is.
- **ci**: CI Node bumped 20 → 22 and `engines` declared. `jsdom@30` requires
  Node `^22.22.2 || ^24.15.0 || >=26`, so the test step could never have passed
  on the pinned Node 20 — invisible until this release started running the
  tests in CI at all. Builds were unaffected (vite and tsc do not load jsdom).

## 0.3.0 — Error boundary and test-gated deploys (2026-09-03)

- **feat**: `ErrorBoundary` at the root of the app. Every app in the suite reads
  payloads written by *other* apps, historically through `JSON.parse(raw) as T`
  with no runtime check; an unexpected shape threw during render, unmounted the
  tree and left a blank page that a reload could not fix, because the offending
  data was still in localStorage. The fallback offers "clear this app's saved
  data", scoped to this app's own key prefixes so recovery cannot destroy a
  neighbouring app's data on the shared origin.
- **ci**: `npm test` now runs before `npm run build` in `deploy.yml`. The suite
  had 301 passing tests and CI ran them in exactly one repo of eleven.

## 0.2.9 — Facilitator Mode persists across suite apps (2026-09-03)

- **fix**: `useFacilitatorMode`'s storage key changed from
  `'scrum-facilitator:facilitatorMode'` to the shared
  `'agile-toolkit:facilitatorMode'` — user-requested so Facilitator Mode
  survives navigating to another suite app in the same tab instead of
  resetting. sessionStorage is already shared per-origin-per-tab; this
  was previously app-prefixed specifically to keep it isolated, which
  turned out to be the wrong default for a cross-app presentation
  session.

## 0.2.8 — Replace decorative ✕/×/✓/📋 emoji with SVG icons (2026-09-03)

- **feat**: replaced 9 decorative text glyphs — the last-sprint-banner
  dismiss (`✕`), the copy-export button's clipboard/checkmark toggle
  (`📋`/`✓`), a participant's done-status avatar swap (`✓`), and 6
  delete buttons across `ParticipantPanel`, `DemoChecklistPanel`,
  `FeedbackPanel`, `ImpedimentPanel`, and `StickyNote` that used `×`
  (multiplication sign) rather than `✕` — with `CloseIcon`/`CheckIcon`/
  `ClipboardIcon` from the new shared `icons.tsx`, `currentColor`
  throughout. The `×` variant wasn't caught by the original suite-wide
  emoji grep (`✕` only); found while fixing this app's other instances —
  worth checking other apps for the same variant.

## 0.2.7 — Hide informational elements in Facilitator Mode (2026-09-03)

- **fix (follow-up)**: `CeremonyRunner`'s "▶ Why this step?" tooltip and
  "💡 Facilitation tips" card — the two educational asides on the live
  ceremony screen, i.e. what's actually projected during a real
  standup/planning/review/retro — weren't gated by Facilitator Mode at
  all, since `CeremonyRunner` never received the flag. Both now hide
  while presenting.

## 0.2.6 — Facilitator Mode (2026-09-03)

- **feat**: added Facilitator (projector) Mode — a presentation toggle for
  in-room ceremonies, bigger UI via one CSS rule (everything sized in
  `rem` scales automatically) plus hiding the language picker while
  active. Toggled from a new header button next to the theme toggle,
  session-scoped via `sessionStorage`. Adopted from the shared
  design-system pattern (`useFacilitatorMode.ts` + `FacilitatorToggle.tsx`),
  originally built for Team Identity.

## 0.2.5 — Fix Export-to-Sprint-Metrics data loss; receive Sprint Metrics' retro handoff (2026-09-03)

- **fix (broken integration, data loss)**: "Export to Sprint Metrics"
  (`ExportView.tsx`, shown after a Sprint Review) wrote the new sprint
  entry to the legacy `sprint-metrics-sprints` key. Sprint Metrics only
  ever reads that key once — on a completely fresh install, before its
  first project is created — which happens automatically on the very
  first visit. For any user who had opened Sprint Metrics before (i.e.
  almost everyone), the button showed a "Sprint added" toast and did
  nothing: the entry landed in a key nothing reads anymore. Found by a
  suite-wide cross-app link audit. Fixed to append into the active
  project inside `sprint-metrics-projects` instead, falling back to the
  legacy key only on a genuinely fresh install. See
  `src/utils/sprintMetricsHandoff.ts` (tested).
- **fix (broken integration)**: Sprint Metrics' "Start Retro" button
  (next to its velocity/mood decline alert) opens this app with
  `?ceremony=retro` and writes `sprint-metrics:lastSession` — neither
  was ever read here. Now `?ceremony=<type>` jumps straight into that
  ceremony instead of requiring a manual click from Home, and the retro
  ceremony shows a dismissible "last sprint" context banner (project,
  sprint name, velocity) when a snapshot is available.

## 0.2.4 — Fix LanguagePicker dark mode (2026-09-02)

- **fix**: `LanguagePicker.tsx` had zero `dark:` classes — same root
  cause class as the 0.2.3 dark-theme fix, but in a different file: the
  design-system's canonical copy never got dark-mode classes, and this
  app's copy inherited the gap. Synced with the now-fixed design-system
  source.

## 0.2.3 — Fix dark theme (2026-09-02)

- **fix**: `src/index.css`'s `.card`, `.btn-secondary`, `.btn-ghost`, and
  `body` dark-mode rules were written against the literal `.dark` CSS
  class (`.dark .card { ... }`), but this app switches themes via a
  `data-theme="dark"` *attribute* on `<html>` (`ThemeToggle.tsx`,
  `tailwind.config.js`'s `darkMode: ['selector', '[data-theme="dark"]']`).
  Since nothing ever gets a literal `class="dark"`, those four rules
  were permanently dead — every ceremony card, and any component using
  `.card`/`.btn-secondary`/`.btn-ghost` (11 components total), stayed on
  a white/light background with barely-legible text in dark mode.
  Changed all four selectors to `[data-theme="dark"] ...`, matching the
  rest of the app. Verified visually in both themes, home screen and
  inside a ceremony.
- Found via user report.

## 0.2.2 — Confirm before discarding an in-progress session (2026-09-02)

- **fix**: the resume-session banner's "Discard" button had no
  confirmation — one accidental click could lose an in-progress
  ceremony session with no way back. Added a confirm dialog, matching
  the pattern already used elsewhere in the suite for destructive
  actions.
- Found via a suite-wide UX audit.

## 0.2.1 — Fix ceremony timebox display bug + data-layer tests (2026-09-02)

- **fix**: Sprint Planning and Retrospective each showed a `totalMinutes`
  on the ceremony selection card (240 / 90) that didn't match the sum of
  their own guided step durations (actually 135 / 65) — found during a
  suite-wide UX audit. Daily and Review were already internally
  consistent, confirming this was drift rather than a deliberate buffer.
  Corrected both values in `src/data/ceremonies.ts`.
- **test**: added `vitest` + `jsdom` (this repo's first automated test
  coverage — partial E3). `ceremonies.test.ts` asserts the
  totalMinutes-vs-step-sum invariant for every ceremony (guarding against
  the exact bug above recurring), plus `getCeremony`/`formatDuration`;
  `retroFormats.test.ts` covers `getRetroFormat`/`emptyNotes` and format
  data-shape invariants. `npm test` now passes cleanly: 2 files, 13 tests.

## 0.2.0 — E1: Team Identity participant import (2026-09-02)

- **feat**: the Daily Scrum participant panel now offers a one-click import
  from Team Identity when the list is empty — reads
  `team-identity-charter.members[]` and shows "Import N members from Team
  Identity: Alice, Bob, ..." with Import/Dismiss actions. Previously every
  ceremony required re-typing the same names already entered in Team
  Identity. Dismissing persists (`scrum-facilitator-ti-import-dismissed`)
  so the banner doesn't reappear once declined; it's never shown if
  participants already exist. i18n: `daily.importFromTeamIdentity` (with
  plural form), `daily.importNames`, `daily.importConfirm`,
  `daily.importDismiss` in EN/ES/BE/RU.
- **docs**: refresh `GOAL.md` from the suite-wide `GOALS.md` platform
  thesis and rebuild `ROADMAP.md` around it.
- **chore**: closed 20 stale GitHub issues (#4–#43) that were already
  shipped or approved-but-unimplemented, confirmed against source before
  closing — no functional change, repo housekeeping only.
- Docs-only: added `.artefacts/GOAL.md` and `.artefacts/ROADMAP.md`, expanded `README.md` with dev commands, a `localStorage` keys table, and tech notes. No behavior change — documents existing functionality that previously only lived in `.artefacts/BRIEF.md`.
- docs: move GOAL.md and ROADMAP.md from .artefacts/ to the repo root.
