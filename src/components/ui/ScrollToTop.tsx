import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface ScrollToTopProps {
  threshold?: number
  className?: string
}

export function ScrollToTop({ threshold = 400, className }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full gradient-gold text-navy shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0',
        className,
      )}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  )
}
