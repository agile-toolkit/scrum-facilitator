import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FeedbackItem, Participant } from '../types'
import { CloseIcon } from './icons'

interface Props {
  items: FeedbackItem[]
  participants: Participant[]
  onChange: (items: FeedbackItem[]) => void
}

const TYPE_ICON: Record<FeedbackItem['type'], string> = {
  question: '❓',
  concern: '⚠️',
  praise: '✅',
}

export default function FeedbackPanel({ items, participants, onChange }: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [from, setFrom] = useState('')
  const [type, setType] = useState<FeedbackItem['type']>('question')
  const [open, setOpen] = useState(false)

  const stakeholders = participants.filter(p => p.role === 'stakeholder')

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onChange([...items, { id: crypto.randomUUID(), text: trimmed, from: from.trim() || undefined, type }])
    setDraft('')
  }

  const remove = (id: string) => {
    onChange(items.filter(i => i.id !== id))
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-left"
        aria-expanded={open}
        aria-controls="feedback-panel-body"
      >
        <span className="text-lg">🤝</span>
        <span className="font-medium text-gray-800 dark:text-gray-100 flex-1">{t('review.feedback')}</span>
        {items.length > 0 && (
          <span className="text-xs font-medium bg-brand-50 dark:bg-brand-700/20 text-brand-600 dark:text-brand-400 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        )}
        <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div id="feedback-panel-body" className="flex flex-col gap-2">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-start gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <span className="text-sm flex-shrink-0" aria-hidden="true">{TYPE_ICON[item.type]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-200">{item.text}</p>
                {item.from && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">— {item.from}</p>
                )}
              </div>
              <button
                onClick={() => remove(item.id)}
                className="min-w-[28px] min-h-[28px] flex items-center justify-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={t('common.delete')}
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 flex-wrap">
            {(['question', 'concern', 'praise'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setType(opt)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border ${
                  type === opt
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                }`}
              >
                {TYPE_ICON[opt]} {t(`review.feedbackType.${opt}`)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              placeholder={t('review.addFeedback')}
              className="flex-1 min-w-[10rem] border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            {stakeholders.length > 0 ? (
              <select
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">{t('review.feedbackFrom')}</option>
                {stakeholders.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            ) : (
              <input
                value={from}
                onChange={e => setFrom(e.target.value)}
                placeholder={t('review.feedbackFrom')}
                className="w-32 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            )}
            <button onClick={add} disabled={!draft.trim()} className="btn-primary text-sm py-2 px-3">
              {t('daily.add')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
