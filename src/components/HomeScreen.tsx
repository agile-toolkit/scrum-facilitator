import { useTranslation } from 'react-i18next'
import { CEREMONIES } from '../data/ceremonies'
import { RETRO_FORMATS } from '../data/retroFormats'
import type { CeremonyType, RetroFormat, SessionState, HistoryEntry } from '../types'
import CeremonyCard from './CeremonyCard'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

interface Props {
  onSelect: (type: CeremonyType) => void
  retroFormat: RetroFormat
  onRetroFormatChange: (f: RetroFormat) => void
  session: SessionState | null
  onResume: () => void
  onDiscard: () => void
  history: HistoryEntry[]
  onViewHistory: (entry: HistoryEntry) => void
}

export default function HomeScreen({ onSelect, retroFormat, onRetroFormatChange, session, onResume, onDiscard, history, onViewHistory }: Props) {
  const { t } = useTranslation()

  const ceremonyName = (type: CeremonyType) => {
    const c = CEREMONIES.find(x => x.type === type)
    return c ? t(c.nameKey) : type
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Resume banner */}
      {session && (
        <div className="rounded-lg bg-brand-50 border border-brand-200 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm text-brand-800">
            {t('history.resumePrompt', { ceremony: ceremonyName(session.ceremonyType), ago: timeAgo(session.savedAt) })}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onResume} className="btn-primary text-sm">
              {t('history.resume')}
            </button>
            <button onClick={onDiscard} className="btn-ghost text-sm">
              {t('history.discard')}
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('home.title')}</h1>
        <p className="text-gray-500 mt-2">{t('home.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CEREMONIES.map(ceremony => (
          <div key={ceremony.type} className="flex flex-col gap-2">
            <CeremonyCard
              ceremony={ceremony}
              onClick={() => onSelect(ceremony.type)}
            />
            {ceremony.type === 'retro' && (
              <div className="px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-500">{t('retro.formatLabel')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {RETRO_FORMATS.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => onRetroFormatChange(fmt.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        fmt.id === retroFormat
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                      }`}
                    >
                      {t(fmt.nameKey)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Past ceremonies */}
      {history.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-700">{t('history.title')}</h2>
          <div className="flex flex-col gap-2">
            {history.map(entry => (
              <div
                key={entry.id}
                className="card px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg">
                    {CEREMONIES.find(c => c.type === entry.exportData.ceremonyType)?.icon ?? '📋'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {ceremonyName(entry.exportData.ceremonyType)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {entry.exportData.date} · {t('history.steps', { done: entry.exportData.stepsCompleted, total: entry.exportData.totalSteps })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onViewHistory(entry)}
                  className="btn-ghost text-sm flex-shrink-0"
                >
                  {t('history.view')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        {t('ceremony.source')}
      </p>
    </div>
  )
}
