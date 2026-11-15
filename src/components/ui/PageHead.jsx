// Shared header for the inner pages (About, Work): a small blue label, with an optional count
// chip, over a big display tagline whose words slide up out of their masks one after another.
// Words listed in `accent` are shown in blue. Optional `children` sit under the tagline.
function PageHead({ label, count, tagline, accent = [], children }) {
  const words = tagline.split(' ')

  return (
    <header className="px-6 pt-16 md:px-12 md:pt-24">
      <p className="flex items-start gap-2 text-lg font-medium text-accent md:text-2xl">
        {label}
        {count != null && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold tabular-nums md:text-sm">
            {String(count).padStart(2, '0')}
          </span>
        )}
      </p>
      <h1
        aria-label={tagline}
        className="mt-8 max-w-[14ch] font-display text-[clamp(3rem,8.8vw,8.75rem)] leading-[0.95] font-normal md:mt-12"
      >
        {words.map((word, i) => (
          <span key={i} aria-hidden="true">
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className={`inline-block motion-safe:animate-[word-up_1.1s_cubic-bezier(0.16,1,0.3,1)_backwards] ${accent.includes(word.replace(/[^\w]/g, '')) ? 'text-accent' : ''}`}
                style={{ animationDelay: `${150 + i * 90}ms` }}
              >
                {word}
              </span>
            </span>{' '}
          </span>
        ))}
      </h1>
      {children}
    </header>
  )
}

export default PageHead
