import { useEffect, useId, useState } from 'react'
import PageHead from '@/components/ui/PageHead'
import SiteLink from '@/components/ui/SiteLink'
import { services } from '@/data/services'
import { faq, intro, process, tagline } from '@/data/servicesPage'
import { profile } from '@/data/profile'
import { work } from '@/data/work'
import { useInView } from '@/hooks/useInView'
import { useMagnetic } from '@/hooks/useMagnetic'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'
const pad = (n) => String(n).padStart(2, '0')

// Small blue section label
function Label({ id, children }) {
  return (
    <h2 id={id} className="text-lg font-medium text-accent md:text-2xl">
      {children}
    </h2>
  )
}

// Solid "Start a project" button: ink pill that turns blue on hover, its arrow sliding on,
// pulled gently toward the cursor
function StartButton() {
  const ref = useMagnetic({ radius: 60, strength: 0.2, maxOffset: 10, stretch: 0.05 })
  return (
    <SiteLink
      ref={ref}
      href="/contact"
      className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-medium text-canvas transition-colors duration-300 will-change-transform hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-lg"
    >
      Start a project
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-[1.1em] transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none ${SPRING}`}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </SiteLink>
  )
}

/* ---------- Services ---------- */

// What you get from one service: description, deliverables and a related project.
// Re-mounted (keyed) on every switch so its parts rise in again, one after another.
function Detail({ service }) {
  const example = work.find((w) => w.slug === service.work)
  const rise = 'motion-safe:animate-[row-in_0.6s_cubic-bezier(0.16,1,0.3,1)_backwards]'
  return (
    <div>
      <p className={`text-[clamp(1.15rem,1.6vw,1.5rem)] leading-snug font-medium tracking-tight ${rise}`}>{service.description}</p>
      <p className={`mt-8 font-mono text-xs tracking-wide text-muted uppercase ${rise}`} style={{ animationDelay: '80ms' }}>
        What you get
      </p>
      <ul className="mt-3 flex flex-col">
        {service.deliverables.map((item, i) => (
          <li key={item} className={`flex items-center gap-3 border-b border-line py-3 md:text-lg ${rise}`} style={{ animationDelay: `${140 + i * 70}ms` }}>
            <span aria-hidden="true" className="h-px w-4 shrink-0 bg-accent" />
            {item}
          </li>
        ))}
      </ul>
      <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 ${rise}`} style={{ animationDelay: '380ms' }}>
        <SiteLink href={`/services/${service.slug}`} className="group/more inline-flex items-center gap-1.5 font-medium text-ink hover:text-accent">
          Explore this service
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/more:translate-x-1">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </SiteLink>
        {example && (
          <SiteLink href={`/work/${example.slug}`} className="group/ex inline-flex items-center gap-1.5 font-medium text-accent">
            See it in {example.name}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/ex:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </SiteLink>
        )}
      </div>
    </div>
  )
}

