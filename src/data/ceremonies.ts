import type { Ceremony } from '../types'

export const CEREMONIES: Ceremony[] = [
  {
    type: 'planning',
    nameKey: 'ceremonies.planning.name',
    descKey: 'ceremonies.planning.desc',
    totalMinutes: 240,
    icon: '📋',
    tipsKeys: [
      'ceremonies.planning.tips.0',
      'ceremonies.planning.tips.1',
      'ceremonies.planning.tips.2',
    ],
    steps: [
      {
        id: 'planning-1',
        titleKey: 'ceremonies.planning.steps.0.title',
        duration: 15 * 60,
        whyKey: 'ceremonies.planning.steps.0.why',
      },
      {
        id: 'planning-2',
        titleKey: 'ceremonies.planning.steps.1.title',
        duration: 30 * 60,
        whyKey: 'ceremonies.planning.steps.1.why',
      },
      {
        id: 'planning-3',
        titleKey: 'ceremonies.planning.steps.2.title',
        duration: 15 * 60,
        whyKey: 'ceremonies.planning.steps.2.why',
      },
      {
        id: 'planning-4',
        titleKey: 'ceremonies.planning.steps.3.title',
        duration: 60 * 60,
        whyKey: 'ceremonies.planning.steps.3.why',
      },
      {
        id: 'planning-5',
        titleKey: 'ceremonies.planning.steps.4.title',
        duration: 15 * 60,
        whyKey: 'ceremonies.planning.steps.4.why',
      },
    ],
  },
  {
    type: 'daily',
    nameKey: 'ceremonies.daily.name',
    descKey: 'ceremonies.daily.desc',
    totalMinutes: 15,
    icon: '☀️',
    tipsKeys: [
      'ceremonies.daily.tips.0',
      'ceremonies.daily.tips.1',
      'ceremonies.daily.tips.2',
    ],
    steps: [
      {
        id: 'daily-1',
        titleKey: 'ceremonies.daily.steps.0.title',
        duration: 5 * 60,
        whyKey: 'ceremonies.daily.steps.0.why',
      },
      {
        id: 'daily-2',
        titleKey: 'ceremonies.daily.steps.1.title',
        duration: 5 * 60,
        whyKey: 'ceremonies.daily.steps.1.why',
      },
      {
        id: 'daily-3',
        titleKey: 'ceremonies.daily.steps.2.title',
        duration: 5 * 60,
        whyKey: 'ceremonies.daily.steps.2.why',
      },
    ],
  },
  {
    type: 'review',
    nameKey: 'ceremonies.review.name',
    descKey: 'ceremonies.review.desc',
    totalMinutes: 120,
    icon: '🔍',
    tipsKeys: [
      'ceremonies.review.tips.0',
      'ceremonies.review.tips.1',
      'ceremonies.review.tips.2',
    ],
    steps: [
      {
        id: 'review-1',
        titleKey: 'ceremonies.review.steps.0.title',
        duration: 5 * 60,
        whyKey: 'ceremonies.review.steps.0.why',
      },
      {
        id: 'review-2',
        titleKey: 'ceremonies.review.steps.1.title',
        duration: 60 * 60,
        whyKey: 'ceremonies.review.steps.1.why',
      },
      {
        id: 'review-3',
        titleKey: 'ceremonies.review.steps.2.title',
        duration: 30 * 60,
        whyKey: 'ceremonies.review.steps.2.why',
      },
      {
        id: 'review-4',
        titleKey: 'ceremonies.review.steps.3.title',
        duration: 15 * 60,
        whyKey: 'ceremonies.review.steps.3.why',
      },
      {
        id: 'review-5',
        titleKey: 'ceremonies.review.steps.4.title',
        duration: 10 * 60,
        whyKey: 'ceremonies.review.steps.4.why',
      },
    ],
  },
  {
    type: 'retro',
    nameKey: 'ceremonies.retro.name',
    descKey: 'ceremonies.retro.desc',
    totalMinutes: 90,
    icon: '🔄',
    tipsKeys: [
      'ceremonies.retro.tips.0',
      'ceremonies.retro.tips.1',
      'ceremonies.retro.tips.2',
    ],
    steps: [
      {
        id: 'retro-1',
        titleKey: 'ceremonies.retro.steps.0.title',
        duration: 10 * 60,
        whyKey: 'ceremonies.retro.steps.0.why',
      },
      {
        id: 'retro-2',
        titleKey: 'ceremonies.retro.steps.1.title',
        duration: 20 * 60,
        whyKey: 'ceremonies.retro.steps.1.why',
        triggersRetro: true,
      },
      {
        id: 'retro-3',
        titleKey: 'ceremonies.retro.steps.2.title',
        duration: 20 * 60,
        whyKey: 'ceremonies.retro.steps.2.why',
      },
      {
        id: 'retro-4',
        titleKey: 'ceremonies.retro.steps.3.title',
        duration: 10 * 60,
        whyKey: 'ceremonies.retro.steps.3.why',
        triggersRetro: true,
      },
      {
        id: 'retro-5',
        titleKey: 'ceremonies.retro.steps.4.title',
        duration: 5 * 60,
        whyKey: 'ceremonies.retro.steps.4.why',
      },
    ],
  },
]

export function getCeremony(type: string): Ceremony | undefined {
  return CEREMONIES.find(c => c.type === type)
}

export function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  const m = Math.floor(seconds / 60)
  return `${m}m`
}
