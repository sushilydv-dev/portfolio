import { useEffect, useRef } from 'react'

// For a section at the top of the page: while it is on screen, writes the scroll position into two
// CSS variables on it, so children can animate off them without any re-rendering:
//   --sy  pixels scrolled (a plain number, e.g. 240)
//   --p   the same as a fraction of the screen height (0.5 = scrolled half a screen)
// Both stay at 0 when reduced motion is on.
export function useScrollProgress() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.min(window.scrollY, el.offsetHeight) // no need to keep going once it's off screen
      el.style.setProperty('--sy', y.toFixed(1))
      el.style.setProperty('--p', (y / window.innerHeight).toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}
