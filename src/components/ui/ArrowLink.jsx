import SiteLink from '@/components/ui/SiteLink'
import { useMagnetic } from '@/hooks/useMagnetic'

// Arrow shape and hover nudge for each direction
const ARROWS = {
  right: { path: 'M5 12h14M13 6l6 6-6 6', hover: 'group-hover:translate-x-1 group-focus-visible:translate-x-1' },
  up: { path: 'M12 19V5M6 11l6-6 6 6', hover: 'group-hover:-translate-y-1 group-focus-visible:-translate-y-1' },
}

// Blue text link with an arrow, e.g. "Let's talk →". It is gently pulled toward the cursor
// (the navbar logo's effect, toned down) and the arrow slides forward on hover.
// `direction="up"` points the arrow up and slides it upward (used for "Back to top").
function ArrowLink({ href, children, external = false, direction = 'right', className = '' }) {
  const ref = useMagnetic({ radius: 50, strength: 0.12, maxOffset: 8, stretch: 0.03 })
  const arrow = ARROWS[direction]

  return (
    <SiteLink
      ref={ref}
      href={href}
      {...(external && { target: '_blank', rel: 'noreferrer' })}
      className={`group inline-flex items-center gap-2 font-medium text-accent will-change-transform ${className}`}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`size-[1.1em] transition-transform duration-300 motion-reduce:transition-none ${arrow.hover}`}
      >
        <path d={arrow.path} />
      </svg>
    </SiteLink>
  )
}

export default ArrowLink
