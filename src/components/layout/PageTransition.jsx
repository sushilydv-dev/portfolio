import { useEffect, useRef } from 'react'
import { setPageTransition } from '@/hooks/usePath'

// Fast page change: the current page blurs and fades up and away while a thin accent bar races
// across the top, the new page swaps in, then it focuses in from a soft blur (same feel as the
// hero's rise). About 0.4s in total. With reduced motion the page just swaps.

const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IN = 'cubic-bezier(0.7, 0, 0.84, 0)'
const OUT_MS = 160
const IN_MS = 280

const content = () => document.querySelectorAll('main, footer')

function PageTransition() {
  const bar = useRef(null)
  const busy = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    setPageTransition(async (_path, swap) => {
      if (reduced.matches || busy.current) return swap()
      busy.current = true

      // Accent bar sweeps across the top for the whole transition
      bar.current?.animate(
        [
          { transform: 'scaleX(0)', transformOrigin: 'left', opacity: 1 },
          { transform: 'scaleX(1)', transformOrigin: 'left', opacity: 1, offset: 0.7 },
          { transform: 'scaleX(1)', transformOrigin: 'left', opacity: 0 },
        ],
        { duration: OUT_MS + IN_MS, easing: EASE_OUT },
      )

      const outs = []
      try {
        // Out: blur, fade and lift slightly
        content().forEach((el) =>
          outs.push(
            el.animate([{ opacity: 1, filter: 'blur(0)', transform: 'none' }, { opacity: 0, filter: 'blur(6px)', transform: 'translateY(-8px)' }], {
              duration: OUT_MS,
              easing: EASE_IN,
              fill: 'forwards',
            }),
          ),
        )
        await Promise.all(outs.map((a) => a.finished))
        swap()
        // Let React render the new page before animating it in
        await new Promise((r) => requestAnimationFrame(r))
        // The footer stays mounted across pages: drop its held fade-out so it can come back
        outs.forEach((a) => a.cancel())
        // In: the new page focuses in from below
        content().forEach((el) =>
          el.animate([{ opacity: 0, filter: 'blur(6px)', transform: 'translateY(10px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }], {
            duration: IN_MS,
            easing: EASE_OUT,
          }),
        )
      } finally {
        outs.forEach((a) => a.cancel())
        busy.current = false
      }
    })
    return () => setPageTransition(null)
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5 origin-left scale-x-0 bg-accent shadow-[0_0_8px_var(--color-accent)] print:hidden"
    />
  )
}

export default PageTransition
