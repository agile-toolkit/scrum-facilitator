# BRIEF

Derived per [`agent-state.NO-BRIEF.md`](https://github.com/agile-toolkit/.github/blob/main/agent-state.NO-BRIEF.md). There was **no prior** `BRIEF.md`. Sources: `README.md`, `src/i18n/en.json` / `ru.json`, `src/`. Generated **2026-04-19**.

## Product scope (from `README.md`)

- **Ceremony selector** — Planning, Daily, Review, Retro.
- **Agenda runner** — time-boxed steps, countdown (start / pause / reset).
- **“Why this step?”** tooltips and **facilitation tips** per ceremony.
- **Daily participant tracking** — add/remove, speaking/done, randomise order.
- **Retro board** — three columns, sticky notes.
- **Export** — Markdown summary (clipboard / download).
- **EN + RU**, **localStorage** persistence.

## Build

- `npm run build` — **passes** (verified **2026-04-19**).

## TODO / FIXME

- Root `README.md` line ~40: HTML comment `<!-- TODO: add screenshots after first deploy -->` (not under `src/`).

## TODO in `src/`

- None.

## i18n — orphaned keys (no `t('…')` literal in `src/`)

- **`app.subtitle`** — `App.tsx` / `HomeScreen.tsx` use **`home.subtitle`** for the tagline under the main title; **`app.subtitle`** in `en.json` is unused.
- **`retro.add`**, **`retro.openBoard`** — retro UI uses **`retro.addPlaceholder`**, **`retro.save`**, etc.; **`retro.add`** / **`retro.openBoard`** never referenced.
- **`common.close`** — not referenced (confirm before delete).

## i18n — dynamic keys (used)

- **`daily.status.pending`**, **`speaking`**, **`done`** — used via `` t(`daily.status.${p.status}`) `` in `ParticipantPanel.tsx`.

## Hardcoded user-visible strings

- Language toggle: raw **`EN` / `RU`** in `App.tsx` (~71) while **`lang.en`** / **`lang.ru`** exist in locale files — should use `t('lang.en')` / `t('lang.ru')` or a single toggle key.

## Classification (NO-BRIEF)

- **Status:** `in-progress`
- **First next task:** Remove or wire **`app.subtitle`**, **`retro.add`**, **`retro.openBoard`**, **`common.close`** in `src/i18n/en.json` + `ru.json`; replace header language labels in `src/App.tsx` with **`t('lang.en')` / `t('lang.ru')`** (or dedicated `common.lang_toggle` keys).
