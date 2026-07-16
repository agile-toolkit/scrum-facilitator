import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { StickyNote as StickyNoteType, RetroColumn, Participant } from '../types'
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
  onVote: (column: RetroColumn, id: string, delta: number) => void
  onToggleAction: (column: RetroColumn, id: string) => void
  onOwnerChange: (column: RetroColumn, id: string, owner: string) => void
  onReorder: (column: RetroColumn, fromId: string, toId: string) => void
  participants: Participant[]
}

export default function StickyColumn({
  column, notes, labelKey, colorClass, headerColor,
  onAdd, onEdit, onDelete, onVote, onToggleAction, onOwnerChange, onReorder, participants,
}: Props) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const [sortByVotes, setSortByVotes] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const submit = () => {
    const trimmed = draft.trim()
    if (!trimmed) return
    onAdd(column, trimmed)
    setDraft('')
  }

  const displayNotes = sortByVotes
    ? [...notes].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0))
    : notes

  const totalVotes = notes.reduce((sum, n) => sum + (n.votes ?? 0), 0)

  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl w-full ${headerColor}`}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 flex-1 text-left"
          aria-expanded={open}
          aria-controls={`retro-notes-${column}`}
        >
          <span className="font-semibold text-sm flex-1">{t(labelKey)}</span>
          <span className="text-xs font-medium opacity-70 bg-white bg-opacity-50 rounded-full px-2 py-0.5">
            {notes.length}
          </span>
          <span className="md:hidden text-xs opacity-60 ml-1">{open ? '▲' : '▼'}</span>
        </button>

        {/* Sort by votes toggle */}
        <button
          type="button"
          onClick={() => setSortByVotes(v => !v)}
          title={t('retro.sortByVotes')}
          aria-pressed={sortByVotes}
          className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors ${
            sortByVotes
              ? 'bg-brand-500 text-white border-brand-500'
              : 'bg-white bg-opacity-50 text-gray-600 border-gray-300 hover:border-brand-400'
          }`}
        >
          {totalVotes > 0 ? `👍 ${totalVotes}` : '👍'}
        </button>
      </div>

      {/* Body */}
      <div id={`retro-notes-${column}`} className={`flex-col gap-2 flex-1 ${open ? 'flex' : 'hidden md:flex'}`}>
        <div className="flex flex-col gap-2 flex-1">
          {displayNotes.map(note => (
            <div
              key={note.id}
              draggable
              onDragStart={e => {
                setDragId(note.id)
                if (sortByVotes) setSortByVotes(false)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragEnd={() => { setDragId(null); setDragOverId(null) }}
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverId(note.id) }}
              onDrop={e => {
                e.preventDefault()
                if (dragId && dragId !== note.id) onReorder(column, dragId, note.id)
                setDragId(null); setDragOverId(null)
              }}
              className={`relative cursor-grab active:cursor-grabbing transition-opacity ${
                dragId === note.id ? 'opacity-40' : 'opacity-100'
              } ${
                dragOverId === note.id && dragId !== note.id ? 'ring-2 ring-brand-400 rounded-xl' : ''
              }`}
            >
              <StickyNote
                note={note}
                colorClass={colorClass}
                onEdit={(id, text) => onEdit(column, id, text)}
                onDelete={id => onDelete(column, id)}
                onVote={(id, delta) => onVote(column, id, delta)}
                onToggleAction={id => onToggleAction(column, id)}
                onOwnerChange={(id, owner) => onOwnerChange(column, id, owner)}
                participants={participants}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder={t('retro.addPlaceholder')}
            aria-label={t('retro.addNoteLabel', { column: t(labelKey) })}
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
