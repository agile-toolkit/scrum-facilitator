# Scrum Facilitator — Roadmap

Derived from GOAL.md. Rebuilt when GOAL changes or an epic ships.

## Current epic
None — idle. See `## Next epics` below.

## Next epics
1. **E1: Team Identity participant import** — serves #6. Pre-fill Daily Scrum participants from `team-identity-charter.members[]` (same-origin localStorage written by the `team-identity` app) when `sf_participants` is empty, instead of requiring manual re-entry every ceremony. https://github.com/agile-toolkit/scrum-facilitator/issues/44
2. **E2: Consistent destructive-action confirmation** — serves #3 (session/data integrity). Two related gaps share one fix pattern: sticky-note delete still uses the browser's native `window.confirm()` (breaks dark theme, inconsistent with the app's custom UI), and the home-screen "Discard" on the resume banner wipes an entire in-progress ceremony with zero confirmation at all. Replace both with the app's inline two-step confirm pattern. https://github.com/agile-toolkit/scrum-facilitator/issues/47, https://github.com/agile-toolkit/scrum-facilitator/issues/55
3. **E3: Quality hardening** — serves #1, #5 (reliability, accessibility). No automated test coverage exists yet (start with `useTimer`/`useLocalStorage`/`RetroBoard` CRUD); separately, the timer-done `animate-pulse` flash ignores `prefers-reduced-motion` (WCAG 2.3.3 gap), a one-line `motion-safe:` fix. https://github.com/agile-toolkit/scrum-facilitator/issues/45, https://github.com/agile-toolkit/scrum-facilitator/issues/46
4. **E4: Installable offline PWA** — serves #3, #5. App state is already 100% localStorage-driven with continuous auto-save, making it a strong offline candidate for ceremonies run with spotty wifi — `vite-plugin-pwa` + manifest, precached app shell, no localStorage contract change. https://github.com/agile-toolkit/scrum-facilitator/issues/56
5. **E5: Bulk history export** — serves #3, #4. `scrum-facilitator-history` caps at 5 entries and silently evicts the oldest once full (a team running Daily Scrum alone burns through 5 slots in under a week) — add an "Export all history" action on `HomeScreen.tsx` reusing `ExportView.tsx`'s Markdown renderer. https://github.com/agile-toolkit/scrum-facilitator/issues/57

Blocked, not scheduled: **#1 — Favicon is missing** (bug, `research-more`). Research/spec is finalized (indigo brand-colour scale + geometric SVG), but implementation is blocked on a human decision between colour/icon options — not queued for autonomous pickup. https://github.com/agile-toolkit/scrum-facilitator/issues/1

## Polish backlog
No small un-filed items queued — every known gap above already has an open issue. New polish-only findings (no epic-worthy scope, no issue yet) go here.

## Shipped
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
