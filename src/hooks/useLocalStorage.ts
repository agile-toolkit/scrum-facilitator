import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? (JSON.parse(item) as T) : initial
    } catch {
      return initial
    }
  })

  const setValue = useCallback(
    (value: T) => {
      try {
        setStored(value)
        localStorage.setItem(key, JSON.stringify(value))
      } catch {
        // ignore write errors
      }
    },
    [key],
  )

  return [stored, setValue]
}
