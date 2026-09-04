import { useTranslation } from 'react-i18next'
import type { Ceremony } from '../types'
import { CEREMONY_ICONS } from './ceremonyIcons'

interface Props {
  ceremony: Ceremony
  onClick: () => void
}

export default function CeremonyCard({ ceremony, onClick }: Props) {
  const { t } = useTranslation()
  const Icon = CEREMONY_ICONS[ceremony.type]

  return (
    <button
      onClick={onClick}
      className="card p-6 flex flex-col items-start gap-3 hover:border-brand-400 hover:shadow-md transition-all text-left group"
    >
      <div className="flex items-center gap-3 w-full">
        <span className="text-brand-600 dark:text-brand-400"><Icon className="w-8 h-8" /></span>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-gray-50 text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {t(ceremony.nameKey)}
          </div>
          <div className="text-xs text-brand-600 dark:text-brand-400 font-medium">
            {t('home.timebox', { minutes: ceremony.totalMinutes })}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t(ceremony.descKey)}</p>
      <div className="text-xs text-gray-400 dark:text-gray-500">
        {ceremony.steps.length} steps
      </div>
    </button>
  )
}
