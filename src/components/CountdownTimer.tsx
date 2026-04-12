import { formatTime } from '../hooks/useTimer'
import type { TimerState } from '../hooks/useTimer'

interface Props {
  timeRemaining: number
  percentLeft: number
  timerState: TimerState
}

const SIZE = 120
const STROKE = 8
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

export default function CountdownTimer({ timeRemaining, percentLeft, timerState }: Props) {
  const dashOffset = CIRC * (1 - percentLeft / 100)
  const isLow = percentLeft < 20 && timerState !== 'idle'
  const isDone = timerState === 'done'

  const ringColor = isDone
    ? 'text-gray-300'
    : isLow
    ? 'text-red-400'
    : 'text-brand-500'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          {/* Track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={STROKE}
          />
          {/* Progress */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            className={`${ringColor} transition-all duration-1000`}
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-xl font-mono font-bold tabular-nums ${
              isDone ? 'text-gray-400' : isLow ? 'text-red-500' : 'text-gray-800'
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  )
}
