import { useTranslation } from 'react-i18next'
import { CEREMONIES } from '../data/ceremonies'
import type { CeremonyType } from '../types'
import CeremonyCard from './CeremonyCard'

interface Props {
  onSelect: (type: CeremonyType) => void
}

export default function HomeScreen({ onSelect }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{t('home.title')}</h1>
        <p className="text-gray-500 mt-2">{t('home.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CEREMONIES.map(ceremony => (
          <CeremonyCard
            key={ceremony.type}
            ceremony={ceremony}
            onClick={() => onSelect(ceremony.type)}
          />
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        {t('ceremony.source')}
      </p>
    </div>
  )
}
