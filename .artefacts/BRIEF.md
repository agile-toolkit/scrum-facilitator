# BRIEF — Scrum Facilitator

## What this app does
An interactive web tool that helps Scrum Masters and team facilitators run better Scrum ceremonies. It provides guided facilitation flows for Sprint Planning, Daily Stand-up, Sprint Review, and Retrospective, with timers, agenda templates, and participant management.

## Target users
Scrum Masters, Agile coaches, team leads facilitating Scrum ceremonies with teams of 3–12 people.

## Core features (MVP)
- Ceremony selector (Planning / Daily / Review / Retro)
- Built-in agenda with time-boxed steps and a countdown timer
- Participant list with turn tracking for Daily stand-up
- Retrospective board with sticky-note columns (What went well / Delta / Actions)
- Export summary as text/markdown

## Educational layer
- Each ceremony has a "Why this step?" tooltip explaining the Scrum rationale
- Facilitation tips panel (collapsible) with dos and don'ts
- Reference to source: Scrum Guide, ICAgile Workbook, Scrum & Kanban book

## Tech stack
React 18 + TypeScript + Vite + Tailwind CSS. No backend needed for MVP (localStorage for session state). Deployed to GitHub Pages.

## Source materials in `.artefacts/`
- `Scrum Meetings Guideline.pdf` — step-by-step ceremony scripts
- `Workbook (ICAgile - Fundamentals of Agile)_22_11_2013.pdf` — ICAgile theory
- `Scrum Retrospectives.pptx` — retrospective formats and facilitation patterns
- `scrum_xp-from-the-trenches-rus-final.pdf` — XP + Scrum practical reference
- `ScrumAndKanbanRuFinal.pdf` — Scrum & Kanban comparative reference

## i18n
English + Russian (react-i18next). All ceremony names, instructions, and tooltips must be translatable.

## Agentic pipeline roles
- `/vadavik` — spec & requirements validation
- `/lojma` — UX/UI design (ceremony flows, timer UI)
- `/laznik` — architecture (component tree, state management)
- `@cmok` — implementation
- `@bahnik` — QA (timer accuracy, mobile touch, keyboard nav)
- `@piarun` — documentation
- `@zlydni` — git commits & GitHub Pages deploy
