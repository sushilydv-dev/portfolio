// Hand-drawn marks that draw themselves in (stroke-dashoffset 1 → 0) when `drawn` turns true.
// Stretch them over a word with `className` (absolute positioning). Uses currentColor.
// (No vector-effect: non-scaling-stroke here, since Chrome then ignores pathLength and the
// mark shows before it is drawn.)
const DOODLES = {
  circle: {
    viewBox: '0 0 200 100',
    d: 'M24 58 C 18 22, 176 10, 188 46 C 198 82, 36 96, 14 62 C 2 42, 52 14, 132 16',
  },
  underline: { viewBox: '0 0 200 24', d: 'M4 16 C 46 6, 118 22, 196 9' },
  arrow: { viewBox: '0 0 60 60', d: 'M6 54 C 16 36, 28 22, 52 8 M52 8 L 36 9 M52 8 L 48 24' },
  star: { viewBox: '0 0 50 50', d: 'M25 4 L30 19 L46 19 L33 29 L38 45 L25 35 L12 45 L17 29 L4 19 L20 19 Z' },
  squiggle: { viewBox: '0 0 84 20', d: 'M2 10 Q 12 0, 22 10 T 42 10 T 62 10 T 82 10' },
}

function Doodle({ type = 'circle', drawn, delay = 0, strokeWidth = 2.5, className = '' }) {
  const { viewBox, d } = DOODLES[type]

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none overflow-visible ${className}`}
    >
      <path
        d={d}
        pathLength="1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="motion-reduce:[transition:none]"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn ? 0 : 1,
          // hidden while undrawn, or the round line cap leaves a dot
          opacity: drawn ? 1 : 0,
          transition: `stroke-dashoffset 900ms cubic-bezier(0.65, 0, 0.35, 1) ${delay}ms, opacity 0s linear ${drawn ? delay : 900}ms`,
        }}
      />
    </svg>
  )
}

export default Doodle
