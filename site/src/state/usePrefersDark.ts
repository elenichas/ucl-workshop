import { useEffect, useState } from 'react'

/** Follows the operating system's light/dark setting, live. */
export function usePrefersDark() {
  const query = '(prefers-color-scheme: dark)'
  const [dark, setDark] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return dark
}
