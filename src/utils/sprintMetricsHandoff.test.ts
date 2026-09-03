import { describe, it, expect, beforeEach } from 'vitest'
import { parseCeremonyParam, readLastSprintSession, appendSprintEntryToSprintMetrics } from './sprintMetricsHandoff'

beforeEach(() => {
  localStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('parseCeremonyParam', () => {
  it('returns null with no ?ceremony param', () => {
    expect(parseCeremonyParam('')).toBeNull()
  })

  it('accepts a valid ceremony type, matching Sprint Metrics\' "Start Retro" link', () => {
    expect(parseCeremonyParam('?ceremony=retro')).toBe('retro')
    expect(parseCeremonyParam('?ceremony=planning')).toBe('planning')
    expect(parseCeremonyParam('?ceremony=daily')).toBe('daily')
    expect(parseCeremonyParam('?ceremony=review')).toBe('review')
  })

  it('rejects an unrecognized ceremony type', () => {
    expect(parseCeremonyParam('?ceremony=made-up')).toBeNull()
  })
})

describe('readLastSprintSession', () => {
  it('returns null when nothing was saved', () => {
    expect(readLastSprintSession()).toBeNull()
  })

  it('reads a session written by Sprint Metrics\' writeLastSession', () => {
    const session = {
      projectId: 'p1',
      projectName: 'Checkout Revamp',
      lastSprintName: 'Sprint 12',
      lastSprintGoal: 'Ship the new checkout flow',
      lastVelocity: 23,
      avgVelocity: 21,
      lastMood: 3,
      targetScope: 200,
      totalCompleted: 140,
      sprintsRemaining: 3,
      updatedAt: '2026-09-01T00:00:00.000Z',
    }
    localStorage.setItem('sprint-metrics:lastSession', JSON.stringify(session))
    expect(readLastSprintSession()).toEqual(session)
  })

  it('recovers gracefully from malformed JSON', () => {
    localStorage.setItem('sprint-metrics:lastSession', 'not-json')
    expect(readLastSprintSession()).toBeNull()
  })

  it('rejects a payload missing the expected shape', () => {
    localStorage.setItem('sprint-metrics:lastSession', JSON.stringify({ foo: 'bar' }))
    expect(readLastSprintSession()).toBeNull()
  })
})

describe('appendSprintEntryToSprintMetrics', () => {
  const entry = { id: '1', name: '9/1/2026', planned: 0, completed: 0, carriedOver: 0 }

  it('appends to the active project when sprint-metrics-projects exists (current multi-project model)', () => {
    const projects = [
      { id: 'p1', name: 'Project One', config: {}, sprints: [], createdAt: '2026-01-01' },
      { id: 'p2', name: 'Project Two', config: {}, sprints: [{ id: '0', name: 'old', planned: 5, completed: 5, carriedOver: 0 }], createdAt: '2026-01-01' },
    ]
    localStorage.setItem('sprint-metrics-projects', JSON.stringify(projects))
    localStorage.setItem('sprint-metrics-active-project', 'p2')

    appendSprintEntryToSprintMetrics(entry)

    const saved = JSON.parse(localStorage.getItem('sprint-metrics-projects')!)
    expect(saved[0].sprints).toEqual([]) // p1 untouched
    expect(saved[1].sprints).toHaveLength(2)
    expect(saved[1].sprints[1]).toEqual(entry)
  })

  it('falls back to the first project when the active-project id does not match any project', () => {
    const projects = [
      { id: 'p1', name: 'Project One', config: {}, sprints: [], createdAt: '2026-01-01' },
    ]
    localStorage.setItem('sprint-metrics-projects', JSON.stringify(projects))
    localStorage.setItem('sprint-metrics-active-project', 'does-not-exist')

    appendSprintEntryToSprintMetrics(entry)

    const saved = JSON.parse(localStorage.getItem('sprint-metrics-projects')!)
    expect(saved[0].sprints).toEqual([entry])
  })

  it('falls back to the legacy key on a fresh install with no projects yet', () => {
    appendSprintEntryToSprintMetrics(entry)

    expect(localStorage.getItem('sprint-metrics-projects')).toBeNull()
    const legacy = JSON.parse(localStorage.getItem('sprint-metrics-sprints')!)
    expect(legacy).toEqual([entry])
  })

  it('appends to existing legacy entries rather than overwriting them', () => {
    localStorage.setItem('sprint-metrics-sprints', JSON.stringify([{ id: '0', name: 'old', planned: 1, completed: 1, carriedOver: 0 }]))

    appendSprintEntryToSprintMetrics(entry)

    const legacy = JSON.parse(localStorage.getItem('sprint-metrics-sprints')!)
    expect(legacy).toHaveLength(2)
    expect(legacy[1]).toEqual(entry)
  })

  it('falls back to the legacy key when sprint-metrics-projects is an empty array', () => {
    localStorage.setItem('sprint-metrics-projects', JSON.stringify([]))

    appendSprintEntryToSprintMetrics(entry)

    const legacy = JSON.parse(localStorage.getItem('sprint-metrics-sprints')!)
    expect(legacy).toEqual([entry])
  })
})
