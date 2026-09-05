import { useEffect, useRef, useState } from 'react'

/**
 * Inline two-step confirm: first call arms a pending state that auto-cancels
 * after `timeoutMs`, second call (while armed) runs `action`. Shared by
 * StickyNote's delete button and HomeScreen's Discard button so a native
 * `window.confirm()` isn't the only guard on a destructive action.
 */
export function useConfirmAction(action: () => void, timeoutMs = 3000) {
  const [confirming, setConfirming] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const trigger = () => {
    if (confirming) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setConfirming(false)
      action()
    } else {
      setConfirming(true)
      timerRef.current = setTimeout(() => setConfirming(false), timeoutMs)
    }
  }

  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setConfirming(false)
  }

  return { confirming, trigger, cancel }
}
