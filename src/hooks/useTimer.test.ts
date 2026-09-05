import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer, formatTime } from './useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts idle at the initial duration', () => {
    const { result } = renderHook(() => useTimer(10))
    expect(result.current.timeRemaining).toBe(10)
    expect(result.current.timerState).toBe('idle')
    expect(result.current.percentLeft).toBe(100)
  })

  it('counts down once per second after start', () => {
    const { result } = renderHook(() => useTimer(5))
    act(() => result.current.start())
    expect(result.current.timerState).toBe('running')

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.timeRemaining).toBe(4)

    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.timeRemaining).toBe(2)
  })

  it('pauses and stops counting down', () => {
    const { result } = renderHook(() => useTimer(5))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.timeRemaining).toBe(4)

    act(() => result.current.pause())
    expect(result.current.timerState).toBe('paused')
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.timeRemaining).toBe(4)
  })

  it('reaches done exactly once and clamps at zero', () => {
    const { result } = renderHook(() => useTimer(2))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current.timerState).toBe('done')
    expect(result.current.timeRemaining).toBe(0)

    // further ticks (or a stray start()) must not go negative or leave 'done'
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.timeRemaining).toBe(0)
    act(() => result.current.start())
    expect(result.current.timerState).toBe('done')
  })

  it('reset() restores idle state at a new duration and cancels any running interval', () => {
    const { result } = renderHook(() => useTimer(5))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(1000))

    act(() => result.current.reset(20))
    expect(result.current.timeRemaining).toBe(20)
    expect(result.current.timerState).toBe('idle')

    // no leftover interval ticking after reset
    act(() => vi.advanceTimersByTime(3000))
    expect(result.current.timeRemaining).toBe(20)
  })
})

describe('formatTime', () => {
  it('pads minutes and seconds to two digits', () => {
    expect(formatTime(5)).toBe('00:05')
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(600)).toBe('10:00')
  })
})
