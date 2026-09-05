import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CEREMONIES } from '../data/ceremonies'
import { RETRO_FORMATS } from '../data/retroFormats'
import type { CeremonyType, RetroFormat, SessionState, HistoryEntry, TimeboxOverrides, DemoItem } from '../types'
import { useConfirmAction } from '../hooks/useConfirmAction'
import CeremonyCard from './CeremonyCard'
import DemoChecklistPanel from './DemoChecklistPanel'
import { CEREMONY_ICONS } from './ceremonyIcons'
import { TargetIcon, StopwatchIcon } from './icons'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}

function hasSignificantOvertime(exportData: HistoryEntry['exportData']): boolean {
  const timings = exportData.stepTimings
  if (!timings || timings.length === 0) return false
  const totalPlanned = timings.reduce((sum, t) => sum + t.planned, 0)
  const totalActual = timings.reduce((sum, t) => sum + t.actual, 0)
  return totalPlanned > 0 && totalActual > totalPlanned * 1.2
}

interface Props {
  onSelect: (type: CeremonyType) => void
  retroFormat: RetroFormat
  onRetroFormatChange: (f: RetroFormat) => void
  teamName: string
  onTeamNameChange: (name: string) => void
  recentTeamNames: string[]
  session: SessionState | null
  onResume: () => void
  onDiscard: () => void
  history: HistoryEntry[]
  onViewHistory: (entry: HistoryEntry) => void
  timeboxOverrides: TimeboxOverrides
  onTimeboxOverridesChange: (overrides: TimeboxOverrides) => void
  demoItems: DemoItem[]
  onDemoItemsChange: (items: DemoItem[]) => void
}

