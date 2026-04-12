import { useTranslation } from 'react-i18next'
import type { Ceremony } from '../types'

interface Props {
  ceremony: Ceremony
  onClick: () => void
}

export default function CeremonyCard({ ceremony, onClick }: Props) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      className="card p-6 flex flex-col items-start gap-3 hover:border-brand-400 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-center gap-3 w-full">
        <span className="text-3xl">{ceremony.icon}</span>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-lg group-hover:text-brand-600 transition-colors">
            {t(ceremony.nameKey)}
          </div>
          <div className="text-xs text-brand-600 font-medium">
            {t('home.timebox', { minutes: ceremony.totalMinutes })}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{t(ceremony.descKey)}</p>
      <div className="text-xs text-gray-400">
        {ceremony.steps.length} steps
      </div>
    </button>
  )
}
