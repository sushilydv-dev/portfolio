import { useCallback, useState } from 'react'
import { flushSync } from 'react-dom'

const current = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

// Light/dark theme stored on <html data-theme>. Every visit starts light (set in index.html before first paint);
// the choice is not saved, so a reload goes back to light.
// `toggle({ x, y })` reveals the new theme in a circle growing from that point (View Transitions),
// and falls back to an instant switch where unsupported or when reduced motion is on.
export function useTheme() {
  const [theme, setTheme] = useState(current)

  const toggle = useCallback(
    (origin) => {
      const next = theme === 'dark' ? 'light' : 'dark'
      const apply = () => {
        document.documentElement.dataset.theme = next
        flushSync(() => setTheme(next))
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduced || !origin) {
        apply()
        return
      }

      const { x, y } = origin
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      const transition = document.startViewTransition(apply)
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
        )
      })
    },
    [theme],
  )

  return { theme, toggle }
}
