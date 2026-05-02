import type { RetroFormat, RetroNotes } from '../types'

export interface RetroFormatColumn {
  id: string
  labelKey: string
  colorClass: string
  headerColor: string
}

export interface RetroFormatConfig {
  id: RetroFormat
  nameKey: string
  columns: RetroFormatColumn[]
}

export const RETRO_FORMATS: RetroFormatConfig[] = [
  {
    id: 'classic',
    nameKey: 'retro.format.classic',
    columns: [
      { id: 'wellDone',  labelKey: 'retro.columns.wellDone',  colorClass: 'bg-green-50 border-green-200',  headerColor: 'bg-green-100 text-green-800' },
      { id: 'toImprove', labelKey: 'retro.columns.toImprove', colorClass: 'bg-yellow-50 border-yellow-200', headerColor: 'bg-yellow-100 text-yellow-800' },
      { id: 'actions',   labelKey: 'retro.columns.actions',   colorClass: 'bg-blue-50 border-blue-200',    headerColor: 'bg-blue-100 text-blue-800' },
    ],
  },
  {
    id: 'four-ls',
    nameKey: 'retro.format.four-ls',
    columns: [
      { id: 'liked',    labelKey: 'retro.columns.liked',    colorClass: 'bg-green-50 border-green-200',   headerColor: 'bg-green-100 text-green-800' },
      { id: 'learned',  labelKey: 'retro.columns.learned',  colorClass: 'bg-purple-50 border-purple-200', headerColor: 'bg-purple-100 text-purple-800' },
      { id: 'lacked',   labelKey: 'retro.columns.lacked',   colorClass: 'bg-orange-50 border-orange-200', headerColor: 'bg-orange-100 text-orange-800' },
      { id: 'longedFor', labelKey: 'retro.columns.longedFor', colorClass: 'bg-pink-50 border-pink-200',   headerColor: 'bg-pink-100 text-pink-800' },
    ],
  },
  {
    id: 'mad-sad-glad',
    nameKey: 'retro.format.mad-sad-glad',
    columns: [
      { id: 'mad',  labelKey: 'retro.columns.mad',  colorClass: 'bg-red-50 border-red-200',    headerColor: 'bg-red-100 text-red-800' },
      { id: 'sad',  labelKey: 'retro.columns.sad',  colorClass: 'bg-blue-50 border-blue-200',  headerColor: 'bg-blue-100 text-blue-800' },
      { id: 'glad', labelKey: 'retro.columns.glad', colorClass: 'bg-green-50 border-green-200', headerColor: 'bg-green-100 text-green-800' },
    ],
  },
  {
    id: 'sailboat',
    nameKey: 'retro.format.sailboat',
    columns: [
      { id: 'wind',   labelKey: 'retro.columns.wind',   colorClass: 'bg-sky-50 border-sky-200',    headerColor: 'bg-sky-100 text-sky-800' },
      { id: 'anchor', labelKey: 'retro.columns.anchor', colorClass: 'bg-slate-50 border-slate-200', headerColor: 'bg-slate-100 text-slate-800' },
      { id: 'rocks',  labelKey: 'retro.columns.rocks',  colorClass: 'bg-amber-50 border-amber-200', headerColor: 'bg-amber-100 text-amber-800' },
    ],
  },
]

export function getRetroFormat(id: RetroFormat): RetroFormatConfig {
  return RETRO_FORMATS.find(f => f.id === id) ?? RETRO_FORMATS[0]
}

export function emptyNotes(format: RetroFormatConfig): RetroNotes {
  return Object.fromEntries(format.columns.map(col => [col.id, []]))
}
