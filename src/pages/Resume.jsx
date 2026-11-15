import { useEffect } from 'react'
import NumberedSection from '@/components/ui/NumberedSection'
import WaveTitle from '@/components/ui/WaveTitle'
import { profile } from '@/data/profile'
import { education, experience, projects, resumePdf, role, skills, summary } from '@/data/resume'
import { socials } from '@/data/socials'
import { useMagnetic } from '@/hooks/useMagnetic'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'

/* ---------- Header ---------- */

// Text link whose word rolls up to a blue copy on hover
function RollLink({ href, children }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external && { target: '_blank', rel: 'me noreferrer' })}
      className="group inline-flex font-medium text-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span className="block overflow-hidden leading-[1.3]">
        <span className={`block [text-shadow:0_1.3em_0_var(--color-accent)] transition-transform duration-500 group-hover:-translate-y-[1.3em] group-focus-visible:-translate-y-[1.3em] motion-reduce:transition-none print:[text-shadow:none] ${EASE}`}>
          {children}
        </span>
      </span>
    </a>
  )
}

// Download PDF: solid pill whose arrow drops into a tray on hover; pulled gently toward the cursor
function DownloadButton() {
  const ref = useMagnetic({ radius: 50, strength: 0.18, maxOffset: 8, stretch: 0.05 })
  return (
    <a
      ref={ref}
      href={resumePdf}
      download="Sushil_Yadav_Resume.pdf"
      className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 font-medium text-canvas transition-colors duration-300 will-change-transform hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Download PDF
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 overflow-visible">
        <path d="M12 4v11M7 10l5 5 5-5" className={`transition-transform duration-500 group-hover:translate-y-1 motion-reduce:transition-none ${SPRING}`} />
        <path d="M5 20h14" />
      </svg>
    </a>
  )
}

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-line px-6 py-3 font-medium text-ink transition-colors duration-300 hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Print
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
        <path d="M7 9V3.5h10V9" />
        <rect x="3.5" y="9" width="17" height="8" rx="2" />
        <path d="M7 14.5h10V21H7Z" className={`transition-transform duration-500 group-hover:translate-y-0.5 motion-reduce:transition-none ${SPRING}`} />
      </svg>
    </button>
  )
}

function Header() {
  const words = profile.name.split(' ')
  const github = socials.find((s) => s.label === 'GitHub')
  const linkedin = socials.find((s) => s.label === 'LinkedIn')

  return (
    <header className="px-6 pt-16 md:px-12 md:pt-24 print:px-0 print:pt-0">
      <p className="text-lg font-medium text-accent md:text-2xl print:text-base">
        Resume <span className="text-muted">· {role}</span>
      </p>
      <h1 aria-label={profile.name} className="mt-6 font-display text-[clamp(3.5rem,13vw,13rem)] leading-[0.9] font-normal md:mt-10 print:text-6xl">
        {words.map((word, i) => (
          <span key={word} aria-hidden="true">
            <span className="inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span
                className="inline-block motion-safe:animate-[word-up_1.1s_cubic-bezier(0.16,1,0.3,1)_backwards]"
                style={{ animationDelay: `${150 + i * 120}ms` }}
              >
                {word}
              </span>
            </span>{' '}
          </span>
        ))}
      </h1>
      <div className="mt-8 flex flex-col gap-6 border-b border-line pb-10 md:mt-12 md:flex-row md:items-end md:justify-between md:pb-14">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-base md:text-lg">
          <RollLink href={github.href}>github.com/sushilydv-dev</RollLink>
          <span aria-hidden="true" className="text-line">/</span>
          <RollLink href={linkedin.href}>LinkedIn</RollLink>
          <span aria-hidden="true" className="text-line">/</span>
          <RollLink href={`mailto:${profile.email}`}>{profile.email}</RollLink>
        </p>
        <div className="flex flex-wrap gap-3 print:hidden">
          <DownloadButton />
          <PrintButton />
        </div>
      </div>
    </header>
  )
}

/* ---------- Sections ---------- */

// Bullet list with short blue dashes in place of dots
function Points({ points }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {points.map((point) => (
        <li key={point} className="relative pl-6 text-muted md:text-lg">
          <span aria-hidden="true" className="absolute top-[0.8em] left-0 h-px w-3 bg-accent" />
          {point}
        </li>
      ))}
    </ul>
  )
}

