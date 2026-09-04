import { useTranslation } from 'react-i18next'
import type { ExportData, StepTiming, AgendaStep } from '../types'
import { getCeremony, formatDuration } from '../data/ceremonies'
import { CelebrateIcon, WarningIcon, ClapperboardIcon, StopwatchIcon, UploadIcon } from './icons'

const IMPROVEMENT_BOARD_URL = 'https://agile-toolkit.github.io/improvement-board/'

interface Props {
  data: ExportData
  onExport: () => void
  onHome: () => void
}

function formatDelta(deltaSeconds: number): string {
  if (deltaSeconds === 0) return '0m'
  return `${deltaSeconds > 0 ? '+' : '-'}${formatDuration(Math.abs(deltaSeconds))}`
}

export default function CeremonyComplete({ data, onExport, onHome }: Props) {
  const { t } = useTranslation()
  const hasImpediments = data.ceremonyType === 'daily' && (data.impediments?.length ?? 0) > 0
  const demoItems = data.ceremonyType === 'review' ? data.demoItems ?? [] : []
  const demoedCount = demoItems.filter(i => i.demoed).length

  const ceremony = getCeremony(data.ceremonyType)
  const orderedTimings: { step: AgendaStep; timing: StepTiming }[] = ceremony
    ? ceremony.steps.flatMap(step => {
        const timing = data.stepTimings?.find(st => st.stepId === step.id)
        return timing ? [{ step, timing }] : []
      })
    : []

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto pt-12 text-center">
      <div className="flex justify-center"><CelebrateIcon className="w-16 h-16" /></div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('complete.title')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {t('complete.steps', { done: data.stepsCompleted, total: data.totalSteps })}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{data.date}</p>
      </div>

      {hasImpediments && (
        <div className="card p-4 flex flex-col gap-2 border-l-4 border-red-400 w-full text-left">
          <div className="flex items-center gap-2">
            <WarningIcon className="w-5 h-5" />
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              {t('daily.impediments')} ({data.impediments!.length})
            </h3>
          </div>
          <a
            href={IMPROVEMENT_BOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary self-start text-sm"
          >
            {t('daily.openImprovementBoard')}
          </a>
        </div>
      )}

      {demoItems.length > 0 && (
        <div className="card p-4 flex flex-col gap-2 border-l-4 border-brand-400 w-full text-left">
          <div className="flex items-center gap-2">
            <ClapperboardIcon className="w-5 h-5" />
            <h3 className="font-medium text-gray-800 dark:text-gray-100">
              {t('review.demoChecklist')} ({demoedCount}/{demoItems.length})
            </h3>
          </div>
        </div>
      )}

      {orderedTimings.length > 0 && (
        <div className="card p-4 flex flex-col gap-2 w-full text-left">
          <h3 className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <StopwatchIcon className="w-4 h-4" /> {t('timeStats.title')}
          </h3>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-700">
            {orderedTimings.map(({ step, timing }) => {
              const delta = timing.actual - timing.planned
              const colorClass =
                delta <= 0
                  ? 'text-green-600 dark:text-green-400'
                  : delta > timing.planned * 0.2
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400'
              return (
                <div key={step.id} className="flex items-center justify-between gap-2 py-1.5 text-sm">
                  <span className="text-gray-600 dark:text-gray-300 truncate">{t(step.titleKey)}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs flex-shrink-0">
                    {formatDuration(timing.planned)} → {formatDuration(timing.actual)}
                  </span>
                  <span className={`font-medium flex-shrink-0 ${colorClass}`}>{formatDelta(delta)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full">
        <button onClick={onExport} className="btn-primary w-full justify-center flex items-center gap-2">
          <UploadIcon className="w-4 h-4" /> {t('complete.export')}
        </button>
        <button onClick={onHome} className="btn-secondary w-full">
          {t('complete.backHome')}
        </button>
      </div>
    </div>
  )
}
