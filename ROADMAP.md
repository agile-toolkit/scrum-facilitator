# Scrum Facilitator — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E2: Consistent destructive-action confirmation** — serves signal #1 (session/data integrity, so a team doesn't lose a sprint's worth of ceremony data to a stray click). Two related gaps share one fix pattern: sticky-note delete still uses the browser's native `window.confirm()` (breaks dark theme, inconsistent with the app's custom UI), and the home-screen "Discard" on the resume banner wipes an entire in-progress ceremony with zero confirmation at all. Replace both with the app's inline two-step confirm pattern. https://github.com/agile-toolkit/scrum-facilitator/issues/47, https://github.com/agile-toolkit/scrum-facilitator/issues/55
2. **E3 remainder: Quality hardening** — serves reliability (signal #1) and accessibility. Data-layer test coverage started (`src/data/ceremonies.ts`, `src/data/retroFormats.ts`, 2026-09-02) — still open: `useTimer`/`useLocalStorage`/`RetroBoard` CRUD coverage; separately, the timer-done `animate-pulse` flash ignores `prefers-reduced-motion` (WCAG 2.3.3 gap), a one-line `motion-safe:` fix. https://github.com/agile-toolkit/scrum-facilitator/issues/45, https://github.com/agile-toolkit/scrum-facilitator/issues/46
3. **E4: Installable offline PWA** — serves signal #1 (habit — opens fast even with spotty wifi) and #2. App state is already 100% localStorage-driven with continuous auto-save, making it a strong offline candidate — `vite-plugin-pwa` + manifest, precached app shell, no localStorage contract change. https://github.com/agile-toolkit/scrum-facilitator/issues/56
4. **E5: Bulk history export** — serves signal #1, #3. `scrum-facilitator-history` caps at 5 entries and silently evicts the oldest once full (a team running Daily Scrum alone burns through 5 slots in under a week) — add an "Export all history" action on `HomeScreen.tsx` reusing `ExportView.tsx`'s Markdown renderer. https://github.com/agile-toolkit/scrum-facilitator/issues/57

Blocked, not scheduled: **#1 — Favicon is missing** (bug, `research-more`). Research/spec is finalized (indigo brand-colour scale + geometric SVG), and the same research also found the current green Tailwind scale fails WCAG AA in two spots — but the issue explicitly poses a brand-identity question to a human (keep green + favicon-only fix, or full indigo rebrand) that shouldn't be auto-approved. Not queued for autonomous pickup. https://github.com/agile-toolkit/scrum-facilitator/issues/1

## Recently shipped
**Facilitator Mode persists across suite apps** (2026-09-03) — see `## Shipped`. `useFacilitatorMode`'s storage key changed to the shared `agile-toolkit:facilitatorMode` so the mode survives switching to another suite app in the same tab, per direct user request.

**Replace decorative ✕/×/✓/📋 emoji with SVG icons** (2026-09-03) — see `## Shipped`. Part of a suite-wide emoji→SVG sweep the user asked for; found that 6 delete buttons used `×` (multiplication sign) instead of `✕`, a variant the original sweep's grep missed.

**Hide informational elements in Facilitator Mode** (2026-09-03) — see `## Shipped`. A follow-up user request found `CeremonyRunner`'s Why-tooltip and Facilitation-tips card, both on the live ceremony screen, untouched by Facilitator Mode — the flag was never even threaded down to that component. Fixed.

**Facilitator Mode** (2026-09-03) — see `## Shipped`. A user asked for the presentation/projector mode already built for Team Identity to be adopted suite-wide; this is repo 3 of an 11-repo rollout, adopting the pattern now shared in `design-system/`.

**Fix Export-to-Sprint-Metrics data loss; receive Sprint Metrics' retro handoff** (2026-09-03) — see `## Shipped`. A suite-wide cross-app link audit found "Export to Sprint Metrics" wrote to a legacy key Sprint Metrics stopped reading after anyone's first visit — the button's "added" toast was lying. Fixed to write into the active project. Also wired up `?ceremony=` and `sprint-metrics:lastSession`, both previously unread.

**Fix LanguagePicker dark mode** (2026-09-02) — see `## Shipped`. The design-system's canonical `LanguagePicker.tsx` never got dark-mode classes; this app's copy inherited the gap, same class of bug as the dark-theme fix above but in a different file. Synced with the now-fixed design-system source.

**Fix dark theme** (2026-09-02) — see `## Shipped`. `index.css`'s `.card`/`.btn-secondary`/`.btn-ghost`/`body` dark rules targeted a `.dark` class that the app never sets (theme switches via a `data-theme` attribute) — every ceremony card and 10 other components stayed light-themed with barely-legible text in dark mode. Fixed all four selectors.

**Confirm before discarding an in-progress session** (2026-09-02) — see `## Shipped`. A suite-wide UX audit flagged the resume-session banner's "Discard" button as having no confirmation — one accidental click could lose an in-progress ceremony. Added a confirm dialog.

**Fix: ceremony timebox display bug + data-layer tests** (2026-09-02) — see `## Shipped`. Found during a suite-wide UX/test audit: Sprint Planning and Retrospective each showed a `totalMinutes` on the selection card (240 / 90) that didn't match the sum of their own guided step durations (actually 135 / 65) — Daily and Review were already consistent, so this was drift, not a deliberate buffer. Corrected the two mismatched values and added a `vitest` suite (`ceremonies.test.ts`, `retroFormats.test.ts`) whose totalMinutes-vs-step-sum invariant test guards against the same class of bug recurring; this is also the repo's first automated test coverage (partial E3).

**E1: Team Identity participant import** (2026-09-02) — see `## Shipped`. Adopted a direct read of `team-identity-charter.members[]` rather than the Dashboard's `agile-toolkit:activeTeam` contract, since this needs the full member list, not just a team name — `activeTeam` doesn't carry one. [#44](https://github.com/agile-toolkit/scrum-facilitator/issues/44)

## Repo cleanup (2026-09-02)
Closed 20 stale issues (#4–#43, minus already-open ones) that were `approved` or shipped-but-unclosed — all confirmed already implemented against this file's `## Shipped` list and the current source before closing. See each issue's closing comment for the specific evidence. `ROADMAP.md`'s own `## Shipped` list was accurate throughout; only the GitHub issue state had drifted.

## Polish backlog
No small un-filed items queued — every known gap above already has an open issue. New polish-only findings (no epic-worthy scope, no issue yet) go here.

## Shipped
- ~~Unify Facilitator Mode's storage key to the shared `agile-toolkit:facilitatorMode` so it persists across suite apps~~
- ~~Replace decorative ✕/×/✓/📋 text-glyph buttons with shared SVG icons~~
- ~~Hide CeremonyRunner's Why-tooltip and Facilitation-tips in Facilitator Mode~~
- ~~Facilitator Mode — bigger UI + hidden language picker for in-room presentation, adopted from the shared design-system pattern~~
- ~~Fix Export-to-Sprint-Metrics silently writing to a dead legacy key; receive `?ceremony=`/`sprint-metrics:lastSession` handoffs~~
- ~~Ceremony picker and time-boxed agenda runner (start/pause/reset) with "why this step?" tips~~
- ~~Daily Scrum participant tracking and Retrospective sticky-note board with Markdown export~~
- ~~EN/RU, then full ES + BE locale support (4-language cycle)~~
- ~~Persistent ceremony session, resume banner, and last-5 ceremony history~~
- ~~Multiple retro formats — Classic, 4Ls, Mad-Sad-Glad, Sailboat, Starfish, DAKI, Start-Stop-Continue~~
- ~~Planning Poker deep-link integration from Sprint Planning~~
- ~~Audio/visual timer alerts with mute toggle~~
- ~~Unified AppHeader + LanguagePicker from the shared design system~~
- ~~Light/dark theme support~~
- ~~Keyboard shortcuts for timer and step navigation~~
- ~~Mobile/tablet responsive layout~~
- ~~Named ceremony history (team/label)~~
- ~~Configurable per-step timebox overrides~~
- ~~Retro dot voting and sort-by-votes~~
- ~~Accessibility audit — ARIA roles/labels, live region for timer~~
- ~~Sprint Goal capture, retro action-item ownership, Daily impediment log → Improvement Board link~~
- ~~Sprint Review demo checklist and stakeholder feedback panel~~
- ~~Ceremony time efficiency stats (planned vs. actual per step)~~
- ~~Sticky note drag-to-reorder within a retro column~~

**v0.2.0 — [E1: Team Identity participant import](https://github.com/agile-toolkit/scrum-facilitator/issues/44)** (2026-09-02):
- ~~`ParticipantPanel` reads `team-identity-charter.members[]` and, when the
  participant list is empty, offers a one-click "import N members from Team
  Identity" banner instead of asking the facilitator to re-type names~~
- ~~Dismissible per-browser (`scrum-facilitator-ti-import-dismissed`); never
  shown once `sf_participants` already has entries~~

**v0.2.1 — Fix ceremony timebox display bug + data-layer tests** (2026-09-02):
- ~~Corrected Sprint Planning's and Retrospective's displayed `totalMinutes`
  (240→135, 90→65) to match the sum of their own guided step durations~~
- ~~Added `vitest` + `jsdom`; `ceremonies.test.ts` and `retroFormats.test.ts`~~

**v0.2.2 — Confirm before discarding an in-progress session** (2026-09-02):
- ~~Added a confirm dialog to the resume-session banner's Discard
  button~~

**v0.2.3 — Fix dark theme** (2026-09-02):
- ~~Fixed `.card`/`.btn-secondary`/`.btn-ghost`/`body` dark-mode rules
  that targeted a `.dark` class the app never sets instead of the
  `data-theme="dark"` attribute it actually uses~~

**v0.2.4 — Fix LanguagePicker dark mode** (2026-09-02):
- ~~Synced `LanguagePicker.tsx` with the design-system's now-fixed
  canonical copy — full `dark:` coverage~~
