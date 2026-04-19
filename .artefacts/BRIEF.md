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

## Tech notes

- Root `README.md` still has HTML comment TODO for screenshots (non-blocking).

## Agent Log

### 2026-04-19 — feat: i18n locale cleanup and language toggle fix
- Done: removed unused keys `app.subtitle`, `retro.add`, `retro.openBoard`, `common.close` from `en.json` and `ru.json`; replaced raw `'EN'`/`'RU'` in `App.tsx` header with `t('lang.en')`/`t('lang.ru')`
- All BRIEF features implemented — status → stable
- Next task: check needs-review issues for human feedback

### 2026-04-19 — docs: BRIEF template (AGENT_AUTONOMOUS)

- Done: Structured BRIEF; listed orphan i18n keys and lang toggle gap.
- Next task: Remove or wire `app.subtitle`, `retro.add`, `retro.openBoard`, `common.close` in `src/i18n/en.json`+`ru.json`; replace `App.tsx` toggle with `t('lang.en')`/`t('lang.ru')`.
