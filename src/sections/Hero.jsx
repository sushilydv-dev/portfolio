import BoltIcon from '@/components/ui/BoltIcon'
import SiteLink from '@/components/ui/SiteLink'
import { profile } from '@/data/profile'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const LETTER_DELAY = 45 // ms between each letter of the name; small, so the letters flow in as one wave

// Scroll parallax, driven by --sy (pixels scrolled) and --p (screens scrolled) from
// useScrollProgress. The text moves up FASTER than the page, so it runs ahead of the scroll and
// leaves through the top of the screen whole; it never meets the hero's bottom edge.
const NAME_SPEED = 0.21 // the name travels 21% faster than the page
const META_SPEED = 0.165 // role + availability: 16.5% faster...
const META_FADE = 2 // ...and fully faded after half a screen of scrolling
const faster = (speed) => `translate3d(0, calc(var(--sy, 0) * ${-speed}px), 0)`

// One line of the name; its letters rise in one after another on load.
function AnimatedWord({ word, offset = 0 }) {
  return (
    <span className="block whitespace-nowrap" aria-hidden="true">
      {[...word].map((letter, i) => (
        <span
          key={i}
          className="inline-block motion-safe:animate-rise"
          style={{ animationDelay: `${(offset + i) * LETTER_DELAY}ms` }}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}

function Hero() {
  const { firstName, lastName } = profile
  const nameDone = (firstName.length + lastName.length) * LETTER_DELAY + 300
  const scrollRef = useScrollProgress()

  return (
    <section id="top" ref={scrollRef} className="flex min-h-[calc(100svh-4rem)] overflow-clip bg-canvas text-ink">
      <div className="flex w-full flex-1 flex-col justify-between gap-10 px-6 pt-6 pb-8 md:gap-12 md:px-12 md:pb-10">
        {/* Role + availability: top right on larger screens, top left on phones */}
        <div
          className="self-start will-change-transform md:self-end"
          style={{ transform: faster(META_SPEED), opacity: `calc(1 - var(--p, 0) * ${META_FADE})` }}
        >
          <div
            className="text-left text-base font-medium md:text-right md:text-xl motion-safe:animate-slide-in"
            style={{ animationDelay: `${nameDone}ms` }}
          >
            <p>{profile.role}</p>
            {profile.available && (
              <p className="mt-2 inline-flex items-center gap-2.5 md:mt-3">
                <BoltIcon className="size-[1em] shrink-0" />
                Available for freelance projects
              </p>
            )}
          </div>
        </div>

        {/* Bottom: giant name on the left, scroll cue on the right */}
        <div className="flex items-end justify-between gap-6">
          <h1 style={{ transform: faster(NAME_SPEED) }} className="will-change-transform font-display text-[clamp(4.5rem,min(30vw,34svh),26rem)] md:text-[clamp(4.5rem,min(22vw,40svh),26rem)] leading-[0.85] font-normal">
            <span className="sr-only">{profile.name}</span>
            <AnimatedWord word={firstName} />
            <AnimatedWord word={lastName} offset={firstName.length} />
          </h1>

          <div className="hidden shrink-0 md:block">
            <a
              href="#about"
              className="flex items-end gap-3 text-sm font-medium motion-safe:animate-slide-in"
              style={{ animationDelay: `${nameDone + 200}ms` }}
            >
              Scroll
              <span className="relative h-14 w-px overflow-hidden bg-line">
                <span className="absolute inset-0 bg-accent motion-safe:animate-scroll-line" />
              </span>
            </a>
          </div>
        </div>

        {/* Phones only: what I do and where to go next, so the hero isn't left empty */}
        <div
          className="will-change-transform md:hidden"
          style={{ transform: faster(META_SPEED), opacity: `calc(1 - var(--p, 0) * ${META_FADE})` }}
        >
          <div className="motion-safe:animate-slide-in" style={{ animationDelay: `${nameDone + 120}ms` }}>
            <p className="max-w-[22em] text-lg leading-snug text-muted">{profile.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <SiteLink
                href="/work"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-medium text-canvas transition-colors duration-300 hover:bg-accent"
              >
                See my work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </SiteLink>
              <SiteLink href="/contact" className="inline-flex items-center rounded-full border border-line px-5 py-3 font-medium transition-colors duration-300 hover:border-ink">
                Let’s talk
              </SiteLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
