import { useInView } from '@/hooks/useInView'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
// Scroll-in animations never hide anything when printing
const PRINT_SHOW = 'print:translate-none! print:opacity-100! print:transition-none!'

// A numbered page section (Resume, project pages): its number and name stay pinned on the left
// while the content scrolls on the right. When it comes into view, the number's rule draws across and the content rises in.
function NumberedSection({ index, title, children }) {
  const [ref, shown] = useInView({ threshold: 0.15 })
  const id = `section-${title.toLowerCase().replace(/\W+/g, '-')}`

  return (
    <section
      ref={ref}
      aria-labelledby={id}
      className="grid gap-6 border-b border-line py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] md:gap-12 md:py-16 print:break-inside-avoid print:grid-cols-[9rem_1fr] print:gap-6 print:py-5"
    >
      <div className="self-start md:sticky md:top-24">
        <p className="flex items-center gap-3 font-mono text-sm text-muted">
          {String(index).padStart(2, '0')}
          <span
            aria-hidden="true"
            className={`h-px w-10 origin-left bg-accent transition-transform duration-1000 motion-reduce:transition-none ${EASE} ${PRINT_SHOW} ${shown ? 'scale-x-100' : 'scale-x-0'}`}
          />
        </p>
        <h2 id={id} className="mt-2 text-lg font-medium text-ink md:text-xl">
          {title}
        </h2>
      </div>
      <div
        className={`min-w-0 transition-[opacity,translate] duration-1000 motion-reduce:transition-none ${EASE} ${PRINT_SHOW} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        style={{ transitionDelay: shown ? '120ms' : '0ms' }}
      >
        {children}
      </div>
    </section>
  )
}

export default NumberedSection
