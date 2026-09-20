import { useEffect, useState } from 'react'

const BREAKPOINT = '(min-width: 768px)'

export function useIsWeb(): boolean {
  const [isWeb, setIsWeb] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(BREAKPOINT).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(BREAKPOINT)
    const onChange = () => setIsWeb(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isWeb
}
