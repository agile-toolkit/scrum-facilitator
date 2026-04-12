import { useTranslation } from 'react-i18next'
import type { ExportData } from '../types'

interface Props {
  data: ExportData
  onExport: () => void
  onHome: () => void
}

export default function CeremonyComplete({ data, onExport, onHome }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-8 max-w-md mx-auto pt-12 text-center">
      <div className="text-6xl">🎉</div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('complete.title')}</h2>
        <p className="text-gray-500 mt-2">
          {t('complete.steps', { done: data.stepsCompleted, total: data.totalSteps })}
        </p>
        <p className="text-sm text-gray-400 mt-1">{data.date}</p>
      </div>

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
