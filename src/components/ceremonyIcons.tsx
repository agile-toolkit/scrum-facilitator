import type { ComponentType } from 'react'
import type { CeremonyType } from '../types'
import { ClipboardIcon, SunIcon, SearchIcon, RefreshIcon } from './icons'

export const CEREMONY_ICONS: Record<CeremonyType, ComponentType<{ className?: string }>> = {
  planning: ClipboardIcon,
  daily: SunIcon,
  review: SearchIcon,
  retro: RefreshIcon,
}
