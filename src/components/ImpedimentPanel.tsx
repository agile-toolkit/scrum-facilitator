import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseIcon, WarningIcon } from './icons'

interface Props {
  impediments: string[]
  onChange: (impediments: string[]) => void
}

export default function ImpedimentPanel({ impediments, onChange }: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...impediments, trimmed])
    setDraft('')
  }

  const remove = (index: number) => {
    onChange(impediments.filter((_, i) => i !== index))
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-left"
        aria-expanded={open}
        aria-controls="impediments-panel-body"
      >
        <WarningIcon className="w-5 h-5" />
        <span className="font-medium text-gray-800 dark:text-gray-100 flex-1">{t('daily.impediments')}</span>
        {impediments.length > 0 && (
          <span className="text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full px-2 py-0.5">
            {impediments.length}
          </span>
        )}
        <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="impediments-panel-body" className="flex flex-col gap-2">
          {impediments.map((text, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-200">{text}</span>
              <button
                onClick={() => remove(i)}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={t('common.delete')}
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              placeholder={t('daily.addImpediment')}
              className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button onClick={add} disabled={!draft.trim()} className="btn-primary text-sm py-2 px-3">
              {t('daily.add')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
