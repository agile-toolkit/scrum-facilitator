import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CeremonyType, Participant } from '../types'

interface Props {
  participants: Participant[]
  onChange: (p: Participant[]) => void
  ceremonyType?: CeremonyType
}

function statusColor(status: Participant['status']): string {
  if (status === 'speaking') return 'bg-brand-500 text-white border-brand-500'
  if (status === 'done') return 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600'
  return 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'
}

export default function ParticipantPanel({ participants, onChange, ceremonyType }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [role, setRole] = useState<'team' | 'stakeholder'>('team')
  const isReview = ceremonyType === 'review'

  const addParticipant = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    onChange([
      ...participants,
      { id: crypto.randomUUID(), name: trimmed, status: 'pending', role: isReview ? role : undefined },
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

  const teamMembers = isReview ? participants.filter(p => p.role !== 'stakeholder') : participants
  const stakeholders = isReview ? participants.filter(p => p.role === 'stakeholder') : []

  const renderRow = (p: Participant) =>
    p.role === 'stakeholder' ? (
      <div
        key={p.id}
        className="flex items-center gap-3 px-3 py-2 min-h-[44px] rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
      >
        <span className="text-lg flex-shrink-0" aria-hidden="true">🤝</span>
        <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200">{p.name}</span>
        <span className="text-xs opacity-70 text-gray-500 dark:text-gray-400">{t('participant.role.stakeholder')}</span>
        <button
          onClick={() => removeParticipant(p.id)}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center opacity-100 md:opacity-40 md:hover:opacity-100 text-sm ml-1"
          aria-label={t('common.delete')}
        >
          ×
        </button>
      </div>
    ) : (
      <div
        key={p.id}
        className={`flex items-center gap-3 px-3 py-2 min-h-[44px] rounded-xl border cursor-pointer transition-all ${statusColor(p.status)}`}
        onClick={() => advanceStatus(p.id)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && advanceStatus(p.id)}
        aria-label={`${p.name} — ${t(`daily.status.${p.status}`)}`}
        aria-pressed={p.status === 'speaking'}
      >
        <div className="w-9 h-9 rounded-full bg-current bg-opacity-10 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {p.status === 'done' ? '✓' : p.name[0]?.toUpperCase()}
        </div>
        <span className="flex-1 text-sm font-medium">{p.name}</span>
        <span className="text-xs opacity-70">{t(`daily.status.${p.status}`)}</span>
        <button
          onClick={e => { e.stopPropagation(); removeParticipant(p.id) }}
          className="min-w-[36px] min-h-[36px] flex items-center justify-center opacity-100 md:opacity-40 md:hover:opacity-100 text-sm ml-1"
          aria-label={t('common.delete')}
        >
          ×
        </button>
      </div>
    )

  return (
    <div className="card p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-800 dark:text-gray-100">{t('daily.participants')}</h3>
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
          className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        {isReview && (
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setRole('team')}
              className={`px-2 py-2 font-medium ${role === 'team' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              {t('participant.role.team')}
            </button>
            <button
              type="button"
              onClick={() => setRole('stakeholder')}
              className={`px-2 py-2 font-medium ${role === 'stakeholder' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
            >
              {t('participant.role.stakeholder')}
            </button>
          </div>
        )}
        <button onClick={addParticipant} disabled={!name.trim()} className="btn-primary text-sm py-2 px-3">
          {t('daily.add')}
        </button>
      </div>

      {/* Participant list */}
      {teamMembers.length > 0 && (
        <div className="flex flex-col gap-2">
          {teamMembers.map(renderRow)}
        </div>
      )}

      {isReview && stakeholders.length > 0 && (
        <div className="flex flex-col gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 pt-2">🤝 {t('participant.role.stakeholder')}</span>
          {stakeholders.map(renderRow)}
        </div>
      )}
    </div>
  )
}
