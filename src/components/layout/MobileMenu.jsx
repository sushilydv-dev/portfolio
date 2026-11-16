import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import SiteLink from '@/components/ui/SiteLink'
import { navLinks } from '@/data/navigation'
import { profile } from '@/data/profile'
import { usePath } from '@/hooks/usePath'

// Phones and small tablets: a hamburger whose two lines fold into a cross. The menu opens as a
// circle growing out of the button (like the theme switch), in the page's own theme colours. Its
// links are big display-font words that slide up one after another, numbered, with the current
// page in blue, and the email sits underneath.

const EASE = 'ease-[cubic-bezier(0.76,0,0.24,1)]'
const OUT = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const pad = (n) => String(n).padStart(2, '0')

// Two lines that fold into a cross
function Burger({ open }) {
  const line = `absolute left-1/2 h-[1.5px] w-5 -translate-x-1/2 rounded-full bg-current transition-[rotate,translate,top] duration-500 ${EASE}`
  return (
    <span aria-hidden="true" className="relative block size-6">
      <span className={`${line} ${open ? 'top-1/2 rotate-45' : 'top-[9px]'}`} />
      <span className={`${line} ${open ? 'top-1/2 -rotate-45' : 'top-[15px]'}`} />
    </span>
  )
}

function MobileMenu() {
  const path = usePath()
  // the page the menu was opened on: it counts as open only there, so navigating closes it
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === path
  const setOpen = (v) => setOpenOn(v ? path : null)
  const [origin, setOrigin] = useState('100% 0%')
  const btnRef = useRef(null)
  const closeRef = useRef(null)

  const toggle = () => {
    const r = btnRef.current?.getBoundingClientRect()
    if (r) setOrigin(`${r.left + r.width / 2}px ${r.top + r.height / 2}px`)
    setOpen(!open)
  }
  const close = () => setOpen(false)

  // While open: freeze the page, Escape closes, focus moves into the menu (and back after)
  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    window.__lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpenOn(null)
    addEventListener('keydown', onKey)
    const t = setTimeout(() => closeRef.current?.focus(), 50)
    const btn = btnRef.current
    return () => {
      html.style.overflow = prev
      window.__lenis?.start()
      removeEventListener('keydown', onKey)
      clearTimeout(t)
      btn?.focus({ preventScroll: true })
    }
  }, [open])


  const isCurrent = (href) => path === href || path.startsWith(href + '/')

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="grid size-10 cursor-pointer place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink md:hidden"
      >
        <Burger open={false} />
      </button>

      {createPortal(
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          inert={!open}
          data-lenis-prevent
          className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-canvas text-ink transition-[clip-path] duration-700 md:hidden print:hidden motion-reduce:transition-none ${EASE} ${open ? '' : 'pointer-events-none'}`}
          style={{ clipPath: open ? `circle(150% at ${origin})` : `circle(0% at ${origin})` }}
        >
          {/* Top row: same place as the navbar, so the cross sits where the hamburger was */}
          <div className="flex h-16 shrink-0 items-center justify-between px-6">
            <SiteLink href="/" onClick={close} className="font-display text-2xl leading-none">
              {profile.name}
            </SiteLink>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-10 cursor-pointer place-items-center rounded-full border border-line transition-colors outline-none hover:border-ink focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Burger open={open} />
            </button>
          </div>

          {/* Big numbered links */}
          <nav aria-label="Main" className="flex flex-1 flex-col justify-center px-6 py-8">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const current = isCurrent(link.href)
                return (
                  <li key={link.href} className="overflow-hidden border-b border-line pb-1">
                    <SiteLink
                      href={link.href}
                      onClick={close}
                      aria-current={current ? 'page' : undefined}
                      className={`group flex items-baseline gap-4 py-2 transition-[translate,opacity] duration-700 motion-reduce:transition-none ${OUT} ${open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
                      style={{ transitionDelay: open ? `${180 + i * 70}ms` : '0ms' }}
                    >
                      <span className={`font-mono text-xs ${current ? 'text-accent' : 'text-muted'}`}>{pad(i + 1)}</span>
                      <span className={`font-display text-[clamp(3rem,15vw,4.5rem)] leading-[0.95] transition-[color,translate] duration-300 group-hover:translate-x-2 group-active:translate-x-2 ${current ? 'text-accent' : 'group-hover:text-accent'}`}>
                        {link.label}
                      </span>
                      {current && <span aria-hidden="true" className="size-2 self-center rounded-full bg-accent" />}
                    </SiteLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer of the menu */}
          <div
            className={`shrink-0 px-6 pb-8 transition-[opacity,translate] duration-700 motion-reduce:transition-none ${OUT} ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: open ? '500ms' : '0ms' }}
          >
            <a href={`mailto:${profile.email}`} className="block truncate font-medium text-ink transition-colors hover:text-accent">
              {profile.email}
            </a>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

export default MobileMenu
