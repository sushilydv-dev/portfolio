import { useInView } from '@/hooks/useInView'

const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'

// The steps, joined by a line that draws through them; each dot pops as the line reaches it
function Steps({ steps }) {
  const [ref, shown] = useInView({ threshold: 0.3 })
  const step = 220 // ms between steps

  return (
    <ol ref={ref} className="relative flex flex-col gap-8">
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line" />
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[0.6875rem] w-px origin-top bg-accent transition-transform motion-reduce:transition-none"
        style={{ transform: `scaleY(${shown ? 1 : 0})`, transitionDuration: `${steps.length * step}ms`, transitionTimingFunction: 'linear' }}
      />
      {steps.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[1.5rem_1fr] gap-5">
          <span
            className={`relative z-10 grid size-6 place-items-center rounded-full border-2 border-accent bg-canvas font-mono text-[0.65rem] font-semibold text-accent transition-[scale,background-color,color] duration-500 motion-reduce:transition-none ${SPRING} ${shown ? 'scale-100' : 'scale-0'}`}
            style={{ transitionDelay: `${i * step}ms` }}
          >
            {i + 1}
          </span>
          <div
            className={`transition-[opacity,translate] duration-700 motion-reduce:transition-none ${EASE} ${shown ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
            style={{ transitionDelay: `${i * step + 80}ms` }}
          >
            <h3 className="text-lg font-semibold tracking-tight md:text-xl">{s.title}</h3>
            <p className="mt-1 text-muted md:text-lg">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export default Steps
