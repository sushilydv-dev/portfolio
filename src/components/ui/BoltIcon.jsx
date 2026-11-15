// Glowing lightning bolt: the blue glow breathes and every few seconds the bolt flickers, as if
// it's charged. Uses the accent colour. With reduced motion it stays still with a steady glow.
function BoltIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`overflow-visible text-accent [filter:drop-shadow(0_0_3px_var(--color-accent))] motion-safe:animate-glow ${className}`}
    >
      <path d="M13.5 2 4.5 13.5h6.5L9.5 22l9-11.5H12L13.5 2Z" className="motion-safe:animate-flicker" />
    </svg>
  )
}

export default BoltIcon
