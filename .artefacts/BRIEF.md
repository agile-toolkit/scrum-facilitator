# Scrum Facilitator — Brief

## Overview

Guided runner for Scrum ceremonies (planning, daily, review, retro): time-boxed agenda, tips, daily participant flow, retro board, Markdown export. React 18, Vite, Tailwind, react-i18next, `localStorage`. Deploy: GitHub Pages.

## Features

- [x] Ceremony picker and per-ceremony agenda with timer (start / pause / reset)
- [x] “Why this step?” and facilitation tips (i18n)
- [x] Daily Scrum — participants, statuses, randomise (`ParticipantPanel.tsx`)
- [x] Retrospective — three columns, sticky notes (`RetroBoard`, `StickyColumn`, `StickyNote`)
- [x] Export summary — Markdown clipboard / download
- [x] EN + RU + persistence
- [x] Locale cleanup — removed `app.subtitle`, `retro.add`, `retro.openBoard`, `common.close` from `en.json`/`ru.json`
- [x] Header language labels — `App.tsx` toggle now uses `t('lang.en')` / `t('lang.ru')`
- [x] ES + BE locale support — full translations for all ceremony steps, tips, and UI strings; 4-language cycle toggle (EN→ES→BE→RU→EN)
- [x] Persistent ceremony history and retro note recovery — auto-saves session to `scrum-facilitator-session` localStorage key; resume banner on home screen if session < 24h old; past 5 completed ceremonies listed on home screen with view-export link
- [x] Multiple retrospective formats — Classic (3 cols), 4Ls (4 cols), Mad-Sad-Glad (3 cols), Sailboat (3 cols); format selector on home screen below retro card and inside RetroBoard header; format stored in `scrum-facilitator-retro-format` localStorage; column labels from i18n `retro.columns.*`; dynamic export renders column headings from i18n keys
- [x] Planning Poker integration — contextual banner on Sprint Planning estimation step (`planning-4`); "Open Planning Poker →" button deep-links to `https://agile-toolkit.github.io/planning-poker/` with `?participants=` query param pre-filled from Daily Scrum participant list; opens in new tab; hint shown when no participants saved

## Backlog

