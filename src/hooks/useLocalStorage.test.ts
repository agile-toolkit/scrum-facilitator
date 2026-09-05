import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the initial value when the key is absent', () => {
    const { result } = renderHook(() => useLocalStorage('missing-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('reads and JSON-parses an existing value', () => {
    localStorage.setItem('existing-key', JSON.stringify({ a: 1 }))
    const { result } = renderHook(() => useLocalStorage('existing-key', { a: 0 }))
    expect(result.current[0]).toEqual({ a: 1 })
  })

  it('writes through to localStorage and updates state', () => {
    const { result } = renderHook(() => useLocalStorage('write-key', 0))
    act(() => result.current[1](42))
    expect(result.current[0]).toBe(42)
    expect(localStorage.getItem('write-key')).toBe('42')
  })

  it('falls back to the initial value on corrupted JSON rather than throwing', () => {
    localStorage.setItem('corrupt-key', '{not json')
    const { result } = renderHook(() => useLocalStorage('corrupt-key', 'safe-default'))
    expect(result.current[0]).toBe('safe-default')
  })

  it('keeps separate keys independent', () => {
    const { result: a } = renderHook(() => useLocalStorage('key-a', 'a'))
    const { result: b } = renderHook(() => useLocalStorage('key-b', 'b'))
    act(() => a.current[1]('a-updated'))
    expect(a.current[0]).toBe('a-updated')
    expect(b.current[0]).toBe('b')
  })
})
