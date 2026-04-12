# UX — Scrum Facilitator

> Produced by /lojma. Based on SPEC.md.

## Screen List

| Screen | Route (logical) | Description |
|--------|----------------|-------------|
| Home | `/` | Ceremony selector grid |
| Ceremony | `/ceremony/:type` | Agenda runner with timer |
| Daily | `/ceremony/daily` | Agenda + participant sub-panel |
| Retro Board | `/retro` | 3-column sticky board (embedded in ceremony or standalone) |
| Export | `/export` | Markdown preview + copy/download |

## Component Hierarchy

```
App
├── Header (title, language toggle, back button)
├── HomeScreen
│   └── CeremonyCard × 4
├── CeremonyRunner
│   ├── AgendaProgress (step N of M)
│   ├── AgendaStep
│   │   ├── StepTitle + Duration badge
│   │   ├── CountdownTimer (circular or bar)
│   │   ├── WhyTooltip (collapsible)
│   │   └── TimerControls (start / pause / reset)
│   ├── FacilitationTips (collapsible panel)
│   ├── StepNav (← Prev / Next →)
│   └── [if daily] ParticipantPanel
│       ├── AddParticipant input
│       └── ParticipantCard × N (speaking / done states)
│   └── [if retro step 2 or 4] RetroBoardEmbed
├── RetroBoard (standalone)
│   ├── StickyColumn × 3
│   │   ├── ColumnHeader (label + count)
│   │   ├── StickyNote × N (view/edit/delete)
│   │   └── AddStickyInput
│   └── ExportButton
└── ExportView
    ├── MarkdownPreview
    ├── CopyButton
    └── DownloadButton
```

## Key Interactions

### Ceremony selection
- Tap card → enter CeremonyRunner at step 0
- Cards show: icon, ceremony name, time-box, one-liner

### Timer
- Start → countdown begins (seconds display)
- Pause → timer freezes; Resume → continues
- Reset → returns to step duration
- Visual: circular ring depletes as time passes; turns red at <20%
- Bell sound (optional, on step completion) — skipped for MVP

### Step navigation
- "Next" advances step; timer resets to new step duration
- "Prev" goes back; timer resets
- Progress dots at top (filled = done, current = highlighted, future = empty)

### Daily participant flow
- Enter names before starting (or on first step)
- Cards show: avatar initial, name, status badge
- Status cycle: pending → speaking → done (tap to advance)
- "Randomise" shuffles order
- Speaking card is highlighted; done cards are greyed

### Retro sticky flow
- Tap "+ Add" under any column → inline text input appears
- Enter text + press Enter or click Add → sticky created
- Tap sticky → switches to edit mode (text input inline)
- Delete button (×) top-right of sticky
- Drag-to-reorder: not in MVP

### Export
- Triggered by "Export" button in CeremonyRunner completion screen or RetroBoard
- Shows formatted markdown preview
- "Copy to clipboard" → toast "Copied!"
- "Download .md" → triggers file download

## Responsive Breakpoints

| Width | Layout |
|-------|--------|
| 375px (mobile) | Single column; retro board scrolls horizontally |
| 768px (tablet) | Two-column retro board; sidebar for participants |
| 1280px (desktop) | Three-column retro board side by side; full agenda sidebar |

## Accessibility Notes
- All interactive elements reachable by Tab
- Timer controls have aria-label
- Escape closes tooltips and edit mode
- Sticky note delete asks for confirmation (or undo toast)
- Colour is not the only differentiator for status (badge text + icon)

## State Transitions

```
home → ceremony-runner(type)
ceremony-runner → [last step complete] → ceremony-complete
ceremony-runner(retro, step 2) → retro-board (embedded)
ceremony-complete → export
ceremony-complete → home
retro-board → export
export → home
```
