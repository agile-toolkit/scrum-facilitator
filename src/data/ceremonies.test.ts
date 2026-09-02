import { describe, it, expect } from 'vitest'
import { CEREMONIES, getCeremony, formatDuration } from './ceremonies'

describe('CEREMONIES', () => {
  it('has a unique type and at least one step for every ceremony', () => {
    const types = CEREMONIES.map(c => c.type)
    expect(new Set(types).size).toBe(types.length)
    for (const c of CEREMONIES) {
      expect(c.steps.length).toBeGreaterThan(0)
    }
  })

  it('has step ids unique within each ceremony', () => {
    for (const c of CEREMONIES) {
      const ids = c.steps.map(s => s.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  // Regression guard: totalMinutes is the number shown on the ceremony
  // selection card (home.timebox) before the guided steps ever run, so it
  // must reflect what the timer actually adds up to. Planning and Retro
  // drifted out of sync with their own steps at one point (240 vs an
  // actual 135, 90 vs an actual 65) — this catches that class of bug.
  it('totalMinutes matches the sum of its own step durations', () => {
    for (const c of CEREMONIES) {
      const stepMinutes = c.steps.reduce((sum, s) => sum + s.duration, 0) / 60
      expect(c.totalMinutes, `${c.type}: totalMinutes vs step sum`).toBe(stepMinutes)
    }
  })
})

describe('getCeremony', () => {
  it('finds a ceremony by type', () => {
    expect(getCeremony('daily')?.type).toBe('daily')
  })
  it('returns undefined for an unknown type', () => {
    expect(getCeremony('nonexistent')).toBeUndefined()
  })
})

describe('formatDuration', () => {
  it('formats sub-hour durations as minutes', () => {
    expect(formatDuration(5 * 60)).toBe('5m')
  })
  it('formats whole-hour durations without a minutes suffix', () => {
    expect(formatDuration(60 * 60)).toBe('1h')
  })
  it('formats mixed hour+minute durations', () => {
    expect(formatDuration(90 * 60)).toBe('1h 30m')
  })
})
