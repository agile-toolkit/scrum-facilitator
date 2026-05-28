import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  tipsKeys: string[]
}

export default function FacilitationTips({ tipsKeys }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div className="card p-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
        aria-expanded={open}
      >
        <span className="text-lg">💡</span>
        <span className="flex-1">{t('ceremony.tipsToggle')}</span>
        <span className={`text-gray-400 dark:text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <ul className="mt-3 flex flex-col gap-2">
          {tipsKeys.map((key, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-brand-500 flex-shrink-0">•</span>
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
