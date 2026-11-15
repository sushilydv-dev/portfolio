import BoltIcon from '@/components/ui/BoltIcon'
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
      <div className="flex w-full flex-1 flex-col justify-between gap-12 px-6 pt-6 pb-10 md:px-12">
        {/* Top right: role + availability */}
        <div
          className="self-end will-change-transform"
          style={{ transform: faster(META_SPEED), opacity: `calc(1 - var(--p, 0) * ${META_FADE})` }}
        >
          <div
            className="text-right text-lg font-medium md:text-xl motion-safe:animate-slide-in"
            style={{ animationDelay: `${nameDone}ms` }}
          >
            <p>{profile.role}</p>
            {profile.available && (
              <p className="mt-3 inline-flex items-center gap-2.5">
                <BoltIcon className="size-[1em] shrink-0" />
                Available for freelance projects
              </p>
            )}
          </div>
        </div>

        {/* Bottom: giant name on the left, scroll cue on the right */}
        <div className="flex items-end justify-between gap-6">
          <h1 style={{ transform: faster(NAME_SPEED) }} className="will-change-transform font-display text-[clamp(4.5rem,min(22vw,40svh),26rem)] leading-[0.85] font-normal">
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
      </div>
    </section>
  )
}

export default Hero
