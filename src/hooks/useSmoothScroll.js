import { useEffect } from 'react'
import Lenis from 'lenis'

// Smooth, gliding page scroll (Lenis). Native scroll events still fire, so scroll-based hooks keep
// working. Nav links (#about etc.) glide too. Skipped when reduced motion is on.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: true, anchors: true })
    window.__lenis = lenis // lets overlays (the mobile menu) pause the page scroll
    return () => {
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
}
