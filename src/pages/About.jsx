import { useEffect, useRef } from 'react'
import ArrowLink from '@/components/ui/ArrowLink'
import PageHead from '@/components/ui/PageHead'
import SiteLink from '@/components/ui/SiteLink'
import WaveTitle from '@/components/ui/WaveTitle'
import { bio, lead, path, tagline, toolkit } from '@/data/about'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { useInView } from '@/hooks/useInView'
import { useMagnetic } from '@/hooks/useMagnetic'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Fades and lifts its children in when scrolled into view
function Reveal({ children, delay = 0, className = '' }) {
  const [ref, shown] = useInView({ threshold: 0.2 })
  return (
    <div
      ref={ref}
      className={`transition-[opacity,translate] duration-1000 motion-reduce:transition-none ${EASE} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Small blue section label, with an optional count beside it (e.g. Path ⁵)
function Label({ id, children, count }) {
  return (
    <h2 id={id} className="flex items-start gap-2 text-lg font-medium text-accent md:text-2xl">
      {children}
      {count != null && (
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold tabular-nums md:text-sm">{count}</span>
      )}
    </h2>
  )
}

/* ---------- Bio ---------- */

// Scroll progress through an element, 0 → 1, written to --p (no re-render per frame)
function useInk() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduceMotion()) {
      el.style.setProperty('--p', '1')
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // starts as the paragraph's top reaches 85% of the screen, done as its bottom passes 55%
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.3)
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
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

// The big first paragraph: pale at first, its words ink in one after another as you scroll
function Lead() {
  const ref = useInk()
  const words = lead.split(' ')

  return (
    <p ref={ref} className="max-w-[24em] text-[clamp(1.85rem,3.9vw,3.6rem)] leading-[1.25] font-medium tracking-tight text-ink">
      {words.map((word, i) => (
        <span key={i}>
          <span style={{ opacity: `clamp(0.18, calc(var(--p, 0) * ${words.length + 4} - ${i}), 1)` }}>{word}</span>{' '}
        </span>
      ))}
    </p>
  )
}

// Link pill: fills with ink from the bottom on hover and leans toward the cursor
function PillLink({ href, children, external }) {
  const ref = useMagnetic({ radius: 40, strength: 0.2, maxOffset: 8, stretch: 0.05 })
  return (
    <SiteLink
      ref={ref}
      href={href}
      {...(external && { target: '_blank', rel: 'me noreferrer' })}
      className="group relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-line px-5 py-2.5 font-medium text-ink transition-colors duration-300 will-change-transform hover:text-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 translate-y-full rounded-full bg-ink transition-transform duration-500 group-hover:translate-y-0 motion-reduce:transition-none ${EASE}`}
      />
      {children}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 transition-[rotate] duration-500 group-hover:rotate-45 ${SPRING}`}>
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </SiteLink>
  )
}

function Bio() {
  return (
    <section aria-label="Bio" className="px-6 pt-20 pb-20 md:px-12 md:pt-28 md:pb-28">
      <Lead />
      <div className="mt-12 flex flex-col gap-6 md:mt-16 md:ml-auto md:max-w-[min(42rem,60%)]">
        {bio.map((paragraph, i) => (
          <Reveal key={i} delay={i * 120}>
            <p className="text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-muted">{paragraph}</p>
          </Reveal>
        ))}
        <Reveal delay={260} className="mt-4 flex flex-wrap gap-3">
          {socials.map((social) => (
            <PillLink key={social.label} href={social.href} external>
              {social.label}
            </PillLink>
          ))}
          <PillLink href={`mailto:${profile.email}`}>Email</PillLink>
          <PillLink href="/resume">Resume</PillLink>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Path ---------- */

// One step: its top rule draws in from the left and the content rises after it. On hover it
// behaves like a Work with me row: the other rows fade back, a wave runs through the title's
// letters as they turn blue, the details darken and the dates step toward the title.
function Step({ item, index }) {
  const [ref, shown] = useInView({ threshold: 0.35 })

  return (
    <li
      ref={ref}
      className="relative transition-opacity duration-500 group-hover/list:[&:not(:hover)]:opacity-35 motion-reduce:transition-none"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-px origin-left bg-line transition-transform duration-1000 motion-reduce:transition-none ${EASE} ${shown ? 'scale-x-100' : 'scale-x-0'}`}
      />
      <div
        className={`group grid gap-x-6 gap-y-1 py-6 transition-[opacity,translate] duration-700 md:grid-cols-[3rem_minmax(0,1.5fr)_minmax(0,1fr)_auto] md:items-baseline md:py-8 motion-reduce:transition-none ${EASE} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        style={{ transitionDelay: shown ? '200ms' : '0ms' }}
      >
        <span className="hidden font-mono text-sm text-muted transition-colors duration-300 group-hover:text-accent md:block">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <h3
            aria-label={item.title}
            className="text-[clamp(1.4rem,2.4vw,2.25rem)] leading-tight font-semibold tracking-tight"
          >
            <WaveTitle text={item.title} />
          </h3>
          <p className="mt-1 text-muted transition-colors duration-500 group-hover:text-ink md:text-lg">{item.org}</p>
        </div>
        <p className="text-muted transition-colors duration-500 group-hover:text-ink">{item.detail}</p>
        <p className={`font-medium whitespace-nowrap text-muted tabular-nums transition-[translate,color] duration-500 group-hover:text-accent md:text-right md:group-hover:-translate-x-4 motion-reduce:transition-none ${EASE}`}>
          {item.period}
        </p>
      </div>
    </li>
  )
}

function Path() {
  return (
    <section aria-labelledby="path-heading" className="px-6 py-20 md:px-12 md:py-28">
      <Label id="path-heading" count={path.length}>
        Path
      </Label>
      <ol className="group/list mt-10 border-b border-line md:mt-14">
        {path.map((item, i) => (
          <Step key={item.title + item.org} item={item} index={i} />
        ))}
      </ol>
    </section>
  )
}

/* ---------- Toolkit ---------- */

// One tool: rises in with its column; on hover it rolls over to a blue copy of itself and the
// other tools in its column fade back
function Tool({ children, delay, shown }) {
  return (
    <li
      className={`transition-[opacity,translate] duration-700 group-hover/col:[&:not(:hover)]:opacity-35 motion-reduce:transition-none ${EASE} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      <span className="group/tool block cursor-default overflow-hidden leading-[1.25]">
        <span
          className={`block [text-shadow:0_1.25em_0_var(--color-accent)] transition-transform duration-500 group-hover/tool:-translate-y-[1.25em] motion-reduce:transition-none ${EASE}`}
        >
          {children}
        </span>
      </span>
    </li>
  )
}

