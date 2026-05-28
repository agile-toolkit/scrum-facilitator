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
- [x] Audio and visual timer alerts — 440 Hz Web Audio API beep + `animate-pulse` on countdown circle when step timer hits zero; 🔔/🔇 mute toggle in timer controls; mute preference persisted in `scrum-facilitator-muted` localStorage key; all 4 locales updated
- [x] Unified header — `AppHeader.tsx` + `LanguagePicker.tsx` from design system replace inline header; white sticky h-14 header; dropdown language picker (EN/ES/BE/RU); dashboard grid-icon link
- [x] Light/dark theme — `darkMode: 'class'` in tailwind.config.js; anti-flash inline script in index.html; `ThemeToggle.tsx` from design system in AppHeader children slot; `dark:` variants across all components and retro board colour configs; preference persisted via `theme` localStorage key

## Backlog

<!-- Append research / review issues -->
- [x] [#4] Feature: Add ES and BE locale support (suite standard EN+ES+BE+RU) — implemented
- [x] [#5] Integration: Export Sprint Review outcomes to Sprint Metrics — implemented
- [x] [#6] Feature: Persistent ceremony history and retro note recovery — implemented
- [x] [#7] Feature: Multiple retrospective formats (4Ls, Mad-Sad-Glad, Sailboat) — implemented
- [x] [#8] Feature: Audio and visual timer alerts when a ceremony step ends — implemented
- [x] [#9] Integration: Launch Planning Poker from Sprint Planning ceremony — implemented
- [x] [#18] Unify header: AppHeader component + LanguagePicker — implemented
- [x] [#19] Feature: light/dark theme support (ThemeToggle + dark: Tailwind variants) — implemented

## Tech notes

- Root `README.md` still has HTML comment TODO for screenshots (non-blocking).

## Agent Log

### 2026-05-28 — feat: light/dark theme (#19)
- Done: `darkMode: 'class'` in tailwind.config.js; anti-flash script in index.html `<head>`; copied `ThemeToggle.tsx` from design system to `src/components/`; added `<ThemeToggle />` inside `<AppHeader>` children slot in App.tsx; added `dark:` Tailwind variants to all components (AppHeader, HomeScreen, CeremonyCard, CeremonyRunner, CountdownTimer, ParticipantPanel, RetroBoard, StickyColumn, StickyNote, CeremonyComplete, ExportView, FacilitationTips, WhyTooltip); updated `retroFormats.ts` to include dark variants in all `colorClass` and `headerColor` strings; updated `index.css` body and component classes (`.card`, `.btn-secondary`, `.btn-ghost`) with dark rules; fixed SVG track stroke in CountdownTimer to use `currentColor` with `dark:text-gray-700`
- Issue #19 set to In Review
- Remaining approved: #15 (Dashboard card), #16 (keyboard shortcuts), #17 (mobile responsiveness)
- Next task: implement #16 (keyboard shortcuts: Space=start/pause, ArrowRight=next step, ArrowLeft=prev step, R=reset timer, M=mute toggle; `useEffect` in CeremonyRunner with `keydown` listener; all 4 locales updated with `keyboard.*` i18n keys)

### 2026-05-25 — feat: unified header (#18)
- Done: copied `AppHeader.tsx` + `LanguagePicker.tsx` from `agile-toolkit.github.io/design-system/components/` into `src/components/`; replaced inline `<header>` block in `App.tsx` with `<AppHeader title={t('app.title')} onTitleClick={goHome} />`; removed cycle-button language toggle logic; issue #18 set to In Review
- Remaining approved: #15 (Dashboard card), #16 (keyboard shortcuts), #17 (mobile responsiveness), #19 (dark mode)
- Next task: implement #19 (light/dark theme: `darkMode: 'class'` in tailwind.config.js, anti-flash script in index.html, copy ThemeToggle.tsx to src/components/, add `<ThemeToggle />` inside AppHeader children slot, add `dark:` variants across all Tailwind classes)

### 2026-05-21 — feat: audio and visual timer alerts (#8)
- Done: `playBeep()` utility in `CeremonyRunner.tsx` uses Web Audio API (440 Hz sine, 300 ms fade); fires on transition from `running → done` via `useRef` + `useEffect`; `animate-pulse` added to `CountdownTimer.tsx` outer div when `timerState === 'done'`; 🔔/🔇 mute toggle button in timer controls persists to `scrum-facilitator-muted` localStorage; `ceremony.mute` + `ceremony.unmute` keys added to all 4 locales (EN/ES/BE/RU)
- Issue #8 set to In Review
- Remaining backlog: #15 (Dashboard card), #16 (keyboard shortcuts), #17 (mobile responsiveness), #18 (header unification), #19 (dark mode), #1 (favicon — research-more)
- Next task: check issues for human feedback; implement #18 (AppHeader + LanguagePicker unification) if approved

### 2026-05-16 — research: favicon/brand audit round 4 (#1, research-more)
- Done: discovered 3 missing indigo tokens in the round-2 proposed scale (brand-200, brand-300, brand-800); found 4 additional files using brand-* not listed in prior audit (index.css, StickyNote.tsx, CeremonyCard.tsx, ParticipantPanel.tsx — all safe, use only brand-500/600/700); noted that moving-motivators now also uses indigo #4f46e5/#6366f1 (uniqueness claim from round 1 outdated); updated issue #1 body with corrected complete 9-shade indigo scale; set issue #1 project status to In Review
- Issue #1: research-more complete — awaiting approval to implement (2 file changes: favicon.svg + tailwind.config.js with corrected 9-shade scale)
- Issue #8 (timer alerts) still needs-review — no action
- Next task: check issues for human feedback; implement #1 (favicon + tailwind rebrand with corrected 9-shade indigo scale) on approval; implement #8 (Web Audio API 440Hz beep + animate-pulse) on approval

### 2026-05-03 — research: additional favicon research (#1, research-more)
- Done: confirmed corrupted favicon (6 non-ISO bytes); confirmed colour conflict with improvement-board (both brand.600 = #16a34a); audited all 8 Tailwind configs — indigo #4f46e5 is unique across all 10 apps; analysed emoji ⏱ vs geometric SVG rendering (emoji unreliable at favicon size, geometric SVG renders identically across all platforms); identified all 18 brand-* usages across 7 components (single tailwind.config.js change updates all); provided complete indigo scale and ready-to-execute implementation plan; updated issue #1 body
- Issue #1 still in review — awaiting human decision on colour and icon approach
- Issue #8 (timer alerts) still needs-review — no action
- Issues #4-#9 with approved label are all already implemented (project status = In Review) — do not re-implement
- Next task: check issues for human feedback; implement #1 (favicon + tailwind rebrand to indigo #4f46e5 + geometric SVG Option B) if approved; implement #8 (Web Audio API 440Hz beep + animate-pulse on timer done) if approved

### 2026-05-02 — research: favicon issue research (#1)
- Done: surveyed all 10 apps' favicon patterns (32×32 SVG, rounded-rect + icon); found scrum-facilitator favicon.svg is corrupted binary; found colour conflict with improvement-board (both #16a34a green); updated issue #1 body with specific SVG proposals (indigo #4f46e5 + ⏱ emoji or custom clock SVG), asked reviewer to choose approach; set issue #1 project status to In Review
- Issue #8 (timer alerts) still needs-review — no action yet
- Next task: check issues for human feedback; if #1 approved implement favicon SVG fix + tailwind brand colour update; if #8 approved implement Web Audio API beep + animate-pulse flash on timer zero

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
