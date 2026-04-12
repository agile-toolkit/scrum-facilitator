export type CeremonyType = 'planning' | 'daily' | 'review' | 'retro'

export interface AgendaStep {
  id: string
  titleKey: string
  duration: number        // seconds
  whyKey: string
  triggersRetro?: boolean
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
}

export type RetroColumn = 'wellDone' | 'toImprove' | 'actions'

export interface RetroNotes {
  wellDone: StickyNote[]
  toImprove: StickyNote[]
  actions: StickyNote[]
}

export interface ExportData {
  ceremonyType: CeremonyType
  date: string
  participants?: string[]
  retroNotes?: RetroNotes
  stepsCompleted: number
  totalSteps: number
}

export type Screen =
  | 'home'
  | 'ceremony'
  | 'retro'
  | 'complete'
  | 'export'
