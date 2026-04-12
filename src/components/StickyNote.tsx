import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { StickyNote as StickyNoteType } from '../types'

interface Props {
  note: StickyNoteType
  colorClass: string
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export default function StickyNote({ note, colorClass, onEdit, onDelete }: Props) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note.text)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed) onEdit(note.id, trimmed)
    setEditing(false)
  }

  const cancel = () => {
    setDraft(note.text)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className={`rounded-xl p-3 border-2 ${colorClass} flex flex-col gap-2`}>
        <textarea
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save() }
            if (e.key === 'Escape') cancel()
          }}
          placeholder={t('retro.editPlaceholder')}
          rows={3}
          className="w-full text-sm bg-transparent resize-none focus:outline-none"
        />
        <div className="flex gap-2 justify-end">
          <button onClick={cancel} className="text-xs text-gray-400 hover:text-gray-600">{t('retro.cancel')}</button>
          <button onClick={save} className="text-xs font-medium text-brand-600 hover:text-brand-700">{t('retro.save')}</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl p-3 border ${colorClass} relative group cursor-pointer`}
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setEditing(true)}
      aria-label={`${note.text} — click to edit`}
    >
      <p className="text-sm text-gray-800 leading-relaxed pr-5 whitespace-pre-wrap break-words">{note.text}</p>
      <button
        onClick={e => {
          e.stopPropagation()
          if (window.confirm(t('retro.deleteConfirm'))) onDelete(note.id)
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-sm"
        aria-label={t('common.delete')}
      >
        ×
      </button>
    </div>
  )
}
