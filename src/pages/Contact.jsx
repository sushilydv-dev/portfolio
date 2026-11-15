import { useEffect, useId, useState } from 'react'
import PageHead from '@/components/ui/PageHead'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { useMagnetic } from '@/hooks/useMagnetic'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'

const TOPICS = ['Freelance project', 'Full-time role', 'Collaboration', 'Just saying hi']

/* ---------- Form ---------- */

// Text field with its label above and an underline that fills blue from the left on focus
function Field({ label, as = 'input', ...props }) {
  const id = useId()
  const Tag = as
  return (
    <div className="group relative">
      <label htmlFor={id} className="block text-sm font-medium text-muted transition-colors duration-300 group-focus-within:text-accent">
        {label}
      </label>
      <Tag
        id={id}
        {...props}
        className={`mt-2 block w-full resize-none border-0 border-b border-line bg-transparent pb-3 text-lg text-ink outline-none placeholder:text-muted/50 md:text-xl ${as === 'textarea' ? 'min-h-36' : ''}`}
      />
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-focus-within:scale-x-100 motion-reduce:transition-none ${EASE}`}
      />
    </div>
  )
}

// "What's this about?" as pill choices; the picked one fills with ink
function Topics({ value, onChange }) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-muted">What’s this about?</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {TOPICS.map((topic) => {
          const on = topic === value
          return (
            <label
              key={topic}
              className={`cursor-pointer rounded-full border px-4 py-2 font-medium transition-[background-color,border-color,color,scale] duration-300 select-none has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent active:scale-95 ${on ? 'border-ink bg-ink text-canvas' : 'border-line text-ink hover:border-ink'}`}
            >
              <input type="radio" name="topic" value={topic} checked={on} onChange={() => onChange(topic)} className="sr-only" />
              {topic}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function SendButton({ sending }) {
  const ref = useMagnetic({ radius: 60, strength: 0.2, maxOffset: 10, stretch: 0.05 })
  return (
    <button
      ref={ref}
      type="submit"
      disabled={sending}
      className="group inline-flex cursor-pointer items-center disabled:cursor-wait disabled:opacity-70 gap-2.5 rounded-full bg-ink px-7 py-4 font-medium text-canvas transition-colors duration-300 will-change-transform hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-lg"
    >
      {sending ? 'Sending…' : 'Send message'}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-[1.1em] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:-rotate-12 motion-reduce:transition-none ${SPRING} ${sending ? 'translate-x-2 -translate-y-2 opacity-0 duration-700' : ''}`}>
        <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
      </svg>
    </button>
  )
}

// Messages are delivered by Web3Forms (a free form-to-email service). The access key is public by
// design (it only lets the form send to your inbox), so it's set here; VITE_WEB3FORMS_KEY in
// .env.local overrides it. Without a key, sending opens the visitor's email app instead.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || 'cd9e2330-81c1-43a3-ba76-f263975302cb'