<!-- Append research / review issues -->
- [x] [#4] Feature: Add ES and BE locale support (suite standard EN+ES+BE+RU) — implemented
- [x] [#5] Integration: Export Sprint Review outcomes to Sprint Metrics — implemented
- [x] [#6] Feature: Persistent ceremony history and retro note recovery — implemented
- [x] [#7] Feature: Multiple retrospective formats (4Ls, Mad-Sad-Glad, Sailboat) — implemented
- [ ] [#8] Feature: Audio and visual timer alerts when a ceremony step ends
- [x] [#9] Integration: Launch Planning Poker from Sprint Planning ceremony — implemented

## Tech notes

- Root `README.md` still has HTML comment TODO for screenshots (non-blocking).

## Agent Log

### 2026-05-02 — feat: Planning Poker integration (#9)
- Done: added `triggersPoker?: boolean` to `AgendaStep` type; set `triggersPoker: true` on `planning-4` step in `ceremonies.ts`; rendered contextual banner in `CeremonyRunner.tsx` when step triggers poker; banner reads `sf_participants` state and builds URL `https://agile-toolkit.github.io/planning-poker/?participants=<names>`; "Open Planning Poker →" opens in new tab; hint shown if no participants saved; i18n keys `poker.*` added to all 4 locales
- Issue #9 set to In Review
- Remaining backlog: #8 (audio/visual timer alerts on step end)
- Next task: check issues for human feedback; implement #8 (audio/visual timer alerts) if approved

### 2026-05-02 — feat: Multiple retrospective formats (#7)
- Done: added `RetroFormat` type and `RetroFormatConfig` data in `src/data/retroFormats.ts`; 4 formats: Classic (wellDone/toImprove/actions), 4Ls (liked/learned/lacked/longedFor), Mad-Sad-Glad, Sailboat (wind/anchor/rocks); `RetroColumn` and `RetroNotes` types made generic (string-keyed); format selector added to HomeScreen below retro card; format picker also in RetroBoard header when `onFormatChange` prop provided; format persisted in `scrum-facilitator-retro-format` localStorage; column labels from `retro.columns.*` i18n keys (all 4 locales); ExportView renders dynamic column headings; `retroFormat` saved in session state for resume
- Issue #7 set to In Review
- Remaining backlog: #8 (timer alerts), #9 (Planning Poker integration)
- Next task: check issues for human feedback; implement #8 (audio/visual timer alerts on step end) or #9 (Planning Poker deep-link) if approved

### 2026-05-01 — feat: Persistent ceremony history and retro note recovery (#6)
- Done: added `SessionState` and `HistoryEntry` types; `CeremonyRunner` auto-saves session to `scrum-facilitator-session` on every step/notes/participant change; `App.tsx` reads session on mount, shows resume banner in `HomeScreen` if session < 24h old (Resume / Discard); completing a ceremony saves to `scrum-facilitator-history` (max 5 entries); past ceremonies displayed on home screen with view-export links; i18n keys added to all 4 locales
- Issue #6 set to In Review
- Remaining approved: #7 (retro formats), #9 (Planning Poker integration)
- Next task: implement issue #7 — multiple retrospective formats (4Ls, Mad-Sad-Glad, Sailboat); add format selector to home/retro step; column titles from i18n; store selected format in localStorage

### 2026-05-01 — feat: Export Sprint Review to Sprint Metrics (#5)
- Done: added "Export to Sprint Metrics" button in `ExportView.tsx` (visible only for review ceremony); appends a new `SprintData` entry (`id`, `name=date`, `planned/completed/carriedOver=0`) to `sprint-metrics-sprints` localStorage key; opens Sprint Metrics in new tab; shows 4 s green toast; i18n keys added to all 4 locales
- Issue #5 set to In Review
- Remaining backlog: #6 (session history), #7 (retro formats), #8 (timer alerts), #9 (Planning Poker integration)
- Next task: check needs-review issues for human feedback (#6 persistent history, #7 retro formats, #8 timer alerts, #9 Planning Poker integration)

### 2026-05-01 — feat: ES and BE locale support (#4)
- Done: created `src/i18n/es.json` and `src/i18n/be.json` with full translations (all ceremony steps, tips, UI strings); added `lang.es` and `lang.be` keys to `en.json` and `ru.json`; updated `src/i18n/index.ts` to register ES and BE; updated `App.tsx` language toggle to cycle EN→ES→BE→RU→EN
- Issue #4 set to In Review
- Remaining approved issues: #5 (Sprint Metrics export), #6 (session history), #7 (retro formats), #9 (Planning Poker integration)
- Next task: implement issue #5 — Export Sprint Review outcomes to Sprint Metrics (add button in ExportView.tsx for review ceremony; write to `sprint-metrics-data` localStorage key)

### 2026-04-27 — research: retro formats, timer alerts, Planning Poker integration
- Done: checked open issues (#4–#6, all needs-review, no approved/changes-requested actions needed)
- Created issue #7 (multiple retro formats: 4Ls, Mad-Sad-Glad, Sailboat)
- Created issue #8 (audio+visual timer alerts on step end via Web Audio API)
- Created issue #9 (Planning Poker deep-link from Sprint Planning estimation step)
- Waiting for human review on all six open issues (#4–#9)
- Next task: check needs-review issues for human feedback

### 2026-04-24 — research: market + integration + UX opportunities
- Done: created issues #4 (ES+BE locales), #5 (Sprint Metrics integration), #6 (ceremony session history)
- No approved issues to implement; existing bug #1 (favicon) is tracked but not actioned this run
- Waiting for human review on all three new issues
- Next task: check needs-review issues for human feedback

### 2026-04-19 — feat: i18n locale cleanup and language toggle fix
- Done: removed unused keys `app.subtitle`, `retro.add`, `retro.openBoard`, `common.close` from `en.json` and `ru.json`; replaced raw `'EN'`/`'RU'` in `App.tsx` header with `t('lang.en')`/`t('lang.ru')`
- All BRIEF features implemented — status → stable
- Next task: check needs-review issues for human feedback

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Structured BRIEF; listed orphan i18n keys and lang toggle gap.
- Next task: Remove or wire `app.subtitle`, `retro.add`, `retro.openBoard`, `common.close` in `src/i18n/en.json`+`ru.json`; replace `App.tsx` toggle with `t('lang.en')`/`t('lang.ru')`.
