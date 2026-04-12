import { useTranslation } from 'react-i18next'
import type { RetroNotes, RetroColumn, StickyNote } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import StickyColumn from './StickyColumn'

interface Props {
  notes: RetroNotes
  onChange: (n: RetroNotes) => void
  onExport?: () => void
  onBack?: () => void
  embedded?: boolean
}

const COLUMNS: { column: RetroColumn; labelKey: string; colorClass: string; headerColor: string }[] = [
  {
    column: 'wellDone',
    labelKey: 'retro.wellDone',
    colorClass: 'bg-green-50 border-green-200',
    headerColor: 'bg-green-100 text-green-800',
  },
  {
    column: 'toImprove',
    labelKey: 'retro.toImprove',
    colorClass: 'bg-yellow-50 border-yellow-200',
    headerColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    column: 'actions',
    labelKey: 'retro.actions',
    colorClass: 'bg-blue-50 border-blue-200',
    headerColor: 'bg-blue-100 text-blue-800',
  },
]

export default function RetroBoard({ notes, onChange, onExport, onBack, embedded = false }: Props) {
  const { t } = useTranslation()

  // Also persist to localStorage
  const [, persist] = useLocalStorage<RetroNotes>('sf_retro_notes', notes)

  const update = (updated: RetroNotes) => {
    onChange(updated)
    persist(updated)
  }

  const addNote = (column: RetroColumn, text: string) => {
    const note: StickyNote = { id: crypto.randomUUID(), text, createdAt: Date.now() }
    update({ ...notes, [column]: [...notes[column], note] })
  }

  const editNote = (column: RetroColumn, id: string, text: string) => {
    update({
      ...notes,
      [column]: notes[column].map(n => (n.id === id ? { ...n, text } : n)),
    })
  }

  const deleteNote = (column: RetroColumn, id: string) => {
    update({ ...notes, [column]: notes[column].filter(n => n.id !== id) })
  }

  return (
    <div className="flex flex-col gap-4">
      {!embedded && (
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="btn-ghost">← {t('common.back')}</button>
          )}
          <h2 className="text-xl font-bold flex-1">{t('app.title')}</h2>
          {onExport && (
            <button onClick={onExport} className="btn-secondary text-sm">
              📤 {t('complete.export')}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto">
        {COLUMNS.map(col => (
          <StickyColumn
            key={col.column}
            column={col.column}
            notes={notes[col.column]}
            labelKey={col.labelKey}
            colorClass={col.colorClass}
            headerColor={col.headerColor}
            onAdd={addNote}
            onEdit={editNote}
            onDelete={deleteNote}
          />
        ))}
      </div>
    </div>
  )
}
