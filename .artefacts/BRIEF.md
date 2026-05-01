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

## Backlog

<!-- Append research / review issues -->
- [x] [#4] Feature: Add ES and BE locale support (suite standard EN+ES+BE+RU) — implemented
- [x] [#5] Integration: Export Sprint Review outcomes to Sprint Metrics — implemented
- [ ] [#6] Feature: Persistent ceremony history and retro note recovery
- [ ] [#7] Feature: Multiple retrospective formats (4Ls, Mad-Sad-Glad, Sailboat)
- [ ] [#8] Feature: Audio and visual timer alerts when a ceremony step ends
- [ ] [#9] Integration: Launch Planning Poker from Sprint Planning ceremony

## Tech notes

- Root `README.md` still has HTML comment TODO for screenshots (non-blocking).

## Agent Log

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
