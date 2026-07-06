export type CeremonyType = 'planning' | 'daily' | 'review' | 'retro'

export type RetroFormat = 'classic' | 'four-ls' | 'mad-sad-glad' | 'sailboat'

export interface AgendaStep {
  id: string
  titleKey: string
  duration: number        // seconds
  whyKey: string
  triggersRetro?: boolean
  triggersPoker?: boolean
}

export interface Ceremony {
  type: CeremonyType
  nameKey: string
  descKey: string
  totalMinutes: number
  icon: string
  steps: AgendaStep[]
  tipsKeys: string[]
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
  votes?: number
  isAction?: boolean
  owner?: string
}

export type RetroColumn = string

export type RetroNotes = Record<string, StickyNote[]>

export interface ExportData {
  ceremonyType: CeremonyType
  date: string
  teamName?: string
  participants?: string[]
  retroNotes?: RetroNotes
  retroFormat?: RetroFormat
  sprintGoal?: string
  stepsCompleted: number
  totalSteps: number
}

export interface SessionState {
  ceremonyType: CeremonyType
  stepIndex: number
  totalSteps: number
  currentStepId: string
  completedSteps: number
  participants: Participant[]
  participantCount: number
  retroNotes: RetroNotes
  retroNotesCount: number
  retroFormat?: RetroFormat
  teamName?: string
  sprintGoal?: string
  savedAt: number
}

export interface HistoryEntry {
  id: string
  exportData: ExportData
  savedAt: number
}

export type Screen =
  | 'home'
  | 'ceremony'
  | 'retro'
  | 'complete'
  | 'export'

// Record<ceremonyType, Record<stepId, durationSeconds>>
export type TimeboxOverrides = Partial<Record<CeremonyType, Record<string, number>>>
