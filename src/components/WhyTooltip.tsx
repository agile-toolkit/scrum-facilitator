import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  whyKey: string
}

export default function WhyTooltip({ whyKey }: Props) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 transition-colors"
        aria-expanded={open}
      >
        <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
        {t('ceremony.whyToggle')}
      </button>
      {open && (
        <div className="mt-2 px-4 py-3 bg-brand-50 border border-brand-100 rounded-xl text-sm text-gray-700 leading-relaxed">
          {t(whyKey)}
        </div>
      )}
    </div>
  )
}
