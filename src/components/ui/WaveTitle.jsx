const WAVE_STAGGER = 28 // ms between letters

// Title whose letters hop up one after another on hover, turning blue as the wave passes.
// Words stay unbroken so the name wraps exactly like plain text. Needs a `group` parent (the
// row) and an accessible name on the parent, since the letters are hidden from screen readers.
// Used by the Work with me rows and the About page's Path rows.
export default function WaveTitle({ text }) {
  let i = 0
  return (
    <span aria-hidden="true">
      {text.split(' ').map((word, w) => (
        <span key={w}>
          {w > 0 && ' '}
          <span className="inline-block whitespace-nowrap">
            {[...word].map((letter) => {
              const delay = `${i++ * WAVE_STAGGER}ms`
              return (
                <span
                  key={i}
                  style={{ animationDelay: delay, transitionDelay: delay }}
                  className="inline-block transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent motion-safe:group-hover:animate-wave motion-safe:group-focus-visible:animate-wave"
                >
                  {letter}
                </span>
              )
            })}
          </span>
        </span>
      ))}
    </span>
  )
}
