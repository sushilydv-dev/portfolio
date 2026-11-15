import { Fragment, useEffect, useState } from 'react'
import { foxAllowed, foxHidden, setFoxHidden } from '@/components/mascot/foxSettings'
import ArrowLink from '@/components/ui/ArrowLink'
import SiteLink from '@/components/ui/SiteLink'
import { navLinks, pageLinks } from '@/data/navigation'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { useInView } from '@/hooks/useInView'
import { sectionHref, usePath } from '@/hooks/usePath'

const EASE = 'ease-[cubic-bezier(0.65,0,0.35,1)]'
const WORD_DELAY = 90 // ms between the words of the closing line as they rise in
const LETTER_STAGGER = 18 // ms between letters as the email rolls over to blue

// The closing line, split into words that rise in one after another (the hero's entrance)
// once the footer scrolls into view.
const LINES = [['Bring', 'the', 'idea.'], ['I’ll', 'bring', 'the', 'code']]

function ClosingLine() {
  const [ref, shown] = useInView({ threshold: 0.4 })
  let index = 0

  return (
    <h2 ref={ref} aria-label="Bring the idea. I’ll bring the code." className="font-display text-[clamp(3rem,9.4vw,16rem)] leading-[0.92] font-normal text-ink">
      {LINES.map((words, line) => (
        <span key={line} className="block">
          {words.map((word, i) => {
            const delay = index++ * WORD_DELAY
            const last = line === LINES.length - 1 && i === words.length - 1
            return (
              <Fragment key={word + i}>
                {i > 0 && ' '}
                <span
                  className={`inline-block ${shown ? 'motion-safe:animate-rise' : 'opacity-0 motion-reduce:opacity-100'}`}
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {word}
                  {last && <span className="text-accent">.</span>}
                </span>
              </Fragment>
            )
          })}
        </span>
      ))}
    </h2>
  )
}

// The email, big, its letters rolling up to a blue copy on hover (like the Selected work names).
function RollingText({ text }) {
  return (
    <span className="block overflow-hidden leading-[1.2]">
      {[...text].map((letter, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${i * LETTER_STAGGER}ms` }}
          className={`inline-block [text-shadow:0_1.2em_0_var(--color-accent)] transition-transform duration-500 ${EASE} group-hover:-translate-y-[1.2em] group-focus-visible:-translate-y-[1.2em] motion-reduce:transition-none`}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

function CopyButton() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-muted transition-colors duration-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:text-base"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
        {copied ? (
          <path d="m5 12.5 4.5 4.5L19 7.5" className="text-accent" />
        ) : (
          <>
            <rect x="8.5" y="8.5" width="11" height="11" rx="2.5" />
            <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  )
}

// Email row: a full-width line between two rules, laid out like a Selected work row.
function EmailRow() {
  return (
    <div className="flex flex-col gap-4 border-y border-line py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:py-8">
      <a
        href={`mailto:${profile.email}`}
        aria-label={`Email ${profile.email}`}
        className="group relative flex min-w-0 items-center gap-4 outline-none after:absolute after:inset-x-0 after:-bottom-6 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-700 after:ease-[cubic-bezier(0.65,0,0.35,1)] hover:after:scale-x-100 focus-visible:after:scale-x-100 md:after:-bottom-8"
      >
        <span className="min-w-0 text-[clamp(1.6rem,4.4vw,4rem)] font-semibold tracking-tight break-all text-ink">
          <RollingText text={profile.email} />
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`size-[clamp(1.5rem,3vw,2.5rem)] shrink-0 text-muted transition-[rotate,color] duration-500 ${EASE} group-hover:-rotate-45 group-hover:text-accent group-focus-visible:-rotate-45 group-focus-visible:text-accent motion-reduce:transition-none`}
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </a>
      <CopyButton />
    </div>
  )
}

// Live local time, e.g. 13:32 IST, with the colon ticking.
function LocalTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])

  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: profile.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).formatToParts(now)
  const get = (type) => parts.find((p) => p.type === type)?.value ?? ''

  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {get('hour')}
      <span className="motion-safe:animate-blink">:</span>
      {get('minute')} <span className="text-muted">{get('timeZoneName')}</span>
    </time>
  )
}

// Small footer link. On hover the word slides up and out while a blue copy of it slides in from
// below (the copy is a text-shadow, so the text isn't duplicated when selected or copied).
// `muted` starts it grey, for the secondary links.
function SwapLink({ href, children, external = false, muted = false, className = '' }) {
  return (
    <SiteLink
      href={href}
      {...(external && { target: '_blank', rel: 'me noreferrer' })}
      className={`group/link inline-flex items-center gap-1 font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${muted ? 'text-muted' : 'text-ink'} ${className}`}
    >
      <span className="block overflow-hidden leading-[1.3]">
        <span
          className={`block [text-shadow:0_1.3em_0_var(--color-accent)] transition-transform duration-500 ${EASE} group-hover/link:-translate-y-[1.3em] group-focus-visible/link:-translate-y-[1.3em] motion-reduce:transition-none`}
        >
          {children}
        </span>
      </span>
      {external && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-[0.8em] text-muted transition-[rotate,color] duration-500 ${EASE} group-hover/link:rotate-45 group-hover/link:text-accent group-focus-visible/link:rotate-45 motion-reduce:transition-none`}>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      )}
    </SiteLink>
  )
}

