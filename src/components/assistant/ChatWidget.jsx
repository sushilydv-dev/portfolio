import { useEffect, useRef, useState } from 'react'
import SiteLink from '@/components/ui/SiteLink'
import WaveTitle from '@/components/ui/WaveTitle'
import { usePath } from '@/hooks/usePath'
import { profile } from '@/data/profile'
import { services } from '@/data/services'
import { work } from '@/data/work'

// "Ask Sushil": a frosted search bar floating at the bottom of the screen, with a soft moving glow,
// and the answers in a card above it: numbered questions with a blue rule (like the Resume),
// answers that ink in word by word (like the About lead) and link rows with the Work list's wave.
// Questions go to /api/chat, where a tiny matching model picks one of the answers Sushil wrote
// (assistant/knowledge.js); on static hosts the same model runs in the browser instead.

const PROMPTS = ['Ask me anything about Sushil', 'What does Sushil build?', 'Is he free for a project?', 'Tell me about NeuroVault', 'What’s his tech stack?']
const OFFLINE = { text: `I can’t answer right now. You can reach Sushil directly at ${profile.email}.`, links: [{ label: 'Contact', href: '/contact' }] }
const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'
const pad = (n) => String(n).padStart(2, '0')

const STARTERS = ['What has Sushil built?', 'What’s his tech stack?', 'Is he available for freelance?']

// A one-line note under each link card, taken from the site's own pages
const NOTES = {
  '/contact': 'Send a message. Replies usually within a day.',
  '/resume': 'Experience, education and a downloadable PDF.',
  '/about': 'Background, path and toolkit.',
  '/work': 'Every project, personal and client.',
  '/services': 'What he offers and how projects run.',
  ...Object.fromEntries(work.map((w) => [`/work/${w.slug}`, w.pitch?.text ?? w.category])),
  ...Object.fromEntries(services.map((s) => [`/services/${s.slug}`, s.description])),
}
const noteFor = (href) => NOTES[href] ?? (href.startsWith('mailto:') ? href.slice(7) : href.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])

// Set once /api/chat turns out not to exist (static hosts like GitHub Pages): from then on the
// assistant runs in the browser and the server isn't asked again.
let serverless = false

async function askLocally(question) {
  try {
    const { localReply } = await import('./localAssistant.js')
    const data = await localReply(question)
    return { text: data.answer, links: data.links ?? [] }
  } catch {
    return OFFLINE
  }
}

async function ask(question) {
  const started = performance.now()
  let reply = OFFLINE
  if (serverless) reply = await askLocally(question)
  else {
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
      if (res.ok) {
        const data = await res.json()
        reply = { text: data.answer, links: data.links ?? [] }
      } else if (res.status === 429) {
        reply = { text: 'That’s a lot of questions! Give me a minute and try again.', links: [] }
      } else if (res.status === 404 || res.status === 405) {
        serverless = true
        reply = await askLocally(question)
      }
    } catch {
      // Network error: try the in-browser assistant (falls back to OFFLINE if that fails too)
      reply = await askLocally(question)
    }
  }
  const wait = 520 - (performance.now() - started)
  if (wait > 0) await new Promise((r) => setTimeout(r, wait))
  return reply
}

/* ---------- Small parts ---------- */

// A keyboard key, like the About page toolkit
function Key({ children, className = '' }) {
  return (
    <kbd className={`inline-grid h-6 min-w-6 place-items-center rounded-md border border-current/25 border-b-2 px-1.5 font-mono text-[0.7rem] leading-none ${className}`}>
      {children}
    </kbd>
  )
}

const Icon = ({ d, className = 'size-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d={d} />
  </svg>
)

// The placeholder rolls through example questions, each sliding up into place
function RollingPlaceholder({ hidden }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (hidden) return
    const t = setInterval(() => setI((n) => (n + 1) % PROMPTS.length), 3000)
    return () => clearInterval(t)
  }, [hidden])
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 flex items-center overflow-hidden text-muted transition-opacity duration-200 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      <span key={i} className="truncate motion-safe:animate-[rise_0.6s_cubic-bezier(0.16,1,0.3,1)_both]">
        {PROMPTS[i]}
      </span>
    </span>
  )
}

/* ---------- Answers ---------- */

