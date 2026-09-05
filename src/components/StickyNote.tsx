import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { StickyNote as StickyNoteType, Participant } from '../types'
import { useConfirmAction } from '../hooks/useConfirmAction'
import { CloseIcon, CheckboxCheckedIcon, CheckboxEmptyIcon, ThumbsUpIcon } from './icons'

interface Props {
  note: StickyNoteType
  colorClass: string
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
  onVote: (id: string, delta: number) => void
  onToggleAction: (id: string) => void
  onOwnerChange: (id: string, owner: string) => void
  participants: Participant[]
}

export default function StickyNote({ note, colorClass, onEdit, onDelete, onVote, onToggleAction, onOwnerChange, participants }: Props) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note.text)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const votes = note.votes ?? 0
  const deleteConfirm = useConfirmAction(() => onDelete(note.id))

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
    <div className={`rounded-xl p-3 border ${colorClass} group ${note.isAction ? 'border-l-4 border-l-brand-500' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => setEditing(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setEditing(true)}
          aria-label={`${note.text} — click to edit`}
        >
          {note.isAction && (
            <span aria-hidden="true" className="block text-brand-600 dark:text-brand-400 mb-1"><CheckboxCheckedIcon className="w-3.5 h-3.5" /></span>
          )}
          <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">{note.text}</p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onToggleAction(note.id)}
            className={`min-w-[28px] min-h-[28px] flex items-center justify-center rounded-full text-sm transition-colors ${
              note.isAction
                ? 'text-brand-600 dark:text-brand-400'
                : 'text-gray-300 dark:text-gray-600 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-brand-500'
            }`}
            aria-pressed={!!note.isAction}
            aria-label={note.isAction ? t('retro.unmarkAction') : t('retro.markAction')}
            title={note.isAction ? t('retro.unmarkAction') : t('retro.markAction')}
          >
            {note.isAction ? <CheckboxCheckedIcon className="w-3.5 h-3.5" /> : <CheckboxEmptyIcon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => deleteConfirm.trigger()}
            onBlur={() => deleteConfirm.cancel()}
            title={deleteConfirm.confirming ? t('retro.deleteConfirm') : undefined}
            className={`min-h-[28px] flex items-center justify-center rounded transition-all text-sm ${
              deleteConfirm.confirming
                ? 'min-w-[28px] px-1.5 gap-1 bg-red-500 text-white opacity-100'
                : 'min-w-[28px] opacity-100 md:opacity-0 md:group-hover:opacity-100 text-gray-400 hover:text-red-500'
            }`}
            aria-label={deleteConfirm.confirming ? t('retro.deleteConfirm') : t('retro.deleteNote')}
          >
            {deleteConfirm.confirming ? (
              <span className="text-[10px] font-semibold whitespace-nowrap">{t('retro.confirmShort')}</span>
            ) : (
              <CloseIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {note.isAction && (
        <div className="mt-2" onClick={e => e.stopPropagation()}>
          {participants.length > 0 ? (
            <select
              value={note.owner ?? ''}
              onChange={e => onOwnerChange(note.id, e.target.value)}
              aria-label={t('retro.owner')}
              className="w-full text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">{t('retro.ownerPlaceholder')}</option>
              {participants.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          ) : (
            <input
              value={note.owner ?? ''}
              onChange={e => onOwnerChange(note.id, e.target.value)}
              placeholder={t('retro.ownerPlaceholder')}
              aria-label={t('retro.owner')}
              className="w-full text-xs border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          )}
        </div>
      )}

      {/* Vote controls */}
      <div className="flex items-center gap-1 mt-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onVote(note.id, 1)}
          className="flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors min-w-[28px] min-h-[22px]"
          aria-label={t('retro.vote')}
          title={t('retro.vote')}
        >
          <ThumbsUpIcon className="w-3.5 h-3.5" />{votes > 0 && <span className="font-semibold text-brand-600 dark:text-brand-400">{votes}</span>}
        </button>
        {votes > 0 && (
          <button
            onClick={() => onVote(note.id, -1)}
            className="text-xs w-5 h-5 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-400 hover:border-red-300 transition-colors"
            aria-label={t('retro.unvote')}
            title={t('retro.unvote')}
          >
            −
          </button>
        )}
      </div>
    </div>
  )
}
