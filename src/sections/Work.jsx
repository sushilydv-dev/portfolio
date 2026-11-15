import ArrowLink from '@/components/ui/ArrowLink'
import { allWorkUrl, projects } from '@/data/projects'

const LETTER_STAGGER = 22 // ms between letters as a name rolls over to blue

// Project name whose letters roll up one after another on hover, revealing a blue copy underneath.
// The blue copy is a text-shadow one line below each letter, so there is no duplicate text in the DOM.
function RollingName({ text }) {
  return (
    <span className="block overflow-hidden whitespace-nowrap leading-[1.2]" aria-hidden="true">
      {[...text].map((letter, i) => (
        <span
          key={i}
          style={{ transitionDelay: `${i * LETTER_STAGGER}ms` }}
          className="inline-block [text-shadow:0_1.2em_0_var(--color-accent)] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-[1.2em] group-focus-visible:-translate-y-[1.2em] motion-reduce:transition-none"
        >
          {letter === ' ' ? ' ' : letter}
        </span>
      ))}
    </span>
  )
}

function Row({ project }) {
  const { title, description, category, tech, year, url } = project
  const Tag = url ? 'a' : 'div'
  const linkProps = url ? { href: url, target: '_blank', rel: 'noreferrer', 'aria-label': `${title}, ${category}, ${year}` } : {}

  return (
    <li className="border-b border-line transition-opacity duration-500 group-hover/list:[&:not(:hover)]:opacity-35 motion-reduce:transition-none">
      <Tag
        {...linkProps}
        className="group relative flex flex-col gap-1 py-5 outline-none after:absolute after:inset-x-0 after:bottom-[-1px] after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-700 after:ease-[cubic-bezier(0.65,0,0.35,1)] hover:after:scale-x-100 focus-visible:after:scale-x-100 md:flex-row md:items-center md:justify-between md:gap-6 md:py-6"
      >
        <span className="sr-only">{title}</span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-[clamp(2.2rem,6.5vw,6rem)] font-semibold tracking-tight text-ink">
            <RollingName text={title} />
          </span>
          {/* One line that fades out toward the end, a teaser rather than the full story */}
          <span className="block max-w-full truncate whitespace-nowrap text-[clamp(1.02rem,0.97rem+0.25vw,1.16rem)] text-muted [text-overflow:clip] [mask-image:linear-gradient(to_right,black_55%,transparent)] md:max-w-[34rem]">
            {description}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-6 whitespace-nowrap text-[clamp(0.95rem,1.2vw,1.1rem)] text-muted">
          <span className="transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] md:group-hover:-translate-x-2 motion-reduce:transition-none">
            {category} · {tech}
          </span>
          <span className="tabular-nums">{year}</span>
          {/* Blue circle with a diagonal arrow that pops in on hover; an empty slot keeps rows aligned */}
          {!url && <span className="hidden size-11 shrink-0 md:block" />}
          {url && (
            <span className="hidden size-11 shrink-0 scale-0 -rotate-45 place-items-center rounded-full bg-accent text-canvas transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:rotate-0 group-focus-visible:scale-100 group-focus-visible:rotate-0 motion-reduce:transition-none md:grid">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          )}
        </span>
      </Tag>
    </li>
  )
}

function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="px-6 py-20 md:px-12 md:py-28">
      <div className="flex items-center justify-between gap-6">
        <h2 id="work-heading" className="text-lg font-medium text-accent md:text-2xl">
          Selected work
        </h2>
        <ArrowLink href={allWorkUrl} className="text-base md:text-lg">
          All work
        </ArrowLink>
      </div>

      <ul className="group/list mt-8 border-t border-line">
        {projects.map((project) => (
          <Row key={project.title} project={project} />
        ))}
      </ul>
    </section>
  )
}

export default Work
