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
      { id: 'wellDone',  labelKey: 'retro.columns.wellDone',  colorClass: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',   headerColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' },
      { id: 'toImprove', labelKey: 'retro.columns.toImprove', colorClass: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800', headerColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' },
      { id: 'actions',   labelKey: 'retro.columns.actions',   colorClass: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',         headerColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' },
    ],
  },
  {
    id: 'four-ls',
    nameKey: 'retro.format.four-ls',
    columns: [
      { id: 'liked',    labelKey: 'retro.columns.liked',    colorClass: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',     headerColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' },
      { id: 'learned',  labelKey: 'retro.columns.learned',  colorClass: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800', headerColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' },
      { id: 'lacked',   labelKey: 'retro.columns.lacked',   colorClass: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800', headerColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200' },
      { id: 'longedFor', labelKey: 'retro.columns.longedFor', colorClass: 'bg-pink-50 dark:bg-pink-950 border-pink-200 dark:border-pink-800',       headerColor: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200' },
    ],
  },
  {
    id: 'mad-sad-glad',
    nameKey: 'retro.format.mad-sad-glad',
    columns: [
      { id: 'mad',  labelKey: 'retro.columns.mad',  colorClass: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',     headerColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' },
      { id: 'sad',  labelKey: 'retro.columns.sad',  colorClass: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800', headerColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' },
      { id: 'glad', labelKey: 'retro.columns.glad', colorClass: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800', headerColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' },
    ],
  },
  {
    id: 'sailboat',
    nameKey: 'retro.format.sailboat',
    columns: [
      { id: 'wind',   labelKey: 'retro.columns.wind',   colorClass: 'bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800',       headerColor: 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200' },
      { id: 'anchor', labelKey: 'retro.columns.anchor', colorClass: 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700', headerColor: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' },
      { id: 'rocks',  labelKey: 'retro.columns.rocks',  colorClass: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800', headerColor: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200' },
    ],
  },
]

export function getRetroFormat(id: RetroFormat): RetroFormatConfig {
  return RETRO_FORMATS.find(f => f.id === id) ?? RETRO_FORMATS[0]
}

export function emptyNotes(format: RetroFormatConfig): RetroNotes {
  return Object.fromEntries(format.columns.map(col => [col.id, []]))
}
