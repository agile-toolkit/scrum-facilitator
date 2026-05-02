import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CeremonyType, Participant, RetroNotes, RetroFormat, SessionState } from '../types'
import { getCeremony, formatDuration } from '../data/ceremonies'
import { useTimer } from '../hooks/useTimer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import CountdownTimer from './CountdownTimer'
import WhyTooltip from './WhyTooltip'
import FacilitationTips from './FacilitationTips'
import ParticipantPanel from './ParticipantPanel'
import RetroBoard from './RetroBoard'

const SESSION_KEY = 'scrum-facilitator-session'

interface Props {
  ceremonyType: CeremonyType
  retroNotes: RetroNotes
  retroFormat: RetroFormat
  onRetroNotesChange: (n: RetroNotes) => void
  onComplete: (stepsCompleted: number, participants?: string[]) => void
  onBack: () => void
  resumeSession?: SessionState | null
}

export default function CeremonyRunner({
  ceremonyType, retroNotes, retroFormat, onRetroNotesChange, onComplete, onBack, resumeSession,
}: Props) {
  const { t } = useTranslation()
  const ceremony = getCeremony(ceremonyType)
  const [stepIndex, setStepIndex] = useState(resumeSession?.stepIndex ?? 0)
  const [completedSteps, setCompletedSteps] = useState(resumeSession?.completedSteps ?? 0)
  const [participants, setParticipants] = useLocalStorage<Participant[]>('sf_participants', [])

  const currentStep = ceremony?.steps[stepIndex]
  const { timeRemaining, timerState, percentLeft, start, pause, reset } = useTimer(
    currentStep?.duration ?? 0,
  )

  useEffect(() => {
    if (currentStep) reset(currentStep.duration)
  }, [stepIndex, currentStep?.id])

  // Auto-save session state on every meaningful change
  useEffect(() => {
    if (!ceremony) return
    const session: SessionState = {
      ceremonyType,
      stepIndex,
      completedSteps,
      participants,
      retroNotes,
      retroFormat,
      savedAt: Date.now(),
    }
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* ignore */ }
  }, [stepIndex, completedSteps, retroNotes, participants, ceremonyType])

  if (!ceremony || !currentStep) return null

  const isFirst = stepIndex === 0
  const isLast = stepIndex === ceremony.steps.length - 1
  const isDaily = ceremonyType === 'daily'
  const showRetroBoard = currentStep.triggersRetro === true

  const goNext = () => {
    const newCompleted = Math.max(completedSteps, stepIndex + 1)
    setCompletedSteps(newCompleted)
    if (isLast) {
      onComplete(newCompleted, isDaily ? participants.map(p => p.name) : undefined)
    } else {
      setStepIndex(i => i + 1)
    }
  }

  const goPrev = () => {
    if (!isFirst) setStepIndex(i => i - 1)
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-ghost">← {t('common.back')}</button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900 text-lg">{t(ceremony.nameKey)}</h2>
          <p className="text-sm text-gray-500">
            {t('ceremony.stepOf', { current: stepIndex + 1, total: ceremony.steps.length })}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 items-center">
        {ceremony.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStepIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === stepIndex
                ? 'w-6 bg-brand-500'
                : i < stepIndex
                ? 'w-2 bg-brand-300'
                : 'w-2 bg-gray-200'
            }`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Step card */}
      <div className="card p-6 flex flex-col gap-5">
        <div className="flex items-start gap-4">
          {/* Timer */}
          <CountdownTimer
            timeRemaining={timeRemaining}
            percentLeft={percentLeft}
            timerState={timerState}
          />
          {/* Step info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{t(currentStep.titleKey)}</h3>
            <span className="inline-block mt-1 text-xs font-medium bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">
              {formatDuration(currentStep.duration)}
            </span>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex gap-2">
          {timerState === 'idle' && (
            <button onClick={start} className="btn-primary">▶ {t('ceremony.start')}</button>
          )}
          {timerState === 'running' && (
            <button onClick={pause} className="btn-secondary">⏸ {t('ceremony.pause')}</button>
          )}
          {timerState === 'paused' && (
            <button onClick={start} className="btn-primary">▶ {t('ceremony.resume')}</button>
          )}
          {timerState === 'done' && (
            <span className="text-sm font-medium text-red-500 flex items-center gap-1">⏰ {t('ceremony.timeUp')}</span>
          )}
          <button
            onClick={() => reset(currentStep.duration)}
            className="btn-ghost"
            aria-label={t('ceremony.reset')}
          >
            ↺ {t('ceremony.reset')}
          </button>
        </div>

        {/* Why tooltip */}
        <WhyTooltip whyKey={currentStep.whyKey} />
      </div>

      {/* Daily participant panel */}
      {isDaily && (
        <ParticipantPanel participants={participants} onChange={setParticipants} />
      )}

      {/* Retro board (embedded) */}
      {showRetroBoard && (
        <RetroBoard
          notes={retroNotes}
          format={retroFormat}
          onChange={onRetroNotesChange}
          embedded
        />
      )}

      {/* Facilitation tips */}
      <FacilitationTips tipsKeys={ceremony.tipsKeys} />

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={goPrev} disabled={isFirst} className="btn-secondary disabled:opacity-40">
          {t('ceremony.prev')}
        </button>
        <button onClick={goNext} className="btn-primary">
          {isLast ? t('ceremony.finish') : t('ceremony.next')}
        </button>
      </div>

      {/* Source */}
      <p className="text-xs text-center text-gray-400">{t('ceremony.source')}</p>
    </div>
  )
}
