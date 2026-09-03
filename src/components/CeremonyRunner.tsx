import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { CeremonyType, Participant, RetroNotes, RetroFormat, SessionState, DemoItem, StepTiming, FeedbackItem } from '../types'
import { getCeremony, formatDuration } from '../data/ceremonies'
import { useTimer } from '../hooks/useTimer'
import { useLocalStorage } from '../hooks/useLocalStorage'
import CountdownTimer from './CountdownTimer'
import WhyTooltip from './WhyTooltip'
import FacilitationTips from './FacilitationTips'
import ParticipantPanel from './ParticipantPanel'
import ImpedimentPanel from './ImpedimentPanel'
import DemoChecklistPanel from './DemoChecklistPanel'
import FeedbackPanel from './FeedbackPanel'
import RetroBoard from './RetroBoard'
import { readLastSprintSession } from '../utils/sprintMetricsHandoff'

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-mono leading-none">
      {children}
    </kbd>
  )
}

const SESSION_KEY = 'scrum-facilitator-session'
const MUTED_KEY = 'scrum-facilitator-muted'

function playBeep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 440
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
    osc.addEventListener('ended', () => ctx.close())
  } catch {
    // Web Audio API unavailable
  }
}

interface Props {
  ceremonyType: CeremonyType
  retroNotes: RetroNotes
  retroFormat: RetroFormat
  teamName?: string
  timeboxOverrides?: Record<string, number>
  initialDemoItems?: DemoItem[]
  onRetroNotesChange: (n: RetroNotes) => void
  onComplete: (stepsCompleted: number, participants?: string[], sprintGoal?: string, impediments?: string[], demoItems?: DemoItem[], stepTimings?: StepTiming[], feedbackItems?: FeedbackItem[]) => void
  onBack: () => void
  resumeSession?: SessionState | null
  facilitatorMode?: boolean
}

