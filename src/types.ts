export type CeremonyType = 'planning' | 'daily' | 'review' | 'retro'

export type RetroFormat = 'classic' | 'four-ls' | 'mad-sad-glad' | 'sailboat' | 'starfish' | 'daki' | 'ssc'

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
  role?: 'team' | 'stakeholder'
}

export interface FeedbackItem {
  id: string
  text: string
  from?: string
  type: 'question' | 'concern' | 'praise'
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

export interface DemoItem {
  id: string
  text: string
  demoed: boolean
  presenter?: string
}

export interface StepTiming {
  stepId: string
  planned: number
  actual: number
}

export interface ExportData {
  ceremonyType: CeremonyType
  date: string
  teamName?: string
  participants?: string[]
  retroNotes?: RetroNotes
  retroFormat?: RetroFormat
  sprintGoal?: string
  impediments?: string[]
  demoItems?: DemoItem[]
  stepTimings?: StepTiming[]
  feedbackItems?: FeedbackItem[]
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
  impediments?: string[]
  demoItems?: DemoItem[]
  stepTimings?: StepTiming[]
  stepStartedAt?: number
  feedbackItems?: FeedbackItem[]
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
