import { profile } from '@/data/profile'
import { useMagnetic } from '@/hooks/useMagnetic'
import { useSpotlight } from '@/hooks/useSpotlight'

const LETTER_DELAY = 70 // ms between each letter of the name
const WORD_DELAY = 45 // ms between each word of the pitch

// Splits a word into letters that rise in one after another, starting at `offset`
function AnimatedWord({ word, offset = 0 }) {
  return (
    <span className="block whitespace-nowrap" aria-hidden="true">
      {[...word].map((letter, i) => (
        <span
          key={i}
          className="inline-block transition-[transform,color] duration-300 ease-out hover:-translate-y-3 hover:text-accent motion-safe:animate-rise"
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
  const nameDone = (firstName.length + lastName.length) * LETTER_DELAY
  const after = (ms) => ({ animationDelay: `${nameDone + ms}ms` })
  const spotlightRef = useSpotlight()
  const words = profile.tagline.split(' ')
  const pitchDone = words.length * WORD_DELAY
  const ctaRef = useMagnetic({ radius: 70, strength: 0.2, maxOffset: 10, stretch: 0.04 })

  return (
    <section
      id="top"
      ref={spotlightRef}
      className="relative flex min-h-[calc(100svh-4rem)] overflow-hidden bg-canvas text-ink"
    >
      {/* Spotlight: a soft blue glow that follows the cursor and reveals a dot grid around it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_circle_at_var(--mx,72%)_var(--my,35%),color-mix(in_srgb,var(--color-accent)_15%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-ink)_26%,transparent)_1px,transparent_1.5px)] bg-[length:22px_22px] [mask-image:radial-gradient(22rem_circle_at_var(--mx,72%)_var(--my,35%),black,transparent)]"
      />

      <div className="relative flex w-full flex-1 flex-col justify-between gap-10 px-6 pt-6 pb-8 md:px-12">
        {/* Top row: role on the left, availability on the right */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 motion-safe:animate-fade-up">
          <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">{profile.role}</p>
          {profile.available && (
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-4 py-1.5 text-sm font-medium transition-colors hover:border-accent"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              Available for freelance projects
            </a>
          )}
        </div>

        {/* Name on the left; what I do and how to hire me on the right */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-display text-[clamp(4.5rem,min(21vw,34svh),24rem)] leading-[0.85] font-normal">
            <span className="sr-only">{profile.name}</span>
            <AnimatedWord word={firstName} />
            <AnimatedWord word={lastName} offset={firstName.length} />
          </h1>

          <div className="max-w-sm lg:pb-3">
            <p className="text-xl leading-snug font-medium text-balance md:text-2xl">
              <span className="sr-only">{profile.tagline}</span>
              {words.map((word, i) => (
                <span key={i} aria-hidden="true">
                  <span className="inline-block motion-safe:animate-fade-up" style={after(i * WORD_DELAY)}>
                    {word}
                  </span>{' '}
                </span>
              ))}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 motion-safe:animate-fade-up" style={after(pitchDone + 100)}>
              <a
                ref={ctaRef}
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-canvas will-change-transform"
              >
                Start a project
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#projects"
                className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-left-bottom bg-no-repeat pb-1 font-semibold transition-[background-size,color] duration-300 hover:bg-[length:0%_1px] hover:text-accent"
              >
                See my work
              </a>
            </div>
          </div>
        </div>

        {/* Bottom strip: what clients hire me for */}
        <div>
          <div className="h-px origin-left bg-line motion-safe:animate-grow-x" style={after(pitchDone + 200)} />
          <div className="flex items-center justify-between gap-6 pt-4">
            <ul className="flex flex-col gap-x-10 gap-y-1.5 text-sm font-medium sm:flex-row">
              {profile.services.map((service, i) => (
                <li
                  key={service}
                  className="flex items-baseline gap-2 motion-safe:animate-fade-up"
                  style={after(pitchDone + 400 + i * 120)}
                >
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  {service}
                </li>
              ))}
            </ul>
            <a
              href="#about"
              className="hidden shrink-0 items-center gap-3 text-sm font-medium text-muted transition-colors hover:text-ink md:flex motion-safe:animate-fade-up"
              style={after(pitchDone + 800)}
            >
              Scroll
              <span className="relative h-6 w-px overflow-hidden bg-line">
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