// Links that fade up one after another when the footer comes into view
function LinkGroup({ links, shown, start = 0, label, className = '', ...linkProps }) {
  return (
    <nav aria-label={label}>
      <ul className={`flex flex-wrap gap-x-7 gap-y-2 ${className}`}>
        {links.map((link, i) => (
          <li
            key={link.label}
            className={`transition-[opacity,translate] duration-700 ${EASE} motion-reduce:transition-none ${shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'}`}
            style={{ transitionDelay: `${(start + i) * 60}ms` }}
          >
            <SwapLink href={link.href} {...linkProps}>
              {link.label}
            </SwapLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Turns the fox on or off (remembered for next visit). Hidden when the fox can't run here.
function FoxSwitch() {
  const [hidden, setHidden] = useState(foxHidden)
  const [allowed] = useState(foxAllowed)
  if (!allowed) return null
  const toggle = () => {
    setFoxHidden(!hidden)
    setHidden(!hidden)
  }
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!hidden}
      className="cursor-pointer text-muted transition-colors duration-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent print:hidden"
    >
      {hidden ? 'Show fox' : 'Hide fox'}
    </button>
  )
}

function Footer() {
  const path = usePath()
  const sections = navLinks.map((link) => ({ ...link, href: sectionHref(link.href, path) }))
  const [indexRef, indexShown] = useInView({ threshold: 0.5 })

  return (
    // Fills the whole screen: the closing line at the top, the email and links pinned to the bottom
    <footer
      id="contact"
      className="flex min-h-svh flex-col print:hidden justify-between gap-16 border-t border-line bg-canvas px-6 pt-24 pb-10 text-ink md:px-12 md:pt-28"
    >
      <div>
        <p className="text-lg font-medium text-accent md:text-2xl">What’s next?</p>
        <div className="mt-8 md:mt-12">
          <ClosingLine />
        </div>
      </div>

      <div>
        <EmailRow />

        {/* Index: sections on the left, pages on the right */}
        <div ref={indexRef} className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 text-base md:mt-12 md:text-lg">
          <LinkGroup label="Sections" links={sections} shown={indexShown} />
          <LinkGroup label="Pages" links={pageLinks} shown={indexShown} start={sections.length} muted />
        </div>

        {/* Base: profiles, local time, Back to top */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-5 text-sm md:text-[0.95rem]">
          <LinkGroup label="Elsewhere" links={socials} shown={indexShown} start={sections.length + pageLinks.length} external className="gap-x-6" />
          <p className="text-muted">
            Local time{' '}
            <span className="font-medium text-ink">
              <LocalTime />
            </span>
          </p>
          <span className="flex items-center gap-6">
            <FoxSwitch />
            <ArrowLink href="#top" direction="up">
              Back to top
            </ArrowLink>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
