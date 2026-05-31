import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StickyNote as StickyNoteType, RetroColumn } from '../types'
import StickyNote from './StickyNote'

interface Props {
  column: RetroColumn
  notes: StickyNoteType[]
  labelKey: string
  colorClass: string
  headerColor: string
  onAdd: (column: RetroColumn, text: string) => void
  onEdit: (column: RetroColumn, id: string, text: string) => void
  onDelete: (column: RetroColumn, id: string) => void
}

export default function StickyColumn({
  column, notes, labelKey, colorClass, headerColor,
  onAdd, onEdit, onDelete,
}: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)

  const submit = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onAdd(column, trimmed)
    setDraft('')
  }

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Header — tappable on mobile to collapse/expand; non-interactive on md+ */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl w-full text-left ${headerColor}`}
        aria-expanded={open}
      >
        <span className="font-semibold text-sm flex-1">{t(labelKey)}</span>
        <span className="text-xs font-medium opacity-70 bg-white bg-opacity-50 rounded-full px-2 py-0.5">
          {notes.length}
        </span>
        {/* Caret visible only on mobile */}
        <span className="md:hidden text-xs opacity-60 ml-1">{open ? '▲' : '▼'}</span>
      </button>

      {/* Body — hidden on mobile when closed, always visible on md+ */}
      <div className={`flex-col gap-2 flex-1 ${open ? 'flex' : 'hidden md:flex'}`}>
        <div className="flex flex-col gap-2 flex-1">
          {notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              colorClass={colorClass}
              onEdit={(id, text) => onEdit(column, id, text)}
              onDelete={id => onDelete(column, id)}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder={t('retro.addPlaceholder')}
            className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button onClick={submit} disabled={!draft.trim()} className="btn-primary text-sm py-2 px-3 min-w-[44px] min-h-[44px]">
            +
          </button>
        </div>
      </div>
    </div>
  )
}
