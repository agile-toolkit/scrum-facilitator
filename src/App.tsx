import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Screen, CeremonyType, ExportData, RetroNotes } from './types'
import { CEREMONIES } from './data/ceremonies'
import HomeScreen from './components/HomeScreen'
import CeremonyRunner from './components/CeremonyRunner'
import RetroBoard from './components/RetroBoard'
import CeremonyComplete from './components/CeremonyComplete'
import ExportView from './components/ExportView'

interface AppState {
  screen: Screen
  ceremonyType: CeremonyType | null
  exportData: ExportData | null
}

export default function App() {
  const { t, i18n } = useTranslation()
  const [appState, setAppState] = useState<AppState>({
    screen: 'home',
    ceremonyType: null,
    exportData: null,
  })
  const [retroNotes, setRetroNotes] = useState<RetroNotes>({
    wellDone: [],
    toImprove: [],
    actions: [],
  })

  const startCeremony = (type: CeremonyType) => {
    setAppState({ screen: 'ceremony', ceremonyType: type, exportData: null })
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
    setAppState(prev => ({ ...prev, screen: 'complete', exportData: data }))
  }

  const goToExport = () => {
    setAppState(prev => ({ ...prev, screen: 'export' }))
  }

  const goHome = () => {
    setAppState({ screen: 'home', ceremonyType: null, exportData: null })
  }

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
            onClick={() =>
              i18n.changeLanguage(i18n.language.startsWith('ru') ? 'en' : 'ru')
            }
            className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            {i18n.language.startsWith('ru') ? t('lang.en') : t('lang.ru')}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {appState.screen === 'home' && (
          <HomeScreen onSelect={startCeremony} />
        )}
        {appState.screen === 'ceremony' && appState.ceremonyType && (
          <CeremonyRunner
            ceremonyType={appState.ceremonyType}
            retroNotes={retroNotes}
            onRetroNotesChange={setRetroNotes}
            onComplete={completeCeremony}
            onBack={goHome}
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
          <ExportView data={appState.exportData} onBack={() => setAppState(prev => ({ ...prev, screen: 'complete' }))} />
        )}
      </main>
    </div>
  )
}
