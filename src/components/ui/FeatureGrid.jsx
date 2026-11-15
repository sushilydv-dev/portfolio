const pad = (n) => String(n).padStart(2, '0')

// Numbered cards in a grid joined by hairlines (project and service pages)
function FeatureGrid({ items }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
      {items.map((feature, i) => (
        <li key={feature.title} className="group bg-canvas p-6 transition-colors duration-300 hover:bg-paper md:p-7">
          <p className="font-mono text-xs text-muted transition-colors duration-300 group-hover:text-accent">{pad(i + 1)}</p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight md:text-xl">{feature.title}</h3>
          <p className="mt-2 text-muted">{feature.text}</p>
        </li>
      ))}
    </ul>
  )
}

export default FeatureGrid
