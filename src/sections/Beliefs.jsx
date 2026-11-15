import Doodle from '@/components/ui/Doodle'
import { beliefs, splitKeyword } from '@/data/beliefs'
import { useInView } from '@/hooks/useInView'

const SPRING = 'ease-[cubic-bezier(0.34,1.56,0.64,1)]'

// Each card has its own look, so the stack reads like a hand of different cards.
const LOOKS = [
  { card: 'border border-line bg-paper text-ink', soft: 'text-muted', doodle: 'text-accent', tilt: -1.5 },
  { card: 'bg-ink text-canvas', soft: 'text-canvas/65', doodle: 'text-accent', tilt: 1.25 },
  { card: 'bg-accent text-canvas', soft: 'text-canvas/80', doodle: 'text-canvas', tilt: -1 },
  { card: 'border border-line bg-paper text-ink', soft: 'text-muted', doodle: 'text-accent', tilt: 1.75 },
]

// One card. It is sticky, so the next card slides up over it as you scroll; when a card lands it
// settles from a steep tilt to its resting angle with a little spring, and a doodle draws itself
// around the key word.
function Card({ belief, index }) {
  const [ref, landed] = useInView({ threshold: 0.55 })
  const look = LOOKS[index % LOOKS.length]
  const [before, keyword, after] = splitKeyword(belief)
  const number = String(index + 1).padStart(2, '0')

  return (
    <li className="sticky mb-[18vh] last:mb-0" style={{ top: `calc(14vh + ${index * 1.5}rem)` }}>
      <div
        ref={ref}
        className={`flex min-h-[62svh] flex-col justify-between gap-10 rounded-[2rem] p-7 shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] transition-[rotate,translate] duration-700 md:rounded-[2.5rem] md:p-14 motion-reduce:transition-none ${SPRING} ${look.card}`}
        style={{
          rotate: `${landed ? look.tilt : look.tilt * 4}deg`,
          translate: landed ? '0 0' : '0 2.5rem',
        }}
      >
        <div className={`flex items-center justify-between text-sm font-medium md:text-base ${look.soft}`}>
          <span>What I believe</span>
          <span className="tabular-nums">
            {number}/{String(beliefs.length).padStart(2, '0')}
          </span>
        </div>

        <div>
          <h3 className="text-[clamp(2.5rem,7vw,7rem)] leading-[1] font-semibold tracking-tight text-balance">
            {before}
            <span className="relative inline-block">
              {keyword}
              <Doodle
                type={index % 2 ? 'underline' : 'circle'}
                drawn={landed}
                delay={250}
                className={`absolute ${look.doodle} ${index % 2 ? '-bottom-[0.12em] left-0 h-[0.22em] w-full' : '-inset-x-[0.18em] -inset-y-[0.16em] h-[calc(100%+0.32em)] w-[calc(100%+0.36em)]'}`}
              />
            </span>
            {after}
          </h3>
          <p className={`mt-5 max-w-[30em] text-[clamp(1.05rem,1.4vw,1.35rem)] md:mt-7 ${look.soft}`}>{belief.body}</p>
        </div>
      </div>
    </li>
  )
}

// "What I believe": principles as a stack of cards dealt one over another as you scroll.
function Beliefs() {
  return (
    <section id="beliefs" aria-labelledby="beliefs-heading" className="overflow-x-clip px-6 py-20 md:px-12 md:py-28">
      <h2 id="beliefs-heading" className="text-lg font-medium text-accent md:text-2xl">
        What I believe
      </h2>
      <ol className="mt-10 md:mt-14">
        {beliefs.map((belief, i) => (
          <Card key={belief.title} belief={belief} index={i} />
        ))}
      </ol>
    </section>
  )
}

export default Beliefs
