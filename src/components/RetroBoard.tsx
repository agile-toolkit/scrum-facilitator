import { useTranslation } from 'react-i18next'
import type { RetroNotes, RetroColumn, StickyNote, RetroFormat } from '../types'
import { getRetroFormat, emptyNotes } from '../data/retroFormats'
import StickyColumn from './StickyColumn'

interface Props {
  notes: RetroNotes
  format: RetroFormat
  onChange: (n: RetroNotes) => void
  onFormatChange?: (f: RetroFormat) => void
  onExport?: () => void
  onBack?: () => void
  embedded?: boolean
}

export default function RetroBoard({ notes, format, onChange, onFormatChange, onExport, onBack, embedded = false }: Props) {
  const { t } = useTranslation()
  const formatConfig = getRetroFormat(format)

  const update = (updated: RetroNotes) => {
    onChange(updated)
  }

  const addNote = (column: RetroColumn, text: string) => {
    const note: StickyNote = { id: crypto.randomUUID(), text, createdAt: Date.now() }
    update({ ...notes, [column]: [...(notes[column] ?? []), note] })
  }

  const editNote = (column: RetroColumn, id: string, text: string) => {
    update({
      ...notes,
      [column]: (notes[column] ?? []).map(n => (n.id === id ? { ...n, text } : n)),
    })
  }

  const deleteNote = (column: RetroColumn, id: string) => {
    update({ ...notes, [column]: (notes[column] ?? []).filter(n => n.id !== id) })
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

      {onFormatChange && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-gray-600">{t('retro.formatLabel')}:</span>
          <div className="flex gap-2 flex-wrap">
            {(['classic', 'four-ls', 'mad-sad-glad', 'sailboat'] as RetroFormat[]).map(f => (
              <button
                key={f}
                onClick={() => {
                  if (f !== format) {
                    onFormatChange(f)
                    onChange(emptyNotes(getRetroFormat(f)))
                  }
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  f === format
                    ? 'bg-brand-500 text-white border-brand-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                {t(`retro.format.${f}`)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-4 overflow-x-auto ${
        formatConfig.columns.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
      }`}>
        {formatConfig.columns.map(col => (
          <StickyColumn
            key={col.id}
            column={col.id}
            notes={notes[col.id] ?? []}
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
