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

## Backlog

<!-- Append research / review issues -->
- [ ] [#4] Feature: Add ES and BE locale support (suite standard EN+ES+BE+RU)
- [ ] [#5] Integration: Export Sprint Review outcomes to Sprint Metrics
- [ ] [#6] Feature: Persistent ceremony history and retro note recovery
- [ ] [#7] Feature: Multiple retrospective formats (4Ls, Mad-Sad-Glad, Sailboat)
- [ ] [#8] Feature: Audio and visual timer alerts when a ceremony step ends
- [ ] [#9] Integration: Launch Planning Poker from Sprint Planning ceremony

## Tech notes

- Root `README.md` still has HTML comment TODO for screenshots (non-blocking).

## Agent Log

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