function Experience() {
  return (
    <ol className="group/list flex flex-col">
      {experience.map((job) => (
        <li
          key={job.role + job.company}
          className="group border-t border-line py-7 transition-opacity duration-500 first:border-t-0 first:pt-0 last:pb-0 group-hover/list:[&:not(:hover)]:opacity-40 motion-reduce:transition-none print:py-3"
        >
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
            <h3 aria-label={job.role} className="text-[clamp(1.4rem,2.3vw,2.1rem)] leading-tight font-semibold tracking-tight">
              <WaveTitle text={job.role} />
            </h3>
            <p className={`font-medium whitespace-nowrap text-muted tabular-nums transition-[translate,color] duration-500 group-hover:text-accent md:group-hover:-translate-x-3 motion-reduce:transition-none ${EASE}`}>
              {job.period}
            </p>
          </div>
          <p className="mt-1 text-ink/80 md:text-lg">
            {job.company} · {job.type} · {job.place}
          </p>
          <Points points={job.points} />
        </li>
      ))}
    </ol>
  )
}

function Projects() {
  return (
    <ol className="group/list flex flex-col">
      {projects.map((project) => (
        <li
          key={project.name}
          className="group border-t border-line py-7 transition-opacity duration-500 first:border-t-0 first:pt-0 last:pb-0 group-hover/list:[&:not(:hover)]:opacity-40 motion-reduce:transition-none print:py-3"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-6">
            <h3 className="text-[clamp(1.4rem,2.3vw,2.1rem)] leading-tight font-semibold tracking-tight" aria-label={`${project.name}, ${project.tagline}`}>
              <WaveTitle text={project.name} />
              <span aria-hidden="true" className="ml-3 text-base font-medium tracking-normal text-muted md:text-lg">
                {project.tagline}
              </span>
            </h3>
            <p className="flex gap-4 print:hidden">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link inline-flex items-center gap-1 font-medium text-accent"
                >
                  {link.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`size-3.5 transition-[rotate] duration-500 group-hover/link:rotate-45 ${SPRING}`}>
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              ))}
            </p>
          </div>
          <p className="mt-3 max-w-[46em] text-muted md:text-lg">{project.text}</p>
        </li>
      ))}
    </ol>
  )
}

function Skills() {
  return (
    <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {skills.map(({ group, items }) => (
        <div key={group}>
          <dt className="text-sm text-muted">{group}</dt>
          <dd className="mt-1.5 text-lg font-medium md:text-xl">
            {items.map((item, i) => (
              <span key={item}>
                {i > 0 && <span className="text-line"> · </span>}
                <span className="transition-colors duration-200 hover:text-accent">{item}</span>
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

// Degree rows with the CGPA as a big number; it tips up and turns blue on hover
function Education() {
  return (
    <ol className="flex flex-col">
      {education.map((item) => (
        <li
          key={item.short}
          className="group flex items-center justify-between gap-6 border-t border-line py-7 first:border-t-0 first:pt-0 last:pb-0 print:py-3"
        >
          <div className="min-w-0">
            <h3 className="text-[clamp(1.25rem,2vw,1.85rem)] leading-tight font-semibold tracking-tight">
              {item.degree} <span className="text-muted">({item.short})</span>
            </h3>
            <p className="mt-1 text-muted md:text-lg">
              {item.school} · {item.period}
            </p>
          </div>
          <p className="shrink-0 text-right">
            <span className={`block font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none transition-[rotate,color] duration-500 group-hover:-rotate-6 group-hover:text-accent motion-reduce:transition-none ${SPRING}`}>
              {item.score}
            </span>
            <span className="text-xs font-medium tracking-wide text-muted uppercase">CGPA</span>
          </p>
        </li>
      ))}
    </ol>
  )
}

/* ---------- Page ---------- */

function Resume() {
  useEffect(() => {
    document.title = 'Resume · Sushil Yadav'
  }, [])

  return (
    <main id="top" className="pb-24 md:pb-32 print:pb-0">
      <Header />
      <div className="px-6 md:px-12 print:px-0">
        <NumberedSection index={1} title="Summary">
          <p className="max-w-[40em] text-[clamp(1.2rem,1.7vw,1.6rem)] leading-relaxed font-medium tracking-tight text-ink">{summary}</p>
        </NumberedSection>
        <NumberedSection index={2} title="Experience">
          <Experience />
        </NumberedSection>
        <NumberedSection index={3} title="Selected projects">
          <Projects />
        </NumberedSection>
        <NumberedSection index={4} title="Skills">
          <Skills />
        </NumberedSection>
        <NumberedSection index={5} title="Education">
          <Education />
        </NumberedSection>
      </div>
    </main>
  )
}

export default Resume