export default function HomeScreen({
  onSelect, retroFormat, onRetroFormatChange,
  teamName, onTeamNameChange, recentTeamNames,
  session, onResume, onDiscard, history, onViewHistory,
  timeboxOverrides, onTimeboxOverridesChange,
  demoItems, onDemoItemsChange,
}: Props) {
  const { t } = useTranslation()
  const [openTimebox, setOpenTimebox] = useState<CeremonyType | null>(null)
  const discardConfirm = useConfirmAction(onDiscard)

  const setStepOverride = (type: CeremonyType, stepId: string, seconds: number) => {
    const ceremonyOverrides = { ...(timeboxOverrides[type] ?? {}) }
    ceremonyOverrides[stepId] = Math.max(0, seconds)
    onTimeboxOverridesChange({ ...timeboxOverrides, [type]: ceremonyOverrides })
  }

  const resetCeremonyOverrides = (type: CeremonyType) => {
    const next = { ...timeboxOverrides }
    delete next[type]
    onTimeboxOverridesChange(next)
  }

  const hasOverrides = (type: CeremonyType) => {
    const o = timeboxOverrides[type]
    return o != null && Object.keys(o).length > 0
  }

  const ceremonyName = (type: CeremonyType) => {
    const c = CEREMONIES.find(x => x.type === type)
    return c ? t(c.nameKey) : type
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Resume banner */}
      {session && (
        <div className="rounded-lg bg-brand-50 dark:bg-gray-800 border border-brand-100 dark:border-gray-600 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {session.teamName
              ? t('history.resumePromptTeam', { ceremony: ceremonyName(session.ceremonyType), team: session.teamName, ago: timeAgo(session.savedAt) })
              : t('history.resumePrompt', { ceremony: ceremonyName(session.ceremonyType), ago: timeAgo(session.savedAt) })}
          </span>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onResume} className="btn-primary text-sm">
              {t('history.resume')}
            </button>
            <button
              onClick={() => discardConfirm.trigger()}
              onBlur={() => discardConfirm.cancel()}
              title={discardConfirm.confirming ? t('history.discard_confirm') : undefined}
              className={`text-sm transition-colors ${discardConfirm.confirming ? 'btn-ghost text-red-600 dark:text-red-400 font-medium' : 'btn-ghost'}`}
            >
              {discardConfirm.confirming ? t('history.confirmDiscard') : t('history.discard')}
            </button>
          </div>
        </div>
      )}

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('home.title')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{t('home.subtitle')}</p>
      </div>

      {/* Team name input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {t('team.label')}
        </label>
        <input
          type="text"
          value={teamName}
          onChange={e => onTeamNameChange(e.target.value)}
          placeholder={t('team.placeholder')}
          className="w-full sm:w-72 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500"
        />
        {recentTeamNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recentTeamNames.map(name => (
              <button
                key={name}
                onClick={() => onTeamNameChange(name)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  name === teamName
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CEREMONIES.map(ceremony => (
          <div key={ceremony.type} className="flex flex-col gap-2">
            <CeremonyCard
              ceremony={ceremony}
              onClick={() => onSelect(ceremony.type)}
            />
            {ceremony.type === 'retro' && (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('retro.formatLabel')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {RETRO_FORMATS.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => onRetroFormatChange(fmt.id)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        fmt.id === retroFormat
                          ? 'bg-brand-500 text-white border-brand-500'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-brand-300 hover:text-brand-600'
                      }`}
                    >
                      {t(fmt.nameKey)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {ceremony.type === 'review' && (
              <DemoChecklistPanel items={demoItems} onChange={onDemoItemsChange} />
            )}
            {/* Timebox editor */}
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-1.5">
              <button
                onClick={() => setOpenTimebox(openTimebox === ceremony.type ? null : ceremony.type)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <span>⏱</span>
                <span>{t('timebox.customize')}</span>
                {hasOverrides(ceremony.type) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                )}
                <span className="ml-auto">{openTimebox === ceremony.type ? '▲' : '▼'}</span>
              </button>
              {openTimebox === ceremony.type && (
                <div className="flex flex-col gap-2 pt-1">
                  {ceremony.steps.map(step => {
                    const effective = timeboxOverrides[ceremony.type]?.[step.id] ?? step.duration
                    const mins = Math.floor(effective / 60)
                    const secs = effective % 60
                    return (
                      <div key={step.id} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-300 flex-1 min-w-0 truncate">
                          {t(step.titleKey)}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="999"
                          value={mins}
                          onChange={e => setStepOverride(ceremony.type, step.id, +e.target.value * 60 + secs)}
                          className="w-12 text-center px-1 py-0.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
                          aria-label={`${t(step.titleKey)} minutes`}
                        />
                        <span className="text-xs text-gray-400">m</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={secs}
                          onChange={e => setStepOverride(ceremony.type, step.id, mins * 60 + Math.min(59, +e.target.value))}
                          className="w-12 text-center px-1 py-0.5 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-xs focus:outline-none focus:ring-1 focus:ring-brand-400"
                          aria-label={`${t(step.titleKey)} seconds`}
                        />
                        <span className="text-xs text-gray-400">s</span>
                      </div>
                    )
                  })}
                  {hasOverrides(ceremony.type) && (
                    <button
                      onClick={() => resetCeremonyOverrides(ceremony.type)}
                      className="self-start text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      {t('timebox.resetDefaults')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Past ceremonies */}
      {history.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{t('history.title')}</h2>
          <div className="flex flex-col gap-2">
            {history.map(entry => (
              <div
                key={entry.id}
                className="card px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg text-brand-600 dark:text-brand-400">
                    {(() => {
                      const Icon = CEREMONY_ICONS[entry.exportData.ceremonyType]
                      return <Icon className="w-5 h-5" />
                    })()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate flex items-center gap-1.5">
                      <span className="truncate">
                        {entry.exportData.teamName
                          ? `${entry.exportData.teamName} · ${ceremonyName(entry.exportData.ceremonyType)}`
                          : ceremonyName(entry.exportData.ceremonyType)}
                      </span>
                      {hasSignificantOvertime(entry.exportData) && (
                        <span title={t('timeStats.overtimeBadge')} className="flex-shrink-0 text-amber-600 dark:text-amber-500">
                          <StopwatchIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {entry.exportData.date} · {t('history.steps', { done: entry.exportData.stepsCompleted, total: entry.exportData.totalSteps })}
                    </p>
                    {entry.exportData.ceremonyType === 'planning' && entry.exportData.sprintGoal && (
                      <p className="text-xs text-brand-600 dark:text-brand-400 truncate flex items-center gap-1">
                        <TargetIcon className="w-3.5 h-3.5 flex-shrink-0" /> {entry.exportData.sprintGoal}
                      </p>
                    )}
                    {entry.exportData.ceremonyType === 'daily' && (
                      (entry.exportData.participants?.length ?? 0) > 0 || (entry.exportData.impediments?.length ?? 0) > 0
                    ) && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {entry.exportData.participants?.length ?? 0} {t('daily.participants').toLowerCase()}
                        {' · '}
                        {entry.exportData.impediments?.length ?? 0} {t('daily.impediments').toLowerCase()}
                      </p>
                    )}
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

      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
        {t('ceremony.source')}
      </p>
    </div>
  )
}
