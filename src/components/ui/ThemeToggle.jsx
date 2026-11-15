import { useTheme } from '@/hooks/useTheme'

const ICON = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

// Both icons sit on top of each other; the active one is shown, the other spun away and faded out.
const SWAP = 'absolute inset-0 size-full transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none'
const HIDDEN_LEFT = 'opacity-0 -rotate-90 scale-50'
const HIDDEN_RIGHT = 'opacity-0 rotate-90 scale-50'

// Bare sun / moon outline: no button chrome, sits in the nav like the links. Ink by default,
// accent blue on hover; the icon spins as it swaps.
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const dark = theme === 'dark'

  const onClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="-m-2 shrink-0 cursor-pointer rounded-full p-2 text-ink transition-colors duration-300 hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span className="relative block size-5">
        <svg {...ICON} className={`${SWAP} ${dark ? HIDDEN_LEFT : ''}`}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        <svg {...ICON} className={`${SWAP} ${dark ? '' : HIDDEN_RIGHT}`}>
          <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />
        </svg>
      </span>
    </button>
  )
}

export default ThemeToggle