function Toolkit() {
  const [ref, shown] = useInView({ threshold: 0.25 })

  return (
    <section aria-labelledby="toolkit-heading" className="px-6 py-20 md:px-12 md:py-28">
      <Label id="toolkit-heading">Toolkit</Label>
      <div ref={ref} className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 md:mt-14 md:grid-cols-3 xl:grid-cols-5">
        {toolkit.map(({ group, tools }, col) => (
          <div key={group} className="border-t border-line pt-5">
            <h3 className="mb-5 flex items-center justify-between text-sm font-medium text-muted md:text-base">
              {group}
              <span className="font-mono text-xs tabular-nums">{String(tools.length).padStart(2, '0')}</span>
            </h3>
            <ul className="group/col flex flex-col gap-1.5 text-[clamp(1.35rem,1.9vw,1.9rem)] font-semibold tracking-tight text-ink">
              {tools.map((tool, i) => (
                <Tool key={tool} delay={col * 90 + i * 60} shown={shown}>
                  {tool}
                </Tool>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Page ---------- */

function About() {
  useEffect(() => {
    document.title = 'About · Sushil Yadav'
  }, [])

  return (
    <main id="top">
      <PageHead label="About" tagline={tagline.text} accent={tagline.accent} />
      <Bio />
      <Path />
      <Toolkit />
      <nav aria-label="More about me" className="flex flex-wrap gap-x-12 gap-y-4 px-6 pb-24 text-lg md:px-12 md:pb-32 md:text-xl">
        <ArrowLink href="/resume">My resume</ArrowLink>
        <ArrowLink href="/now">What I’m doing now</ArrowLink>
      </nav>
    </main>
  )
}

export default About
