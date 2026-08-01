import { useEffect, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

export function useCountUp(target: number, duration = 700, decimals = 0) {
  const reducedMotion = usePrefersReducedMotion()
  const [value, setValue] = useState(reducedMotion ? target : 0)

  useEffect(() => {
    if (reducedMotion) {
      setValue(target)
      return
    }

    setValue(0)
    const start = performance.now()
    let frame: number

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const current = target * easeOutCubic(progress)
      setValue(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reducedMotion])

  if (decimals > 0) return value.toFixed(decimals).replace('.', ',')
  return Math.round(value).toString()
}
