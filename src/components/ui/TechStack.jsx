// Tech grouped by area, as small outlined chips (project and service pages)
function TechStack({ groups }) {
  return (
    <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
      {groups.map(({ group, items }) => (
        <div key={group}>
          <dt className="text-sm text-muted">{group}</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {items.map((tech) => (
              <span key={tech} className="rounded-md border border-line px-2.5 py-1 font-mono text-sm transition-colors duration-200 hover:border-accent hover:text-accent">
                {tech}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default TechStack
