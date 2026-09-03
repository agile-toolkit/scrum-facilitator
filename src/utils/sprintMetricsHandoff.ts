import type { CeremonyType } from '../types'

const CEREMONY_TYPES: CeremonyType[] = ['planning', 'daily', 'review', 'retro']

/**
 * Sprint Metrics' "Start Retro" button (App.tsx, next to the velocity/mood
 * decline alert) writes `sprint-metrics:lastSession` then opens this app
 * with `?ceremony=retro` — a navigation hint to skip Home and jump straight
 * into that ceremony.
 */
export function parseCeremonyParam(search: string): CeremonyType | null {
  const raw = new URLSearchParams(search).get('ceremony')
  return CEREMONY_TYPES.includes(raw as CeremonyType) ? (raw as CeremonyType) : null
}

export interface LastSprintSession {
  projectId: string
  projectName: string
  lastSprintName: string
  lastSprintGoal: string
  lastVelocity: number
  avgVelocity: number
  lastMood: number | null
  targetScope: number
  totalCompleted: number
  sprintsRemaining: number | null
  updatedAt: string
}

const LAST_SESSION_KEY = 'sprint-metrics:lastSession'

export function readLastSprintSession(): LastSprintSession | null {
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<LastSprintSession>
    if (typeof parsed.lastSprintName !== 'string') return null
    return parsed as LastSprintSession
  } catch {
    return null
  }
}

export interface SprintEntry {
  id: string
  name: string
  planned: number
  completed: number
  carriedOver: number
}

interface ProjectRecord {
  id: string
  name: string
  config: unknown
  sprints: SprintEntry[]
  createdAt: string
}

// Sprint Metrics migrated from a single-project model (`sprint-metrics-sprints`)
// to a multi-project one (`sprint-metrics-projects`, an array of ProjectRecord)
// a while back. It only ever reads the legacy key once, when the new key is
// completely empty (src/sprintData.ts, initAppState) — which happens exactly
// once, on the very first visit to Sprint Metrics in a given browser, since
// that first visit immediately creates and saves a default project. Writing
// only to the legacy key (as this used to) meant the "Export to Sprint
// Metrics" button silently did nothing for any user who had ever opened
// Sprint Metrics before: the toast said "added," but nothing showed up.
const PROJECTS_KEY = 'sprint-metrics-projects'
const ACTIVE_PROJECT_KEY = 'sprint-metrics-active-project'
const LEGACY_SPRINTS_KEY = 'sprint-metrics-sprints'

/** Appends a sprint entry to Sprint Metrics' active project, or the legacy key on a fresh install. */
export function appendSprintEntryToSprintMetrics(entry: SprintEntry): void {
  try {
    const projects = JSON.parse(localStorage.getItem(PROJECTS_KEY) ?? '[]') as ProjectRecord[]
    if (Array.isArray(projects) && projects.length > 0) {
      const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY)
      const active = projects.find(p => p.id === activeId) ?? projects[0]
      active.sprints = [...(active.sprints ?? []), entry]
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
      return
    }
  } catch {
    // fall through to the legacy path below
  }
  try {
    const existing = JSON.parse(localStorage.getItem(LEGACY_SPRINTS_KEY) ?? '[]') as SprintEntry[]
    localStorage.setItem(LEGACY_SPRINTS_KEY, JSON.stringify([...existing, entry]))
  } catch {
    // localStorage unavailable (quota, private mode) — nothing more we can do
  }
}
