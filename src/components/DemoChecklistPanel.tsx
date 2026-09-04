import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DemoItem } from '../types'
import { CloseIcon, ClapperIcon } from './icons'

interface Props {
  items: DemoItem[]
  onChange: (items: DemoItem[]) => void
}

export default function DemoChecklistPanel({ items, onChange }: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...items, { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text: trimmed, demoed: false }])
    setDraft('')
  }

  const remove = (id: string) => {
    onChange(items.filter(i => i.id !== id))
  }

  const toggleDemoed = (id: string) => {
    onChange(items.map(i => (i.id === id ? { ...i, demoed: !i.demoed } : i)))
  }

  const setPresenter = (id: string, presenter: string) => {
    onChange(items.map(i => (i.id === id ? { ...i, presenter: presenter || undefined } : i)))
  }

  const demoedCount = items.filter(i => i.demoed).length

  return (
    <div className="card p-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-left"
        aria-expanded={open}
        aria-controls="demo-checklist-body"
      >
        <ClapperIcon className="w-5 h-5" />
        <span className="font-medium text-gray-800 dark:text-gray-100 flex-1">{t('review.demoChecklist')}</span>
        {items.length > 0 && (
          <span className="text-xs font-medium bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full px-2 py-0.5">
            {demoedCount}/{items.length}
          </span>
        )}
        <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="demo-checklist-body" className="flex flex-col gap-2">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <input
                type="checkbox"
                checked={item.demoed}
                onChange={() => toggleDemoed(item.id)}
                aria-label={t('review.itemDemoed')}
                className="w-4 h-4 accent-brand-500 flex-shrink-0"
              />
              <span
                className={`flex-1 text-sm text-gray-700 dark:text-gray-200 ${item.demoed ? 'line-through opacity-60' : ''}`}
              >
                {item.text}
              </span>
              <input
                value={item.presenter ?? ''}
                onChange={e => setPresenter(item.id, e.target.value)}
                placeholder={t('review.presenter')}
                className="w-28 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                onClick={() => remove(item.id)}
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
              placeholder={t('review.addDemoItem')}
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
