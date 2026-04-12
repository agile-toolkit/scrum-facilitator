# SPEC — Scrum Facilitator

> Produced by /vadavik. Validated against BRIEF.md and source materials.

## Finalised Feature List

### F-01 Ceremony Selector
- Home screen displays 4 ceremony cards: Sprint Planning, Daily Stand-up, Sprint Review, Retrospective
- Each card shows the ceremony name, recommended time-box, and a one-line description
- Tapping a card enters the ceremony runner for that type

### F-02 Agenda Runner (all ceremonies)
- Each ceremony has a predefined list of time-boxed agenda steps (see data below)
- Steps display: step number, title, recommended duration, "Why this step?" tooltip
- A countdown timer per step: start / pause / reset controls
- Visual progress bar showing time remaining
- "Next step" and "Previous step" navigation
- When all steps complete, a summary screen appears
- Collapsible facilitation tips panel (per ceremony)

### F-03 Daily Stand-up — Participant Turn Tracking
- Before starting Daily, user enters participant names (add/remove)
- During the ceremony, participants are shown in a list
- Tapping a participant marks them as "speaking" (highlighted), then "done" (checked)
- Randomise order button
- Timer runs globally; per-participant sub-timer optional

### F-04 Retrospective Board
- Three columns: "What went well" (green) / "To improve" (yellow) / "Actions" (blue)
- Add sticky note to any column (text input, confirm on Enter)
- Edit sticky note (tap to edit)
- Delete sticky note (swipe or delete button)
- Notes persist in localStorage
- Column note count shown in column header

### F-05 Export Summary
- Available after any ceremony completes, and always from the Retro board
- Produces a formatted Markdown string:
  - Ceremony name, date, participants (if Daily)
  - Retro notes grouped by column
  - Agenda steps completed (with check marks)
- Copy to clipboard button
- Optional: download as .md file

### F-06 Educational Layer
- Each agenda step has a "Why this step?" tooltip (collapsible inline panel)
- Facilitation tips panel: collapsible, per-ceremony, bullet-list of dos & don'ts
- Source attribution: "Based on: Scrum Guide, ICAgile Workbook, Scrum & Kanban"

### F-07 Internationalisation
- All text: EN + RU via react-i18next
- Ceremony names, step labels, tooltips, tips, button labels, column names

### F-08 Persistence
- localStorage keys:
  - `sf_participants` — Daily participant list
  - `sf_retro_{boardId}` — Retro sticky notes
  - `sf_last_ceremony` — Last used ceremony type

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-01 | Home screen shows 4 ceremony cards with correct time-boxes |
| AC-02 | Selecting a ceremony opens agenda with correct steps |
| AC-03 | Countdown timer counts down accurately, pause/resume works |
| AC-04 | "Why this step?" tooltip renders per step |
| AC-05 | Facilitation tips panel collapses/expands |
| AC-06 | Daily: add/remove participants, mark speaking/done |
| AC-07 | Retro: add/edit/delete stickies in 3 columns |
| AC-08 | Retro: notes persist after page reload |
| AC-09 | Export: markdown string includes all data, copies to clipboard |
| AC-10 | EN↔RU switch works on all screens |
| AC-11 | App is responsive at 375px, 768px, 1280px |
| AC-12 | Full keyboard navigation (tab, enter, escape) |

## Ceremony Data

### Sprint Planning (4h for 2-week sprint)
1. Goals & Scope (15 min) — Define Sprint Goal
2. Backlog Review (30 min) — Review top backlog items
3. Capacity Check (15 min) — Team availability
4. Story Breakdown (60 min) — Break stories into tasks
5. Commitment (15 min) — Team commits to Sprint Goal

### Daily Stand-up (15 min)
1. What did I do yesterday? (5 min)
2. What will I do today? (5 min)
3. Any blockers? (5 min)

### Sprint Review (2h)
1. Sprint Goal recap (5 min)
2. Demo completed work (60 min)
3. Stakeholder feedback (30 min)
4. Backlog update (15 min)
5. Retrospective preview (10 min)

### Retrospective (90 min)
1. Set the stage (10 min)
2. Gather data — What went well / To improve (20 min) [triggers Retro Board]
3. Generate insights (20 min)
4. Decide what to do — Actions (10 min) [triggers Retro Board, Actions column]
5. Close the retrospective (5 min)

## Source Material Cross-Reference
- Step scripts: Scrum Meetings Guideline.pdf
- Theory: Workbook (ICAgile - Fundamentals of Agile)_22_11_2013.pdf
- Retro formats: Scrum Retrospectives.pptx
- Practical reference: scrum_xp-from-the-trenches-rus-final.pdf
