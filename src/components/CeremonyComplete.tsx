import { useTranslation } from 'react-i18next'
import type { ExportData } from '../types'

const IMPROVEMENT_BOARD_URL = 'https://agile-toolkit.github.io/improvement-board/'

interface Props {
  data: ExportData
  onExport: () => void
  onHome: () => void
}

export default function CeremonyComplete({ data, onExport, onHome }: Props) {
  const { t } = useTranslation()
  const hasImpediments = data.ceremonyType === 'daily' && (data.impediments?.length ?? 0) > 0

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto pt-12 text-center">
      <div className="text-6xl">🎉</div>
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
            <span className="text-lg">🚧</span>
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

      <div className="flex flex-col gap-3 w-full">
        <button onClick={onExport} className="btn-primary w-full justify-center flex items-center gap-2">
          📤 {t('complete.export')}
        </button>
        <button onClick={onHome} className="btn-secondary w-full">
          {t('complete.backHome')}
        </button>
      </div>
    </div>
  )
}
