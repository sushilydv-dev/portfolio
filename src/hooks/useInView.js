import { useEffect, useRef, useState } from 'react'

// True once the element has scrolled into view (and stays true). With reduced motion it starts true.
export function useInView({ threshold = 0.25 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, threshold])

  return [ref, inView]
}
