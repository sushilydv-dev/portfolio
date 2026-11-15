import { useEffect } from 'react'
import FeatureGrid from '@/components/ui/FeatureGrid'
import NumberedSection from '@/components/ui/NumberedSection'
import PageHead from '@/components/ui/PageHead'
import { STROKE, icons } from '@/components/ui/serviceIcons'
import SiteLink from '@/components/ui/SiteLink'
import Steps from '@/components/ui/Steps'
import TechStack from '@/components/ui/TechStack'
import WaveTitle from '@/components/ui/WaveTitle'
import { findService, services } from '@/data/services'
import { work } from '@/data/work'
import { useMagnetic } from '@/hooks/useMagnetic'

const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'

// One service's own page (/services/<slug>), laid out like a project page: what it is, what I
// build, what you get, how it runs, the tools, related work, then a call to start a project.

const Arrow = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

// The one-line pitch under the heading; its accent words are blue
function Pitch({ pitch }) {
  return (
    <p className="mt-10 max-w-[24em] text-[clamp(1.85rem,3.9vw,3.6rem)] leading-[1.25] font-medium tracking-tight text-ink md:mt-14">
      {pitch.text.split(' ').map((word, i) => (
        <span key={i}>
          {i > 0 && ' '}
          <span className={pitch.accent.includes(word) ? 'text-accent' : ''}>{word}</span>
        </span>
      ))}
    </p>
  )
}

// Solid "Start a project" pill, pulled gently toward the cursor
function StartButton() {
  const ref = useMagnetic({ radius: 60, strength: 0.2, maxOffset: 10, stretch: 0.05 })
  return (
    <SiteLink
      ref={ref}
      href="/contact"
      className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 font-medium text-canvas transition-colors duration-300 will-change-transform hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:text-lg"
    >
      Start a project
      <Arrow className={`size-[1.1em] transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none ${SPRING}`} />
    </SiteLink>
  )
}

// Icon, pricing note and the start button, under the pitch
function Meta({ service }) {
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8 md:mt-16">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 24 24" strokeWidth="1.6" className="size-10 text-accent" {...STROKE}>
          {icons[service.icon]}
        </svg>
        <div>
          <p className="font-mono text-xs tracking-wide text-muted uppercase">Pricing</p>
          <p className="mt-1 font-medium md:text-lg">Custom quote after a short call</p>
        </div>
      </div>
      <StartButton />
    </div>
  )
}

function Deliverables({ items }) {
  return (
    <ul className="flex flex-col border-t border-line">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-4 border-b border-line py-4 text-[clamp(1.05rem,1.3vw,1.25rem)]">
          <span aria-hidden="true" className="h-px w-5 shrink-0 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}

// Projects that show this service in practice, each linking to its own page
function RelatedWork({ slugs }) {
  const items = slugs.map((slug) => work.find((w) => w.slug === slug)).filter(Boolean)
  return (
    <ul className="group/list border-t border-line">
      {items.map((item) => (
        <li key={item.slug} className="border-b border-line transition-opacity duration-500 group-hover/list:[&:not(:hover)]:opacity-35 motion-reduce:transition-none">
          <SiteLink href={`/work/${item.slug}`} className="group flex items-center justify-between gap-6 py-5 md:py-6">
            <span className="min-w-0">
              <span className="block text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight font-semibold tracking-tight">
                <span className="sr-only">{item.name}</span>
                <WaveTitle text={item.name} />
              </span>
              <span className="mt-1 block text-muted">{item.category}</span>
            </span>
            <Arrow className={`size-7 shrink-0 text-muted transition-[translate,color] duration-500 group-hover:translate-x-1.5 group-hover:text-accent motion-reduce:transition-none ${SPRING}`} />
          </SiteLink>
        </li>
      ))}
    </ul>
  )
}

// Big link to the next service (wraps around to the first)
function NextService({ service }) {
  const next = services[(services.indexOf(service) + 1) % services.length]
  return (
    <SiteLink
      href={`/services/${next.slug}`}
      className="group mx-6 mt-20 flex flex-col gap-3 border-y border-line py-10 md:mx-12 md:mt-28 md:flex-row md:items-end md:justify-between md:py-14"
      aria-label={`Next service: ${next.title}`}
    >
      <span>
        <span className="block font-mono text-sm text-muted uppercase">Next service</span>
        <span className="mt-2 block text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.05] font-semibold tracking-tight">
          <WaveTitle text={next.title} />
        </span>
      </span>
      <Arrow className={`size-12 shrink-0 text-muted transition-[translate,color] duration-500 group-hover:translate-x-2 group-hover:text-accent md:size-16 motion-reduce:transition-none ${SPRING}`} />
    </SiteLink>
  )
}

function Service({ slug }) {
  const service = findService(slug)

  useEffect(() => {
    document.title = `${service?.title ?? 'Services'} · Sushil Yadav`
  }, [service])

  if (!service) return null
  let n = 0

  return (
    <main id="top" className="pb-24 md:pb-32">
      <PageHead
        label={
          <>
            <SiteLink href="/services" className="group inline-flex items-center gap-1.5 hover:text-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[0.9em] transition-transform duration-300 group-hover:-translate-x-1">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Services
            </SiteLink>
            <span className="text-muted">/ {service.title}</span>
          </>
        }
        tagline={service.title}
      >
        <Pitch pitch={service.pitch} />
        <Meta service={service} />
      </PageHead>

      <div className="mt-8 px-6 md:mt-12 md:px-12">
        <NumberedSection index={++n} title="Overview">
          <div className="flex max-w-[44em] flex-col gap-5 text-[clamp(1.1rem,1.4vw,1.35rem)] leading-relaxed">
            {service.overview.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-ink' : 'text-muted'}>
                {p}
              </p>
            ))}
          </div>
        </NumberedSection>
        <NumberedSection index={++n} title="What I build">
          <FeatureGrid items={service.offerings} />
        </NumberedSection>
        <NumberedSection index={++n} title="What you get">
          <Deliverables items={service.deliverables} />
        </NumberedSection>
        <NumberedSection index={++n} title="How it works">
          <Steps steps={service.approach} />
        </NumberedSection>
        <NumberedSection index={++n} title="Tools I use">
          <TechStack groups={service.stackGroups} />
        </NumberedSection>
        <NumberedSection index={++n} title="Related work">
          <RelatedWork slugs={service.related} />
        </NumberedSection>
      </div>

      <NextService service={service} />
    </main>
  )
}

export default Service
