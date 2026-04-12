# ARCH — Scrum Facilitator

> Produced by /laznik. Based on SPEC.md + UX.md.

## Component Tree (implementation)

```
src/
├── App.tsx                   — screen router (useState-based, no react-router)
├── types.ts                  — shared TypeScript types
├── main.tsx                  — Vite entry, i18n init
├── index.css                 — Tailwind base
├── data/
│   └── ceremonies.ts         — ceremony definitions (steps, durations, tips, tooltips)
├── hooks/
│   ├── useTimer.ts           — countdown timer logic (setInterval)
│   └── useLocalStorage.ts    — typed localStorage hook
├── i18n/
│   ├── index.ts              — i18next init
│   ├── en.json               — English strings
│   └── ru.json               — Russian strings
└── components/
    ├── Header.tsx            — sticky header, language toggle, back button
    ├── HomeScreen.tsx        — 4 ceremony cards
    ├── CeremonyCard.tsx      — single ceremony card
    ├── CeremonyRunner.tsx    — agenda runner orchestrator
    ├── AgendaStep.tsx        — step title, duration, timer, tooltip
    ├── CountdownTimer.tsx    — SVG circle countdown ring
    ├── WhyTooltip.tsx        — collapsible "why this step" panel
    ├── FacilitationTips.tsx  — collapsible tips panel
    ├── StepNav.tsx           — prev/next buttons + progress dots
    ├── ParticipantPanel.tsx  — Daily stand-up participant list
    ├── ParticipantCard.tsx   — individual participant with status
    ├── RetroBoard.tsx        — 3-column sticky board
    ├── StickyColumn.tsx      — single column with add input
    ├── StickyNote.tsx        — single sticky with edit/delete
    ├── ExportView.tsx        — markdown preview + copy/download
    └── CeremonyComplete.tsx  — completion screen
```

## State Management

**Approach**: `useState` + `useReducer` at App level; no external store.

### App-level state
```ts
type Screen =
  | 'home'
  | 'ceremony'    // + ceremonyType: CeremonyType
  | 'retro'       // standalone retro board
  | 'export'      // + exportData: ExportData
  | 'complete'    // + ceremonyType

interface AppState {
  screen: Screen
  ceremonyType: CeremonyType | null
  exportData: ExportData | null
}
```

### CeremonyRunner state (local)
```ts
interface CeremonyState {
  stepIndex: number
  timerState: 'idle' | 'running' | 'paused' | 'done'
  timeRemaining: number  // seconds
  participants: Participant[]   // Daily only
}
```

### RetroBoard state (local + localStorage)
```ts
interface RetroState {
  notes: {
    wellDone: StickyNote[]
    toImprove: StickyNote[]
    actions: StickyNote[]
  }
}
```

## Types

```ts
export type CeremonyType = 'planning' | 'daily' | 'review' | 'retro'

export interface AgendaStep {
  id: string
  titleKey: string         // i18n key
  duration: number         // seconds
  whyKey: string           // i18n key for tooltip
  triggersRetro?: boolean  // opens retro board inline
}

export interface Ceremony {
  type: CeremonyType
  totalMinutes: number
  steps: AgendaStep[]
  tipsKey: string[]        // i18n keys for facilitation tips
}

export interface Participant {
  id: string
  name: string
  status: 'pending' | 'speaking' | 'done'
}

export interface StickyNote {
  id: string
  text: string
  createdAt: number
}

export interface ExportData {
  ceremonyType: CeremonyType
  date: string
  participants?: string[]
  retroNotes?: RetroState['notes']
  stepsCompleted: number
  totalSteps: number
}
```

## useTimer Hook

```ts
// Returns: { timeRemaining, state, start, pause, reset }
// Uses setInterval with 1s tick
// Clears interval on unmount
```

## useLocalStorage Hook

```ts
// useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void]
// Reads on mount, writes on every update
```

## i18n Key Namespaces

All keys in flat `translation` namespace:

- `app.*` — app title, subtitle
- `home.*` — ceremony cards
- `ceremony.*` — runner labels (step N of M, timer, nav buttons)
- `ceremonies.planning.*` — Planning ceremony steps + tips
- `ceremonies.daily.*` — Daily steps + tips
- `ceremonies.review.*` — Review steps + tips
- `ceremonies.retro.*` — Retro steps + tips
- `daily.*` — participant panel labels
- `retro.*` — column names, add button, etc.
- `export.*` — export screen labels
- `common.*` — back, close, copy, download, etc.

## localStorage Schema

| Key | Type | Description |
|-----|------|-------------|
| `sf_participants` | `Participant[]` JSON | Daily participant list |
| `sf_retro_notes` | `RetroState['notes']` JSON | Retro sticky notes |
| `sf_last_ceremony` | `CeremonyType` string | Last used ceremony |

## GitHub Actions Deploy

Same pattern as moving-motivators. No Firebase env vars needed (no Firebase dependency).

```yaml
# .github/workflows/deploy.yml
# triggers: push to main
# steps: checkout → node 20 → npm ci → npm run build → upload dist → deploy pages
```

## Build Configuration

```ts
// vite.config.ts
base: '/scrum-facilitator/'   // GitHub Pages subpath
```

```json
// tsconfig.json — add "types": ["vite/client"] in compilerOptions
```
