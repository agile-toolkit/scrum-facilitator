import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, CeremonyType, ExportData, RetroNotes, SessionState, HistoryEntry } from './types'
import { CEREMONIES } from './data/ceremonies'
import { useLocalStorage } from './hooks/useLocalStorage'
import HomeScreen from './components/HomeScreen'
import CeremonyRunner from './components/CeremonyRunner'
import RetroBoard from './components/RetroBoard'
import CeremonyComplete from './components/CeremonyComplete'
import ExportView from './components/ExportView'

const SESSION_KEY = 'scrum-facilitator-session'
const HISTORY_KEY = 'scrum-facilitator-history'

interface AppState {
  screen: Screen
  ceremonyType: CeremonyType | null
  exportData: ExportData | null
  resumeSession: SessionState | null
  exportBackScreen: 'complete' | 'home'
}

export default function App() {
  const { t, i18n } = useTranslation()

  const [sessionOnMount] = useState<SessionState | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const s: SessionState = JSON.parse(raw)
      if (Date.now() - s.savedAt > 24 * 3600 * 1000) return null
      return s
    } catch { return null }
  })

  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(HISTORY_KEY, [])
  const [dismissedResume, setDismissedResume] = useState(false)

  const [appState, setAppState] = useState<AppState>({
    screen: 'home',
    ceremonyType: null,
    exportData: null,
    resumeSession: null,
    exportBackScreen: 'complete',
  })
  const [retroNotes, setRetroNotes] = useState<RetroNotes>({
    wellDone: [],
    toImprove: [],
    actions: [],
  })

  const startCeremony = (type: CeremonyType) => {
    localStorage.removeItem(SESSION_KEY)
    setRetroNotes({ wellDone: [], toImprove: [], actions: [] })
    setAppState({ screen: 'ceremony', ceremonyType: type, exportData: null, resumeSession: null, exportBackScreen: 'complete' })
  }

  const resumeCeremony = () => {
    if (!sessionOnMount) return
    setRetroNotes(sessionOnMount.retroNotes)
    setDismissedResume(true)
    setAppState({ screen: 'ceremony', ceremonyType: sessionOnMount.ceremonyType, exportData: null, resumeSession: sessionOnMount, exportBackScreen: 'complete' })
  }

  const discardSession = () => {
    localStorage.removeItem(SESSION_KEY)
    setDismissedResume(true)
  }

  const completeCeremony = (stepsCompleted: number, participants?: string[]) => {
    const ceremony = CEREMONIES.find(c => c.type === appState.ceremonyType)
    const data: ExportData = {
      ceremonyType: appState.ceremonyType!,
      date: new Date().toLocaleDateString(),
      participants,
      retroNotes: appState.ceremonyType === 'retro' ? retroNotes : undefined,
      stepsCompleted,
      totalSteps: ceremony?.steps.length ?? 0,
    }
    const entry: HistoryEntry = { id: Date.now().toString(), exportData: data, savedAt: Date.now() }
    setHistory([entry, ...history].slice(0, 5))
    localStorage.removeItem(SESSION_KEY)
    setAppState(prev => ({ ...prev, screen: 'complete', exportData: data, resumeSession: null }))
  }

  const goToExport = () => {
    setAppState(prev => ({ ...prev, screen: 'export', exportBackScreen: 'complete' }))
  }

  const viewHistoryEntry = (entry: HistoryEntry) => {
    setAppState(prev => ({ ...prev, screen: 'export', exportData: entry.exportData, exportBackScreen: 'home' }))
  }

  const goHome = () => {
    setAppState({ screen: 'home', ceremonyType: null, exportData: null, resumeSession: null, exportBackScreen: 'complete' })
  }

  const showResumeBanner = !dismissedResume && sessionOnMount !== null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={goHome}
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            {t('app.title')}
          </button>
          <button
            onClick={() => {
              const langs = ['en', 'es', 'be', 'ru']
              const current = langs.find(l => i18n.language.startsWith(l)) ?? 'en'
              const next = langs[(langs.indexOf(current) + 1) % langs.length]
              i18n.changeLanguage(next)
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            {(() => {
              const langs = ['en', 'es', 'be', 'ru']
              const current = langs.find(l => i18n.language.startsWith(l)) ?? 'en'
              const next = langs[(langs.indexOf(current) + 1) % langs.length] as 'en' | 'es' | 'be' | 'ru'
              return t(`lang.${next}`)
            })()}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {appState.screen === 'home' && (
          <HomeScreen
            onSelect={startCeremony}
            session={showResumeBanner ? sessionOnMount : null}
            onResume={resumeCeremony}
            onDiscard={discardSession}
            history={history}
            onViewHistory={viewHistoryEntry}
          />
        )}
        {appState.screen === 'ceremony' && appState.ceremonyType && (
          <CeremonyRunner
            ceremonyType={appState.ceremonyType}
            retroNotes={retroNotes}
            onRetroNotesChange={setRetroNotes}
            onComplete={completeCeremony}
            onBack={goHome}
            resumeSession={appState.resumeSession}
          />
        )}
        {appState.screen === 'retro' && (
          <RetroBoard
            notes={retroNotes}
            onChange={setRetroNotes}
            onExport={goToExport}
            onBack={goHome}
          />
        )}
        {appState.screen === 'complete' && appState.exportData && (
          <CeremonyComplete
            data={appState.exportData}
            onExport={goToExport}
            onHome={goHome}
          />
        )}
        {appState.screen === 'export' && appState.exportData && (
          <ExportView
            data={appState.exportData}
            onBack={() => {
              if (appState.exportBackScreen === 'home') {
                goHome()
              } else {
                setAppState(prev => ({ ...prev, screen: 'complete' }))
              }
            }}
          />
        )}
      </main>
    </div>
  )
}
