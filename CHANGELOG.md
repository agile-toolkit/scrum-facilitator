# Changelog

## Unreleased

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
