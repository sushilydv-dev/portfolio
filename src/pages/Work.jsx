import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import PageHead from '@/components/ui/PageHead'
import SiteLink from '@/components/ui/SiteLink'
import WaveTitle from '@/components/ui/WaveTitle'
import { filters, intro, tagline, work } from '@/data/work'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'
const pad = (n) => String(n).padStart(2, '0')
const inFilter = (id) => (id === 'all' ? work : work.filter((w) => w.kinds.includes(id)))
const countOf = (id) => inFilter(id).length

/* ---------- Filters ---------- */

// Filter chips with a single ink pill that slides (and stretches) to whichever one is active
function Filters({ active, onChange }) {
  const barRef = useRef(null)
  const [pill, setPill] = useState(null)

  useLayoutEffect(() => {
    const measure = () => {
      const btn = barRef.current?.querySelector(`[data-id="${active}"]`)
      if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth, top: btn.offsetTop, height: btn.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active])

  return (
    <div ref={barRef} role="group" aria-label="Filter work" className="relative flex flex-wrap gap-2">
      {pill && (
        <span
          aria-hidden="true"
          className={`absolute rounded-full bg-ink transition-[left,top,width] duration-500 motion-reduce:transition-none ${SPRING}`}
          style={pill}
        />
      )}
      {filters.map(({ id, label }) => {
        const on = id === active
        return (
          <button
            key={id}
            data-id={id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(id)}
            className={`relative cursor-pointer rounded-full border px-4 py-2 font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-5 ${on ? 'border-transparent text-canvas' : 'border-line text-ink hover:border-ink'}`}
          >
            {label}
            <sup className={`ml-1 font-mono text-[0.65em] tabular-nums ${on ? 'text-canvas/70' : 'text-muted'}`}>{pad(countOf(id))}</sup>
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Rows ---------- */

// Corner brackets that snap in around a row on hover, like a selection in a design tool
function Brackets() {
  const corner = `absolute size-3 border-accent opacity-0 transition-[opacity,scale] duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 scale-50 motion-reduce:transition-none ${SPRING}`
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-x-3 inset-y-1 hidden md:block">
      <span className={`${corner} top-0 left-0 origin-top-left border-t-2 border-l-2`} />
      <span className={`${corner} top-0 right-0 origin-top-right border-t-2 border-r-2`} />
      <span className={`${corner} bottom-0 left-0 origin-bottom-left border-b-2 border-l-2`} />
      <span className={`${corner} right-0 bottom-0 origin-bottom-right border-r-2 border-b-2`} />
    </span>
  )
}

function ClientBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      Client work · confidential
    </span>
  )
}

// One project, linking to its own page. Rows rise in one after another whenever the list changes. On hover the other rows
// fade back, corner brackets snap around this one, a wave runs through its name and its stack
// lights up.
function Row({ item, index }) {
  return (
    <li
      className={`group relative border-b border-line transition-opacity duration-500 group-hover/list:[&:not(:hover)]:opacity-35 motion-safe:animate-[row-in_0.8s_cubic-bezier(0.16,1,0.3,1)_backwards] motion-reduce:transition-none`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Brackets />
      <SiteLink
        href={`/work/${item.slug}`}
        className="grid gap-x-8 gap-y-4 py-8 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:grid-cols-[3rem_minmax(0,1fr)_auto] md:py-10"
      >
        <span className="hidden pt-2 font-mono text-sm text-muted transition-colors duration-300 group-hover:text-accent md:block">{pad(index + 1)}</span>

        <div className="min-w-0">
          <h2 aria-label={item.name} className="text-[clamp(1.75rem,3.4vw,3rem)] leading-tight font-semibold tracking-tight">
            <WaveTitle text={item.name} />
          </h2>
          <p className="mt-1 font-mono text-sm tracking-wide text-muted uppercase">{item.category}</p>
          <p className="mt-4 max-w-[44em] text-muted transition-colors duration-500 group-hover:text-ink md:text-lg">{item.text}</p>
          <ul aria-label="Built with" className="mt-5 flex flex-wrap gap-2">
            {item.stack.map((tech, i) => (
              <li
                key={tech}
                className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted transition-colors duration-300 group-hover:border-accent/40 group-hover:text-accent md:text-sm"
                style={{ transitionDelay: `${i * 35}ms` }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-x-5 gap-y-3 md:flex-col md:items-end md:justify-between">
          <span className={`font-mono text-sm text-muted tabular-nums transition-[translate,color] duration-500 group-hover:text-accent md:group-hover:-translate-x-2 motion-reduce:transition-none ${EASE}`}>
            {item.year}
          </span>
          <span className="flex flex-col items-start gap-3 md:items-end">
            {item.client && <ClientBadge />}
            <span className="inline-flex items-center gap-2 font-medium text-accent">
              View project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 transition-transform duration-500 group-hover:translate-x-1.5 motion-reduce:transition-none ${SPRING}`}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </div>
      </SiteLink>
    </li>
  )
}

/* ---------- Page ---------- */

function Work() {
  const [active, setActive] = useState('all')
  const shown = inFilter(active)

  useEffect(() => {
    document.title = 'Work · Sushil Yadav'
  }, [])

  return (
    <main id="top" className="pb-24 md:pb-32">
      <PageHead label="Work" tagline={tagline.text} accent={tagline.accent}>
        <p className="mt-10 max-w-[38em] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-muted md:mt-14">{intro}</p>
      </PageHead>
      <section aria-label="Projects" className="mt-14 px-6 md:mt-20 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <Filters active={active} onChange={setActive} />
          <p aria-live="polite" className="font-mono text-sm text-muted tabular-nums">
            showing {pad(shown.length)} / {pad(work.length)}
          </p>
        </div>
        {/* keyed by filter so the rows replay their entrance each time the filter changes */}
        <ol key={active} className="group/list">
          {shown.map((item, i) => (
            <Row key={item.name} item={item} index={i} />
          ))}
        </ol>
      </section>
    </main>
  )
}

export default Work