export default function CeremonyRunner({
  ceremonyType, retroNotes, retroFormat, teamName, timeboxOverrides = {}, initialDemoItems = [], onRetroNotesChange, onComplete, onBack, resumeSession, facilitatorMode = false,
}: Props) {
  const { t } = useTranslation()
  const ceremony = getCeremony(ceremonyType)
  const [stepIndex, setStepIndex] = useState(resumeSession?.stepIndex ?? 0)
  const [completedSteps, setCompletedSteps] = useState(resumeSession?.completedSteps ?? 0)
  const [participants, setParticipants] = useLocalStorage<Participant[]>('sf_participants', [])
  const [sprintGoal, setSprintGoal] = useState(resumeSession?.sprintGoal ?? '')
  const [impediments, setImpediments] = useState<string[]>(resumeSession?.impediments ?? [])
  const [demoItems, setDemoItems] = useState<DemoItem[]>(resumeSession?.demoItems ?? initialDemoItems)
  const [stepTimings, setStepTimings] = useState<StepTiming[]>(resumeSession?.stepTimings ?? [])
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>(resumeSession?.feedbackItems ?? [])
  const stepStartedAtRef = useRef<number>(resumeSession?.stepStartedAt ?? Date.now())

  const [isMuted, setIsMuted] = useState(() => {
    try { return localStorage.getItem(MUTED_KEY) === 'true' } catch { return false }
  })
  const [lastSprintSession] = useState(() => ceremonyType === 'retro' ? readLastSprintSession() : null)
  const [lastSprintDismissed, setLastSprintDismissed] = useState(false)
  const isMutedRef = useRef(isMuted)
  isMutedRef.current = isMuted

  const currentStep = ceremony?.steps[stepIndex]
  const stepDuration = (step: typeof currentStep) =>
    step ? (timeboxOverrides[step.id] ?? step.duration) : 0
  const { timeRemaining, timerState, percentLeft, start, pause, reset } = useTimer(
    stepDuration(currentStep),
  )

  const prevTimerStateRef = useRef(timerState)
  useEffect(() => {
    const prev = prevTimerStateRef.current
    prevTimerStateRef.current = timerState
    if (timerState === 'done' && prev === 'running' && !isMutedRef.current) {
      playBeep()
    }
  }, [timerState])

  const toggleMute = () => {
    setIsMuted(m => {
      const next = !m
      try { localStorage.setItem(MUTED_KEY, String(next)) } catch { /* ignore */ }
      return next
    })
  }

  useEffect(() => {
    if (currentStep) reset(stepDuration(currentStep))
  }, [stepIndex, currentStep?.id])

  // Auto-save session state on every meaningful change
  useEffect(() => {
    if (!ceremony) return
    const retroNotesCount = Object.values(retroNotes).reduce((sum, notes) => sum + notes.length, 0)
    const session: SessionState = {
      ceremonyType,
      stepIndex,
      totalSteps: ceremony.steps.length,
      currentStepId: currentStep?.id ?? '',
      completedSteps,
      participants,
      participantCount: participants.length,
      retroNotes,
      retroNotesCount,
      retroFormat,
      teamName,
      sprintGoal: ceremonyType === 'planning' ? sprintGoal : undefined,
      impediments: ceremonyType === 'daily' ? impediments : undefined,
      demoItems: ceremonyType === 'review' ? demoItems : undefined,
      stepTimings,
      stepStartedAt: stepStartedAtRef.current,
      feedbackItems: ceremonyType === 'review' ? feedbackItems : undefined,
      savedAt: Date.now(),
    }
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)) } catch { /* ignore */ }
  }, [stepIndex, completedSteps, retroNotes, participants, ceremonyType, teamName, sprintGoal, impediments, demoItems, stepTimings, feedbackItems])

  const isFirst = stepIndex === 0
  const isLast = ceremony ? stepIndex === ceremony.steps.length - 1 : false
  const isDaily = ceremonyType === 'daily'
  const isReview = ceremonyType === 'review'
  const showImpediments = isDaily && stepIndex >= 1
  const showDemoChecklist = isReview && currentStep?.id === 'review-2'
  const showFeedback = isReview && currentStep?.id === 'review-3'

  // Records how long the step being left actually took (planned vs. actual), then rearms the clock for the next step.
  const recordStepTiming = (): StepTiming[] => {
    if (!currentStep) return stepTimings
    const actual = Math.max(0, Math.round((Date.now() - stepStartedAtRef.current) / 1000))
    const planned = stepDuration(currentStep)
    const existingIndex = stepTimings.findIndex(st => st.stepId === currentStep.id)
    const updated =
      existingIndex >= 0
        ? stepTimings.map((st, i) => (i === existingIndex ? { ...st, actual: st.actual + actual } : st))
        : [...stepTimings, { stepId: currentStep.id, planned, actual }]
    stepStartedAtRef.current = Date.now()
    setStepTimings(updated)
    return updated
  }

  const goNext = () => {
    if (!ceremony || !currentStep) return
    const newCompleted = Math.max(completedSteps, stepIndex + 1)
    setCompletedSteps(newCompleted)
    const timings = recordStepTiming()
    if (isLast) {
      onComplete(
        newCompleted,
        isDaily ? participants.map(p => p.name) : undefined,
        ceremonyType === 'planning' ? sprintGoal.trim() || undefined : undefined,
        isDaily ? impediments : undefined,
        isReview ? demoItems : undefined,
        timings,
        isReview ? feedbackItems : undefined,
      )
    } else {
      setStepIndex(i => i + 1)
    }
  }

  const goPrev = () => {
    if (!isFirst) {
      recordStepTiming()
      setStepIndex(i => i - 1)
    }
  }

  // Keep a ref to the latest handlers so the keyboard listener never captures stale closures
  const shortcutsRef = useRef({ timerState, start, pause, reset, currentStep, stepDuration, goNext, goPrev, toggleMute })
  shortcutsRef.current = { timerState, start, pause, reset, currentStep, stepDuration, goNext, goPrev, toggleMute }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const h = shortcutsRef.current
      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (h.timerState === 'running') h.pause()
          else if (h.timerState === 'idle' || h.timerState === 'paused') h.start()
          break
        case 'ArrowRight':
          e.preventDefault()
          h.goNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          h.goPrev()
          break
        case 'r':
        case 'R':
          if (h.currentStep) h.reset(h.stepDuration(h.currentStep))
          break
        case 'm':
        case 'M':
          h.toggleMute()
          break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!ceremony || !currentStep) return null

  const showRetroBoard = currentStep.triggersRetro === true
  const showPokerBanner = currentStep.triggersPoker === true

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-ghost">← {t('common.back')}</button>
        <div className="flex-1">
          <h2 className="font-bold text-gray-900 dark:text-gray-50 text-lg">
            {teamName ? `${teamName} · ${t(ceremony.nameKey)}` : t(ceremony.nameKey)}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('ceremony.stepOf', { current: stepIndex + 1, total: ceremony.steps.length })}
          </p>
        </div>
      </div>

      {/* Sprint Goal pinned reminder (planning ceremony, after goal-setting step) */}
      {ceremonyType === 'planning' && sprintGoal.trim() && currentStep.id !== 'planning-1' && (
        <div className="flex items-start gap-2 rounded-lg bg-brand-50 dark:bg-brand-700/20 border border-brand-200 dark:border-brand-700/40 px-3 py-2">
          <span className="text-sm">🎯</span>
          <p className="text-sm text-brand-700 dark:text-brand-300">
            <span className="font-medium">{t('planning.sprintGoalLabel')}:</span> {sprintGoal}
          </p>
        </div>
      )}

      {/* Last sprint context from Sprint Metrics (retro ceremony only) */}
      {ceremonyType === 'retro' && lastSprintSession && !lastSprintDismissed && (
        <div className="flex items-start gap-2 rounded-lg bg-brand-50 dark:bg-brand-700/20 border border-brand-200 dark:border-brand-700/40 px-3 py-2">
          <span className="text-sm">📊</span>
          <p className="flex-1 text-sm text-brand-700 dark:text-brand-300">
            <span className="font-medium">{lastSprintSession.projectName}</span>
            {' — '}
            {t('retro.lastSprintContext', {
              name: lastSprintSession.lastSprintName,
              velocity: lastSprintSession.lastVelocity,
              avgVelocity: lastSprintSession.avgVelocity,
            })}
            {lastSprintSession.lastSprintGoal ? ` "${lastSprintSession.lastSprintGoal}"` : ''}
          </p>
          <button
            onClick={() => setLastSprintDismissed(true)}
            className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-200 text-xs"
            aria-label={t('common.dismiss')}
          >
            ✕
          </button>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex gap-1.5 items-center">
        {ceremony.steps.map((_, i) => (
          <button
            key={i}
            onClick={() => { if (i !== stepIndex) { recordStepTiming(); setStepIndex(i) } }}
            className={`h-2 rounded-full transition-all ${
              i === stepIndex
                ? 'w-6 bg-brand-500'
                : i < stepIndex
                ? 'w-2 bg-brand-300'
                : 'w-2 bg-gray-200 dark:bg-gray-600'
            }`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Step card */}
      <div className="card p-4 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Timer */}
          <div className="w-24 sm:w-auto flex-shrink-0">
            <CountdownTimer
              timeRemaining={timeRemaining}
              percentLeft={percentLeft}
              timerState={timerState}
            />
          </div>
          {/* Step info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{t(currentStep.titleKey)}</h3>
            <span className="inline-block mt-1 text-xs font-medium bg-brand-50 dark:bg-brand-700/20 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full">
              {formatDuration(stepDuration(currentStep))}
            </span>
          </div>
        </div>

        {/* Timer controls */}
        <div className="flex gap-2 flex-wrap items-center">
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
            onClick={() => reset(stepDuration(currentStep))}
            className="btn-ghost"
            aria-label={t('ceremony.reset')}
          >
            ↺ {t('ceremony.reset')}
          </button>
          <button
            onClick={toggleMute}
            className="btn-ghost ml-auto text-gray-400 hover:text-gray-600"
            aria-label={isMuted ? t('ceremony.unmute') : t('ceremony.mute')}
            title={isMuted ? t('ceremony.unmute') : t('ceremony.mute')}
          >
            {isMuted ? '🔇' : '🔔'}
          </button>
        </div>

        {/* Why tooltip — not needed once presenting live */}
        {!facilitatorMode && <WhyTooltip whyKey={currentStep.whyKey} />}

        {/* Sprint Goal capture */}
        {ceremonyType === 'planning' && currentStep.id === 'planning-1' && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sprint-goal" className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {t('planning.sprintGoalLabel')}
            </label>
            <textarea
              id="sprint-goal"
              value={sprintGoal}
              onChange={e => setSprintGoal(e.target.value)}
              placeholder={t('planning.sprintGoalPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-500 resize-none"
            />
          </div>
        )}
      </div>

      {/* Daily / Sprint Review participant panel */}
      {(isDaily || isReview) && (
        <ParticipantPanel participants={participants} onChange={setParticipants} ceremonyType={ceremonyType} />
      )}

      {/* Daily impediment log */}
      {showImpediments && (
        <ImpedimentPanel impediments={impediments} onChange={setImpediments} />
      )}

      {/* Sprint Review demo checklist */}
      {showDemoChecklist && (
        <DemoChecklistPanel items={demoItems} onChange={setDemoItems} />
      )}

      {/* Sprint Review stakeholder feedback */}
      {showFeedback && (
        <FeedbackPanel items={feedbackItems} participants={participants} onChange={setFeedbackItems} />
      )}

      {/* Planning Poker banner */}
      {showPokerBanner && (
        <div className="card p-4 flex flex-col gap-2 border-l-4 border-brand-400">
          <div className="flex items-center gap-2">
            <span className="text-lg">🃏</span>
            <h3 className="font-medium text-gray-800 dark:text-gray-100">{t('poker.bannerTitle')}</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('poker.bannerDesc')}</p>
          {participants.length > 0 ? (
            <a
              href={`https://agile-toolkit.github.io/planning-poker/?participants=${encodeURIComponent(participants.map(p => p.name).join(','))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary self-start text-sm"
            >
              {t('poker.open')}
            </a>
          ) : (
            <div className="flex flex-col gap-2">
              <a
                href="https://agile-toolkit.github.io/planning-poker/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary self-start text-sm"
              >
                {t('poker.open')}
              </a>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('poker.noParticipants')}</p>
            </div>
          )}
        </div>
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

      {/* Facilitation tips — not needed once presenting live */}
      {!facilitatorMode && <FacilitationTips tipsKeys={ceremony.tipsKeys} />}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={goPrev} disabled={isFirst} className="btn-secondary disabled:opacity-40">
          {t('ceremony.prev')}
        </button>
        <button onClick={goNext} className="btn-primary">
          {isLast ? t('ceremony.finish') : t('ceremony.next')}
        </button>
      </div>

      {/* Keyboard shortcuts hint — hidden on touch-primary devices */}
      <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-xs text-gray-400 dark:text-gray-500">
        <span><Kbd>Space</Kbd> {t('keyboard.space')}</span>
        <span><Kbd>←</Kbd><Kbd>→</Kbd> {t('keyboard.arrows')}</span>
        <span><Kbd>R</Kbd> {t('keyboard.r')}</span>
        <span><Kbd>M</Kbd> {t('keyboard.m')}</span>
      </div>

      {/* Source */}
      <p className="text-xs text-center text-gray-400 dark:text-gray-500">{t('ceremony.source')}</p>
    </div>
  )
}
