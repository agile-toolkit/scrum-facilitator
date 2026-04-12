import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerState = 'idle' | 'running' | 'paused' | 'done'

interface UseTimerReturn {
  timeRemaining: number
  timerState: TimerState
  start: () => void
  pause: () => void
  reset: (duration: number) => void
  percentLeft: number
}

export function useTimer(initialDuration: number): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(initialDuration)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const durationRef = useRef(initialDuration)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const start = useCallback(() => {
    setTimerState(prev => (prev === 'done' ? prev : 'running'))
  }, [])

  const pause = useCallback(() => {
    setTimerState(prev => (prev === 'running' ? 'paused' : prev))
  }, [])

  const reset = useCallback((duration: number) => {
    clearTimer()
    durationRef.current = duration
    setTimeRemaining(duration)
    setTimerState('idle')
  }, [])

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearTimer()
            setTimerState('done')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [timerState])

  const percentLeft =
    durationRef.current > 0 ? (timeRemaining / durationRef.current) * 100 : 0

  return { timeRemaining, timerState, start, pause, reset, percentLeft }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