function LinkRow({ link, index }) {
  const internal = link.href.startsWith('/')
  const inner = (
    <>
      <span className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-accent">{pad(index + 1)}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">
          <span className="sr-only">{link.label}</span>
          <WaveTitle text={link.label} />
        </span>
        <span className="mt-0.5 block text-sm text-muted">{noteFor(link.href)}</span>
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 shrink-0 text-muted transition-[rotate,color] duration-500 group-hover:rotate-45 group-hover:text-accent ${SPRING}`}>
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </>
  )
  const cls = 'group flex items-center gap-4 border-b border-line py-3'
  return (
    <li>
      {internal ? (
        <SiteLink href={link.href} className={cls}>
          {inner}
        </SiteLink>
      ) : (
        <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" className={cls}>
          {inner}
        </a>
      )}
    </li>
  )
}

// The answer inks in word by word, from faint to full ink (like the About page's opening line)
function InkText({ text }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const f = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(f)
  }, [])
  return (
    <p className="mt-3 text-[1.02rem] leading-relaxed">
      {text.split(' ').map((w, k) => (
        <span key={k}>
          {k > 0 && ' '}
          <span className={`transition-colors duration-500 motion-reduce:transition-none ${on ? 'text-ink' : 'text-ink/15'}`} style={{ transitionDelay: `${Math.min(k * 28, 1100)}ms` }}>
            {w}
          </span>
        </span>
      ))}
    </p>
  )
}

// One numbered question and its answer; the blue rule draws across as it arrives
function Exchange({ item, index }) {
  const [drawn, setDrawn] = useState(false)
  useEffect(() => {
    const f = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(f)
  }, [])
  return (
    <article className="motion-safe:animate-[row-in_0.5s_cubic-bezier(0.16,1,0.3,1)_backwards]">
      <p className="flex items-center gap-3 font-mono text-xs text-muted">
        Q.{pad(index + 1)}
        <span aria-hidden="true" className={`h-px w-10 origin-left bg-accent transition-transform duration-1000 motion-reduce:transition-none ${EASE} ${drawn ? 'scale-x-100' : 'scale-x-0'}`} />
      </p>
      <h3 className="mt-2 text-[clamp(1.35rem,2.3vw,1.75rem)] leading-tight font-semibold tracking-tight">{item.q}</h3>
      {item.a ? (
        <>
          <InkText text={item.a.text} />
          {item.a.links.length > 0 && (
            <ul className="mt-4 border-t border-line">
              {item.a.links.map((link, k) => (
                <LinkRow key={link.href} link={link} index={k} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="mt-3 font-mono text-sm text-muted" aria-label="Finding an answer">
          looking it up<span className="motion-safe:animate-blink">…</span>
        </p>
      )}
    </article>
  )
}

/* ---------- Widget ---------- */

function ChatWidget() {
  const path = usePath()
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState('')
  const [log, setLog] = useState([])            // [{ q, a }]
  const [away, setAway] = useState(true)        // hidden over the home hero and the footer
  const rootRef = useRef(null)
  const inputRef = useRef(null)
  const logRef = useRef(null)
  const busy = log.some((x) => !x.a)
  const answered = log.filter((x) => x.a).length
  const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  const send = async (text) => {
    const q = text.trim().slice(0, 300)
    if (!q || busy) return
    setDraft('')
    setOpen(true)
    setLog((l) => [...l, { q, a: null }])
    const a = await ask(q)
    setLog((l) => l.map((x) => (x.q === q && !x.a ? { ...x, a } : x)))
  }

  // Hide the bar over the home page hero and once the footer is in view (unless it's in use)
  useEffect(() => {
    const footer = document.querySelector('footer')
    let footerIn = false
    const update = () => setAway((path === '/' && scrollY < innerHeight * 0.6) || footerIn)
    const io = footer && new IntersectionObserver(([e]) => { footerIn = e.isIntersecting; update() }, { threshold: 0.25 })
    if (footer) io.observe(footer)
    update()
    addEventListener('scroll', update, { passive: true })
    return () => { removeEventListener('scroll', update); io?.disconnect() }
  }, [path])

  // ⌘K / Ctrl+K focuses it; Escape closes the card
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAway(false)
        setOpen(true)
        inputRef.current?.focus()
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  // Clicking anywhere outside closes the card
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!rootRef.current?.contains(e.target)) setOpen(false) }
    addEventListener('pointerdown', onDown)
    return () => removeEventListener('pointerdown', onDown)
  }, [open])

  // Bring the newest question to the top of the card, so its answer reads from the start
  useEffect(() => {
    const el = logRef.current
    const last = el?.querySelector('article:last-of-type')
    if (el && last) el.scrollTo({ top: last.offsetTop - 16, behavior: 'smooth' })
  }, [log.length, answered, open])

  const hidden = away && !open && !focused
  const lit = focused || open

  return (
    <div
      ref={rootRef}
      className={`fixed inset-x-0 bottom-3 z-50 mx-auto w-[min(40rem,calc(100vw-1.5rem))] transition-[opacity,translate,filter] duration-500 md:bottom-6 motion-reduce:transition-none print:hidden ${EASE} ${hidden ? 'pointer-events-none translate-y-8 opacity-0 blur-sm' : 'translate-y-0 opacity-100 blur-0'}`}
    >
      {/* Answer card */}
      <section
        aria-label="Answers about Sushil"
        inert={!open}
        className={`absolute inset-x-0 bottom-full mb-3 flex max-h-[min(32rem,calc(100dvh-8rem))] origin-bottom flex-col overflow-hidden rounded-[1.75rem] border border-line bg-canvas shadow-[0_30px_70px_-30px_rgb(0_0_0/0.45)] transition-[opacity,translate,clip-path] duration-600 motion-reduce:transition-none ${EASE} ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        style={{ clipPath: open ? 'inset(0 0 0 0 round 1.75rem)' : 'inset(55% 0 0 0 round 1.75rem)' }}
      >
        <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-3.5 font-mono text-xs text-muted uppercase">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent motion-safe:animate-glow" />
            Ask Sushil
            <span className="text-ink/30">/</span>
            <span className="tabular-nums">{pad(log.length)} asked</span>
          </span>
          <button type="button" onClick={() => setOpen(false)} className="flex cursor-pointer items-center gap-2 uppercase transition-colors hover:text-ink">
            Close <Key>esc</Key>
          </button>
        </header>

        <div ref={logRef} data-lenis-prevent aria-live="polite" className="relative flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain px-6 py-6">
          {log.length === 0 && (
            <div>
              <p className="font-display text-[clamp(2.2rem,5vw,3.2rem)] leading-[0.95]">
                Ask me <span className="text-accent">anything.</span>
              </p>
              <p className="mt-3 text-muted">About his work, skills, services, or how to reach him.</p>
              <ol className="mt-5 border-t border-line">
                {STARTERS.map((s, k) => (
                  <li key={s}>
                    <button type="button" onClick={() => send(s)} className="group flex w-full cursor-pointer items-center gap-4 border-b border-line py-3 text-left">
                      <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">{pad(k + 1)}</span>
                      <span className="flex-1 font-medium">
                        <span className="sr-only">{s}</span>
                        <WaveTitle text={s} />
                      </span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 text-muted transition-[translate,color] duration-500 group-hover:translate-x-1 group-hover:text-accent ${SPRING}`}>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {log.map((item, k) => (
            <Exchange key={k} item={item} index={k} />
          ))}
        </div>

        <p className="border-t border-line px-6 py-3 font-mono text-[0.68rem] leading-relaxed text-muted">
          Hand-written answers, matched by a tiny model. No AI writes them; nothing you type is kept.
        </p>
      </section>

      {/* Search bar, with a soft moving glow around it */}
      <div className="relative">
        <span
          aria-hidden="true"
          className={`absolute -inset-[3px] rounded-[1.45rem] bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-soft),var(--color-accent))] bg-[length:200%_100%] blur-[6px] transition-opacity duration-500 motion-safe:animate-[glow-shift_4s_linear_infinite] ${lit ? 'opacity-70' : 'opacity-25'}`}
        />
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            send(draft)
          }}
          className="relative flex h-[3.75rem] items-center gap-3 rounded-[1.25rem] border border-line bg-paper/90 pr-2.5 pl-5 shadow-[0_12px_40px_-14px_rgb(0_0_0/0.35)] backdrop-blur-xl"
        >
          <div className="relative min-w-0 flex-1">
            <label htmlFor="ask-input" className="sr-only">
              Ask anything about Sushil
            </label>
            <input
              id="ask-input"
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => {
                setFocused(true)
                setOpen(true)
              }}
              onBlur={() => setFocused(false)}
              maxLength={300}
              autoComplete="off"
              spellCheck="false"
              enterKeyHint="send"
              placeholder={focused ? 'Type your question…' : ''}
              className="relative z-10 w-full bg-transparent py-2 text-[1.02rem] text-ink caret-accent outline-none placeholder:text-muted"
            />
            <RollingPlaceholder hidden={draft.length > 0 || focused} />
          </div>
          <span className="hidden shrink-0 rounded-md bg-canvas px-1.5 py-0.5 text-xs font-medium text-muted md:inline">{mac ? '⌘K' : 'Ctrl K'}</span>
          <button
            type="submit"
            aria-label="Ask"
            disabled={busy || !draft.trim()}
            className={`grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-accent text-canvas transition-[scale,opacity] duration-300 hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-40 disabled:hover:scale-100 ${SPRING}`}
          >
            {busy ? (
              <span className="size-4 rounded-full border-2 border-canvas/40 border-t-canvas motion-safe:animate-spin" />
            ) : (
              <Icon d="M12 19V5M5 12l7-7 7 7" className="size-[18px]" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWidget
