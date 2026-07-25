# Scrum Facilitator — Goal

## Problem
Teams running Scrum ceremonies (Sprint Planning, Daily Stand-up, Sprint Review, Retrospective) often drift off time-box, forget the "why" behind an agenda step, and lose the outputs of a meeting (retro notes, action items, sprint goal, impediments, stakeholder feedback) the moment it ends because nothing was written down in a reusable form. Scrum Facilitator gives a facilitator a single guided, time-boxed runner for all four ceremonies with built-in rationale, structured capture of ceremony outputs, and a one-click Markdown export — entirely client-side, no account or server required.

## Audience
Scrum Masters and team facilitators running a live or remote ceremony from a laptop/tablet, typically projecting or screen-sharing the app while the team follows along; also individual team members reviewing exported ceremony summaries afterward. Part of the `agile-toolkit` suite of standalone, localStorage-backed facilitation tools (Planning Poker, Improvement Board, Sprint Metrics, etc.) that share an origin and a design system.

## Success criteria
1. A facilitator can run any of the four ceremonies (Planning, Daily, Review, Retro) end-to-end through a time-boxed agenda with start/pause/reset timer controls and per-step "why this step?" guidance.
2. Ceremony-specific structured capture works: retro sticky-note board (multiple formats, voting, action ownership), Daily impediments, Sprint Goal, Sprint Review demo checklist and stakeholder feedback, and per-step planned-vs-actual timing.
3. In-progress and completed ceremony state survives a page reload or closed tab (localStorage auto-save, resumable session, last-5 ceremony history) with zero backend.
4. A completed ceremony can be exported as a single Markdown document (clipboard or file download) that includes every structured artifact captured during the session.
5. The app is usable by a Russian-, Spanish-, or Belarusian-speaking team (full EN/ES/BE/RU i18n) in either light or dark theme, and on a phone/tablet screen during a stand-up.
6. Sibling `agile-toolkit` apps can hand off into or read from this app without custom integration code — via same-origin localStorage (e.g. dashboard cards reading session/history keys) or deep-link query params (e.g. Planning Poker participant prefill).

## Non-goals
- No backend, database, or server-rendered component — all state lives in the browser via `localStorage`.
- No multi-user real-time sync — one facilitator's browser is the source of truth for a session; it is not a shared live document.
- No authentication or user accounts.
- Not a backlog/issue tracker — action items and impediments are exported as Markdown, not synced to Jira/Trello/GitHub Issues.
- No native mobile app — responsive web only, installable-PWA is a tracked future idea (#56), not current scope.