// Split view: the service names stack on the left like a menu, and hovering or clicking one
// swaps the panel on the right. The active name is ink with a blue bar sliding in; the rest are
// faded. On phones the details open inline under the chosen name instead.
function ServiceExplorer() {
  const [active, setActive] = useState(0)
  const current = services[active]

  return (
    <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-16">
      <ol className="border-t border-line">
        {services.map((service, i) => {
          const on = i === active
          return (
            <li key={service.title} className="border-b border-line">
              <button
                type="button"
                aria-expanded={on}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group relative flex w-full cursor-pointer items-baseline gap-5 py-6 text-left outline-none md:py-8"
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0 left-0 h-0.5 bg-accent transition-[width] duration-500 motion-reduce:transition-none ${EASE} ${on ? 'w-full' : 'w-0'}`}
                />
                <span className={`font-mono text-sm transition-colors duration-300 ${on ? 'text-accent' : 'text-muted'}`}>{pad(i + 1)}</span>
                <span
                  className={`text-[clamp(1.85rem,4vw,3.5rem)] leading-[1.05] font-semibold tracking-tight transition-[color,translate] duration-500 motion-reduce:transition-none ${EASE} ${on ? 'translate-x-2 text-ink' : 'text-ink/30 group-hover:text-ink/60'}`}
                >
                  {service.title}
                </span>
              </button>
              {/* phones: details inline under the active name */}
              {on && (
                <div className="pb-8 md:hidden">
                  <Detail key={service.title} service={service} />
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="hidden md:block">
        <div className="sticky top-28 rounded-[1.75rem] border border-line bg-paper p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between font-mono text-xs text-muted">
            <span>
              {pad(active + 1)} / {pad(services.length)}
            </span>
            <span aria-hidden="true" className="flex gap-1.5">
              {services.map((s, i) => (
                <span key={s.title} className={`h-1.5 rounded-full transition-[width,background-color] duration-500 ${EASE} ${i === active ? 'w-6 bg-accent' : 'w-1.5 bg-line'}`} />
              ))}
            </span>
          </div>
          <Detail key={current.title} service={current} />
        </div>
      </div>
    </div>
  )
}

/* ---------- How it works ---------- */

// Steps in columns, joined left to right: each starts with a numbered circle, and an arrow
// draws across to the next step when the row scrolls into view. On hover a step's circle fills
// blue. On phones the steps stack, joined by short downward arrows.
function Process() {
  const [ref, shown] = useInView({ threshold: 0.3 })
  const step = 180 // ms between steps

  return (
    <ol ref={ref} className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-4 lg:gap-0">
      {process.map((s, i) => {
        const last = i === process.length - 1
        return (
          <li key={s.title} className="group relative lg:pr-10">
            <div className="flex items-center">
              <span
                className={`relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-ink font-mono text-sm transition-[scale,background-color,border-color,color] duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-canvas motion-reduce:transition-none ${SPRING} ${shown ? 'scale-100' : 'scale-0'}`}
                style={{ transitionDelay: shown ? `${i * step}ms, 0ms, 0ms, 0ms` : '0ms' }}
              >
                {pad(i + 1)}
              </span>
              {!last && (
                <span aria-hidden="true" className="relative mx-3 hidden h-px flex-1 lg:block">
                  <span
                    className={`absolute inset-0 origin-left bg-line transition-transform duration-700 motion-reduce:transition-none ${EASE} ${shown ? 'scale-x-100' : 'scale-x-0'}`}
                    style={{ transitionDelay: shown ? `${i * step + 150}ms` : '0ms' }}
                  />
                  <svg
                    viewBox="0 0 10 10"
                    className={`absolute -top-[4.5px] -right-1 size-2.5 text-ink/40 transition-opacity duration-300 ${shown ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: shown ? `${i * step + 700}ms` : '0ms' }}
                  >
                    <path d="M1 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
            <div
              className={`mt-6 transition-[opacity,translate] duration-700 motion-reduce:transition-none ${EASE} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: shown ? `${i * step + 120}ms` : '0ms' }}
            >
              <h3 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-tight font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-3 max-w-[24em] text-muted md:text-lg">{s.text}</p>
            </div>
            {/* phones and tablets: a short arrow down to the next step */}
            {!last && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-6 ml-3 size-5 text-ink/30 lg:hidden">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            )}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- FAQ ---------- */

// Large question that opens smoothly to show its answer; the plus turns into a cross
function Question({ item, open, onToggle }) {
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left outline-none focus-visible:text-accent md:py-7"
        >
          <span className={`text-[clamp(1.3rem,2.2vw,1.85rem)] leading-snug font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent ${open ? 'text-accent' : ''}`}>
            {item.q}
          </span>
          <span
            aria-hidden="true"
            className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[rotate,background-color,border-color,color] duration-500 motion-reduce:transition-none ${SPRING} ${open ? 'rotate-45 border-accent bg-accent text-canvas' : 'border-line text-ink group-hover:border-ink'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-4">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </h3>
      <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-500 motion-reduce:transition-none ${EASE} ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <p className={`max-w-[46em] pb-7 text-muted transition-opacity duration-500 md:text-lg ${open ? 'opacity-100' : 'opacity-0'}`}>{item.a}</p>
        </div>
      </div>
    </li>
  )
}

// Two columns: a pinned prompt with a direct email link on the left, the questions on the right
function Faq() {
  const [open, setOpen] = useState(-1)
  return (
    <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16">
      <div className="self-start md:sticky md:top-28">
        <p className="text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.15] font-semibold tracking-tight">Still have questions?</p>
        <p className="mt-4 max-w-[22em] text-muted md:text-lg">If yours isn’t here, write to me directly. I usually reply within a day.</p>
        <a href={`mailto:${profile.email}`} className="group mt-6 inline-flex items-center gap-2 font-medium text-accent md:text-lg">
          {profile.email}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 transition-[rotate] duration-500 group-hover:-rotate-45 ${SPRING}`}>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
      <ul className="border-t border-line">
        {faq.map((item, i) => (
          <Question key={item.q} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </ul>
    </div>
  )
}

/* ---------- Page ---------- */

function Services() {
  useEffect(() => {
    document.title = 'Services · Sushil Yadav'
  }, [])

  return (
    <main id="top" className="pb-24 md:pb-32">
      <PageHead label="Services" tagline={tagline.text} accent={tagline.accent}>
        <p className="mt-10 max-w-[38em] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-muted md:mt-14">{intro}</p>
        <div className="mt-8 md:mt-10">
          <StartButton />
        </div>
      </PageHead>

      <section aria-labelledby="services-list" className="mt-20 px-6 md:mt-28 md:px-12">
        <Label id="services-list">
          Services
        </Label>
        <ServiceExplorer />
      </section>

      <section aria-labelledby="services-process" className="mt-24 px-6 md:mt-32 md:px-12">
        <Label id="services-process">
          How it works
        </Label>
        <Process />
      </section>

      <section aria-labelledby="services-faq" className="mt-24 px-6 md:mt-32 md:px-12">
        <Label id="services-faq">
          FAQ
        </Label>
        <Faq />
      </section>
    </main>
  )
}

export default Services
