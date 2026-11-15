import { useEffect, useRef } from 'react'

// Tracks the pointer inside an element and exposes its position as the CSS variables --mx / --my
// (in px), eased so the spotlight glides after the cursor. Skipped on touch devices and when
// reduced motion is on; the CSS fallbacks then keep the spotlight at its resting position.
export function useSpotlight({ ease = 0.1, restX = 0.72, restY = 0.35 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return

    let x = null
    let y = null
    let tx = 0
    let ty = 0
    let frame = 0

    const tick = () => {
      x += (tx - x) * ease
      y += (ty - y) * ease
      el.style.setProperty('--mx', `${x.toFixed(1)}px`)
      el.style.setProperty('--my', `${y.toFixed(1)}px`)
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      tx = e.clientX - r.left
      ty = e.clientY - r.top
      if (x === null) {
        // start from the resting position so the first move glides instead of jumping
        x = r.width * restX
        y = r.height * restY
      }
      if (!frame) frame = requestAnimationFrame(tick)
    }

    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [ease, restX, restY])

  return ref
}
