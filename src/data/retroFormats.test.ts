import { describe, it, expect } from 'vitest'
import { RETRO_FORMATS, getRetroFormat, emptyNotes } from './retroFormats'

describe('RETRO_FORMATS', () => {
  it('has a unique id and at least 2 columns for every format', () => {
    const ids = RETRO_FORMATS.map(f => f.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const f of RETRO_FORMATS) {
      expect(f.columns.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('has unique column ids within each format', () => {
    for (const f of RETRO_FORMATS) {
      const colIds = f.columns.map(c => c.id)
      expect(new Set(colIds).size).toBe(colIds.length)
    }
  })
})

describe('getRetroFormat', () => {
  it('finds a format by id', () => {
    expect(getRetroFormat('starfish').columns).toHaveLength(5)
  })
  it('falls back to the first format for an unknown id', () => {
    // @ts-expect-error deliberately invalid id to exercise the fallback
    expect(getRetroFormat('nonexistent')).toBe(RETRO_FORMATS[0])
  })
})

describe('emptyNotes', () => {
  it('creates one empty array per column', () => {
    const format = getRetroFormat('classic')
    const notes = emptyNotes(format)
    expect(Object.keys(notes)).toEqual(format.columns.map(c => c.id))
    for (const col of format.columns) {
      expect(notes[col.id]).toEqual([])
    }
  })
})
