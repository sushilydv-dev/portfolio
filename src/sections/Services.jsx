import ArrowLink from '@/components/ui/ArrowLink'
import { STROKE, icons } from '@/components/ui/serviceIcons'
import WaveTitle from '@/components/ui/WaveTitle'
import SiteLink from '@/components/ui/SiteLink'
import { services } from '@/data/services'

const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]'

// One service row, laid out like a Selected work row. On hover a wave runs through the name's
// letters as they turn blue, the description darkens, the icon tips over with a small spring,
// and the "Custom quote" label steps toward the name.
// Each row opens that service's own page (/services/<slug>).
function Row({ service }) {
  const { slug, title, description, icon } = service

  return (
    <li className="border-b border-line transition-opacity duration-500 group-hover/list:[&:not(:hover)]:opacity-35 motion-reduce:transition-none">
      <SiteLink
        href={`/services/${slug}`}
        className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 py-6 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:items-center md:gap-x-6 md:py-7"
      >
        {/* Icon: tips over with a small spring on hover */}
        <svg
          viewBox="0 0 24 24"
          strokeWidth="1.6"
          className="mt-1 size-8 text-accent transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-rotate-12 group-focus-visible:scale-110 group-focus-visible:-rotate-12 md:mt-0 md:size-10 motion-reduce:transition-none"
          {...STROKE}
        >
          {icons[icon]}
        </svg>

        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="text-[clamp(1.7rem,3.8vw,3.4rem)] leading-[1.15] font-semibold tracking-tight text-ink">
            <span className="sr-only">{title}</span>
            <WaveTitle text={title} />
          </h3>
          <p
            className={`max-w-[44em] text-[clamp(1.02rem,0.97rem+0.25vw,1.16rem)] text-muted transition-colors duration-500 ${EASE} group-hover:text-ink group-focus-visible:text-ink motion-reduce:transition-none`}
          >
            {description}
          </p>
        </div>

        <span
          className={`col-start-2 mt-2 text-[clamp(0.95rem,1.2vw,1.1rem)] whitespace-nowrap text-muted transition-[translate] duration-500 ${EASE} md:col-start-auto md:mt-0 md:group-hover:-translate-x-4 motion-reduce:transition-none`}
        >
          <span className="transition-colors duration-500 group-hover:text-accent">Custom quote</span>
        </span>
      </SiteLink>
    </li>
  )
}

// "Work with me": what clients can hire me for, in the same list layout as Selected work.
function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="px-6 py-20 md:px-12 md:py-28">
      <div className="flex items-center justify-between gap-6">
        <h2 id="services-heading" className="text-lg font-medium text-accent md:text-2xl">
          Work with me
        </h2>
        <ArrowLink href="/contact" className="text-base md:text-lg">
          Start a project
        </ArrowLink>
      </div>

      <ul className="group/list mt-8 border-t border-line">
        {services.map((service) => (
          <Row key={service.title} service={service} />
        ))}
      </ul>
    </section>
  )
}

export default Services