const mailtoFor = ({ name, email, topic, message }) =>
  `mailto:${profile.email}?subject=${encodeURIComponent(`${topic} · ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`

function ContactForm() {
  const [topic, setTopic] = useState(TOPICS[0])
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [fallback, setFallback] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const fields = {
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      message: data.get('message').trim(),
      topic,
    }

    if (!WEB3FORMS_KEY) {
      window.location.href = mailtoFor(fields)
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio · ${fields.topic} · ${fields.name}`,
          from_name: 'Portfolio contact form',
          name: fields.name,
          email: fields.email,
          topic: fields.topic,
          message: fields.message,
          botcheck: data.get('botcheck') ? true : '',
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      form.reset()
      setTopic(TOPICS[0])
      setStatus('sent')
      window.dispatchEvent(new Event('fox:celebrate'))
    } catch {
      setFallback(mailtoFor(fields))
      setStatus('error')
    }
  }

  const sending = status === 'sending'

  if (status === 'sent' && WEB3FORMS_KEY) {
    return (
      <div className="flex flex-col items-start gap-6 rounded-[1.75rem] border border-line bg-paper p-8 motion-safe:animate-[row-in_0.7s_cubic-bezier(0.16,1,0.3,1)_backwards] md:p-12">
        <span className="grid size-14 place-items-center rounded-full bg-accent text-canvas">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-7">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <div role="status">
          <p className="text-[clamp(1.6rem,2.8vw,2.4rem)] leading-tight font-semibold tracking-tight">Message sent. Thank you!</p>
          <p className="mt-3 max-w-[30em] text-muted md:text-lg">It’s in my inbox now. I’ll get back to you at the email you gave.</p>
        </div>
        <button type="button" onClick={() => setStatus('idle')} className="cursor-pointer font-medium text-accent hover:underline">
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      {/* spam trap: hidden from people, filled in by bots */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <div className="grid gap-10 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required placeholder="Jane Doe" />
        <Field label="Email" name="email" type="email" autoComplete="email" required placeholder="jane@company.com" />
      </div>
      <Topics value={topic} onChange={setTopic} />
      <Field label="Message" as="textarea" name="message" rows={5} required placeholder="Tell me what you’re building, your timeline and anything else that helps." />
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <SendButton sending={sending} />
        <p aria-live="polite" className={`text-sm ${status === 'error' ? 'text-accent' : 'text-muted'}`}>
          {status === 'error' ? (
            <>
              That didn’t go through.{' '}
              <a href={fallback} className="font-medium underline">
                Send it by email instead
              </a>
            </>
          ) : WEB3FORMS_KEY ? (
            'Goes straight to my inbox.'
          ) : status === 'sent' ? (
            'Your email app should open with the message ready to send.'
          ) : (
            'Opens your email app with everything filled in.'
          )}
        </p>
      </div>
    </form>
  )
}

/* ---------- Side ---------- */

function LocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])
  const parts = new Intl.DateTimeFormat('en-IN', { timeZone: profile.timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short' }).formatToParts(now)
  const get = (type) => parts.find((p) => p.type === type)?.value ?? ''
  return (
    <span className="tabular-nums">
      {get('hour')}
      <span className="motion-safe:animate-blink">:</span>
      {get('minute')} {get('timeZoneName')}
    </span>
  )
}

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(profile.email).then(() => setCopied(true))}
      className="cursor-pointer text-sm font-medium text-muted transition-colors hover:text-ink"
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

// A row in the side column: label on the left, link on the right; the arrow tips on hover
function DirectLink({ href, children }) {
  return (
    <a
      href={href}
      {...(href.startsWith('http') && { target: '_blank', rel: 'me noreferrer' })}
      className="group flex items-center justify-between gap-4 border-b border-line py-4 text-lg font-medium transition-colors duration-300 hover:text-accent"
    >
      {children}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 text-muted transition-[rotate,color] duration-500 group-hover:rotate-45 group-hover:text-accent ${SPRING}`}>
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  )
}

function Side() {
  return (
    <aside className="flex flex-col gap-10 md:sticky md:top-28 md:self-start">
      <div>
        <h2 className="text-sm font-medium text-muted">Email me directly</h2>
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <a href={`mailto:${profile.email}`} className="text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold tracking-tight break-all transition-colors hover:text-accent">
            {profile.email}
          </a>
          <CopyEmail />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-muted">Elsewhere</h2>
        <div className="mt-1 border-t border-line">
          {socials.map((social) => (
            <DirectLink key={social.label} href={social.href}>
              {social.label}
            </DirectLink>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-medium text-muted">Based in</h2>
          <p className="mt-2 font-medium">Chandigarh, India</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-muted">Local time</h2>
          <p className="mt-2 font-medium">
            <LocalTime />
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-accent-soft p-6">
        <h2 className="text-sm font-semibold text-accent">Response time</h2>
        <p className="mt-2 text-ink/80">
          I read every message and usually reply within a day or two. For projects, a line on scope and timeline helps me answer faster.
        </p>
      </div>
    </aside>
  )
}

/* ---------- Page ---------- */

function Contact() {
  useEffect(() => {
    document.title = 'Contact · Sushil Yadav'
  }, [])

  return (
    <main id="top" className="pb-24 md:pb-32">
      <PageHead label="Contact" tagline="Let’s make it real." accent={['real.']}>
        <p className="mt-10 max-w-[38em] text-[clamp(1.05rem,1.3vw,1.3rem)] leading-relaxed text-muted md:mt-14">
          Freelance projects, full-time roles or just a hello. Tell me what you’re building and I’ll get back to you.
        </p>
      </PageHead>

      <section aria-label="Send a message" className="mt-16 grid gap-16 px-6 md:mt-24 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-20 md:px-12">
        <ContactForm />
        <Side />
      </section>
    </main>
  )
}

export default Contact
