import { useEffect } from 'react'
import FeatureGrid from '@/components/ui/FeatureGrid'
import NumberedSection from '@/components/ui/NumberedSection'
import PageHead from '@/components/ui/PageHead'
import SiteLink from '@/components/ui/SiteLink'
import Steps from '@/components/ui/Steps'
import TechStack from '@/components/ui/TechStack'
import WaveTitle from '@/components/ui/WaveTitle'
import { findWork, work } from '@/data/work'
import { useInView } from '@/hooks/useInView'
import { useMagnetic } from '@/hooks/useMagnetic'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'

/* ---------- Top ---------- */

// The one-line pitch under the project name, in the same style as the About page's opening
// paragraph; its accent words are blue
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

// Primary link is a solid pill, the rest are outlined; all lean toward the cursor
function LinkButton({ href, children, primary }) {
  const ref = useMagnetic({ radius: 40, strength: 0.18, maxOffset: 8, stretch: 0.05 })
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium transition-colors duration-300 will-change-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${primary ? 'bg-ink text-canvas hover:bg-accent' : 'border border-line text-ink hover:border-ink'}`}
    >
      {children}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-4 transition-[rotate] duration-500 group-hover:rotate-45 ${SPRING}`}>
        <path d="M7 17 17 7M8 7h9v9" />
      </svg>
    </a>
  )
}

function Meta({ item }) {
  const rows = [
    ['Year', item.year],
    ['Type', item.category],
    ['Role', item.role],
  ]
  return (
    <div className="mt-12 grid gap-8 border-t border-line pt-8 md:mt-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end">
      <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-xs tracking-wide text-muted uppercase">{label}</dt>
            <dd className="mt-1.5 font-medium md:text-lg">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-3 md:justify-end">
        {item.client ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2.5 font-medium text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Client work · confidential
          </span>
        ) : (
          item.links?.map((link, i) => (
            <LinkButton key={link.label} href={link.href} primary={i === 0}>
              {link.label}
            </LinkButton>
          ))
        )}
      </div>
    </div>
  )
}

