import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Participant } from '../types'

interface Props {
  participants: Participant[]
  onChange: (p: Participant[]) => void
}

function statusColor(status: Participant['status']): string {
  if (status === 'speaking') return 'bg-brand-500 text-white border-brand-500'
  if (status === 'done') return 'bg-gray-100 text-gray-400 border-gray-200'
  return 'bg-white text-gray-700 border-gray-200'
}

export default function ParticipantPanel({ participants, onChange }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  const addParticipant = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onChange([
      ...participants,
      { id: crypto.randomUUID(), name: trimmed, status: 'pending' },
    ])
    setName('')
  }

  const advanceStatus = (id: string) => {
    onChange(
      participants.map(p => {
        if (p.id !== id) return p
        const next: Participant['status'] =
          p.status === 'pending' ? 'speaking' : p.status === 'speaking' ? 'done' : 'pending'
        return { ...p, status: next }
      }),
    )
  }

  const removeParticipant = (id: string) => {
    onChange(participants.filter(p => p.id !== id))
  }

  const randomise = () => {
    const shuffled = [...participants]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    onChange(shuffled)
  }

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800">{t('daily.participants')}</h3>
        {participants.length > 1 && (
          <button onClick={randomise} className="btn-ghost text-xs">
            🔀 {t('daily.randomise')}
          </button>
        )}
      </div>

      {/* Add form */}
      <div className="flex gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addParticipant()}
          placeholder={t('daily.addPlaceholder')}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button onClick={addParticipant} disabled={!name.trim()} className="btn-primary text-sm py-2 px-3">
          {t('daily.add')}
        </button>
      </div>

      {/* Participant list */}
      {participants.length > 0 && (
        <div className="flex flex-col gap-2">
          {participants.map(p => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border cursor-pointer transition-all ${statusColor(p.status)}`}
              onClick={() => advanceStatus(p.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && advanceStatus(p.id)}
              aria-label={`${p.name} — ${t(`daily.status.${p.status}`)}`}
            >
              <div className="w-8 h-8 rounded-full bg-current bg-opacity-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {p.status === 'done' ? '✓' : p.name[0]?.toUpperCase()}
              </div>
              <span className="flex-1 text-sm font-medium">{p.name}</span>
              <span className="text-xs opacity-70">{t(`daily.status.${p.status}`)}</span>
              <button
                onClick={e => { e.stopPropagation(); removeParticipant(p.id) }}
                className="opacity-40 hover:opacity-100 text-sm ml-1"
                aria-label={t('common.delete')}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
