import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import BuildLogo from '@/components/ui/BuildLogo'
import { profile } from '@/data/profile'

// Mixed type styles, cycled through the words so the strip feels playful
const WORD_STYLES = [
  'font-display font-normal',
  'font-sans font-semibold tracking-tight',
  'font-sans font-light italic',
  'font-sans font-semibold tracking-tight text-accent',
]

// Icons are small and sized with the text, so the words lead and the icons accent them
const ICON_SIZE = 'size-[clamp(2.5rem,5vw,4.75rem)]'

const BASE_SPEED = 40 // px per second when idle
const SCROLL_BOOST = 0.7 // extra px/s for every px/s of page scroll
const MAX_SPEED = 1600

function Set({ items, setRef }) {
  return (
    <div ref={setRef} className="flex shrink-0 items-center gap-[clamp(1.5rem,3vw,3rem)] pr-[clamp(1.5rem,3vw,3rem)]">
      {items.map((item, i) => (
        <div key={item.label} className="flex shrink-0 items-center gap-[clamp(1.5rem,3vw,3rem)]">
          <span className={`whitespace-nowrap text-[clamp(3rem,7.5vw,7rem)] leading-none text-ink ${WORD_STYLES[i % WORD_STYLES.length]}`}>
            {item.label}
          </span>
          <BuildLogo kind={item.logo} className={`${ICON_SIZE} shrink-0`} />
        </div>
      ))}
    </div>
  )
}

function BuildMarquee() {
  const items = profile.builds
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const setRef = useRef(null)
  const [copies, setCopies] = useState(2)

  // Enough copies to always fill the screen width, plus one to wrap with
  useLayoutEffect(() => {
    const measure = () => {
      const w = setRef.current?.offsetWidth
      if (w) setCopies(Math.max(2, Math.ceil(window.innerWidth / w) + 1))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(setRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Drift left-to-right forever; scrolling the page speeds it up, then it eases back
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let x = 0
    let speed = BASE_SPEED
    let lastY = window.scrollY
    let lastT = performance.now()
    let frame = 0
    let visible = true

    const tick = (t) => {
      const dt = Math.min((t - lastT) / 1000, 0.1)
      lastT = t
      const y = window.scrollY
      const scrollV = dt > 0 ? Math.abs(y - lastY) / dt : 0
      lastY = y

      const target = Math.min(BASE_SPEED + scrollV * SCROLL_BOOST, MAX_SPEED)
      speed += (target - speed) * (target > speed ? 0.25 : 0.05) // quick to speed up, slow to settle

      const w = setRef.current?.offsetWidth || 1
      x = (x + speed * dt) % w
      if (trackRef.current) trackRef.current.style.transform = `translate3d(${x - w}px,0,0)`

      frame = visible ? requestAnimationFrame(tick) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) {
        lastT = performance.now()
        lastY = window.scrollY
        frame = requestAnimationFrame(tick)
      }
    })
    io.observe(sectionRef.current)

    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section ref={sectionRef} aria-label="What I build" className="my-6 overflow-hidden border-y border-ink/15 py-6 md:my-8 md:py-8">
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.label}>{item.label}</li>
        ))}
      </ul>
      <div ref={trackRef} className="flex w-max will-change-transform" aria-hidden="true">
        {Array.from({ length: copies }, (_, i) => (
          <Set key={i} items={items} setRef={i === 0 ? setRef : undefined} />
        ))}
      </div>
    </section>
  )
}

export default BuildMarquee