// Big cover image (optional `cover` on a project), unveiled from the bottom and settling from a slight zoom
function Cover({ image }) {
  const [ref, shown] = useInView({ threshold: 0.1 })
  return (
    <figure ref={ref} className="px-6 md:px-12">
      <div
        className={`overflow-hidden rounded-[1.5rem] border border-line bg-paper transition-[clip-path] duration-[1400ms] md:rounded-[2rem] motion-reduce:transition-none ${EASE}`}
        style={{ clipPath: shown ? 'inset(0 0 0 0 round 2rem)' : 'inset(18% 0 0 0 round 2rem)' }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className={`block h-auto w-full transition-[scale] duration-[1600ms] motion-reduce:transition-none ${EASE} ${shown ? 'scale-100' : 'scale-110'}`}
        />
      </div>
    </figure>
  )
}

// For projects without screenshots: a spec sheet laid out like a terminal readout
function SpecCard({ item }) {
  const [ref, shown] = useInView({ threshold: 0.2 })
  const lines = [
    ['project', item.name],
    ['type', item.category],
    ['year', item.year],
    ['status', item.client ? 'delivered · confidential' : 'live'],
    ['stack', item.stack.join(' · ')],
  ]
  return (
    <figure ref={ref} className="px-6 md:px-12">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-ink p-7 font-mono text-sm text-canvas md:rounded-[2rem] md:p-12 md:text-base">
        <div className="mb-8 flex gap-2" aria-hidden="true">
          <span className="size-3 rounded-full bg-canvas/25" />
          <span className="size-3 rounded-full bg-canvas/25" />
          <span className="size-3 rounded-full bg-accent" />
        </div>
        <p className="text-canvas/50">$ describe --project {item.slug}</p>
        <dl className="mt-5 flex flex-col gap-2.5">
          {lines.map(([key, value], i) => (
            <div
              key={key}
              className={`grid grid-cols-[6rem_1fr] gap-4 transition-[opacity,translate] duration-700 md:grid-cols-[8rem_1fr] motion-reduce:transition-none ${EASE} ${shown ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'}`}
              style={{ transitionDelay: `${200 + i * 110}ms` }}
            >
              <dt className="text-accent">{key}</dt>
              <dd className="min-w-0 text-canvas/90">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-canvas/50">
          <span className="motion-safe:animate-blink">▍</span>
        </p>
        <span aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-10 font-display text-[clamp(6rem,18vw,16rem)] leading-none text-canvas/[0.06]">
          {item.name.split(' ')[0]}
        </span>
      </div>
    </figure>
  )
}

/* ---------- Sections ---------- */

function Gallery({ images }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {images.map((image) => (
        <figure key={image.src} className="group">
          <div className="overflow-hidden rounded-xl border border-line bg-paper">
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className={`block h-auto w-full transition-[scale] duration-700 group-hover:scale-[1.03] motion-reduce:transition-none ${EASE}`}
            />
          </div>
          <figcaption className="mt-2.5 text-sm text-muted">{image.caption}</figcaption>
        </figure>
      ))}
    </div>
  )
}

// Big link to the next project (wraps around to the first)
function NextProject({ item }) {
  const next = work[(work.indexOf(item) + 1) % work.length]
  return (
    <SiteLink
      href={`/work/${next.slug}`}
      className="group mx-6 mt-20 flex flex-col gap-3 border-y border-line py-10 md:mx-12 md:mt-28 md:flex-row md:items-end md:justify-between md:py-14"
      aria-label={`Next project: ${next.name}`}
    >
      <span>
        <span className="block font-mono text-sm text-muted uppercase">Next project</span>
        <span className="mt-2 block text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.05] font-semibold tracking-tight">
          <WaveTitle text={next.name} />
        </span>
      </span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-12 shrink-0 text-muted transition-[translate,color] duration-500 group-hover:translate-x-2 group-hover:text-accent md:size-16 motion-reduce:transition-none ${SPRING}`}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </SiteLink>
  )
}

/* ---------- Page ---------- */

function Project({ slug }) {
  const item = findWork(slug)

  useEffect(() => {
    document.title = `${item?.name ?? 'Work'} · Sushil Yadav`
  }, [item])

  if (!item) return null
  const cover = item.cover
  const gallery = item.images ?? []
  let n = 0

  return (
    <main id="top" className="pb-24 md:pb-32">
      <PageHead
        label={
          <>
            <SiteLink href="/work" className="group inline-flex items-center gap-1.5 hover:text-ink">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-[0.9em] transition-transform duration-300 group-hover:-translate-x-1">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Work
            </SiteLink>
            <span className="text-muted">/ {item.name}</span>
          </>
        }
        tagline={item.name}
      >
        <Pitch pitch={item.pitch} />
        <Meta item={item} />
      </PageHead>

      <div className="mt-14 md:mt-20">{cover ? <Cover image={cover} /> : <SpecCard item={item} />}</div>

      <div className="mt-8 px-6 md:mt-12 md:px-12">
        <NumberedSection index={++n} title="Overview">
          <div className="flex max-w-[44em] flex-col gap-5 text-[clamp(1.1rem,1.4vw,1.35rem)] leading-relaxed">
            {item.overview.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-ink' : 'text-muted'}>
                {p}
              </p>
            ))}
          </div>
        </NumberedSection>
        <NumberedSection index={++n} title="What it does">
          <FeatureGrid items={item.features} />
        </NumberedSection>
        <NumberedSection index={++n} title="How it works">
          <Steps steps={item.flow} />
        </NumberedSection>
        <NumberedSection index={++n} title="Built with">
          <TechStack groups={item.stackGroups} />
        </NumberedSection>
        {gallery.length > 0 && (
          <NumberedSection index={++n} title="Screens">
            <Gallery images={gallery} />
          </NumberedSection>
        )}
      </div>

      <NextProject item={item} />
    </main>
  )
}

export default Project
