// Small line icons for the "what I build" marquee. No background: just the glyph, drawn in the
// accent blue (the same colour as the bolt next to "Available for freelance projects").
// Pick one by key with <BuildLogo kind="websites" />.

const icons = {
  // Browser window with code brackets
  websites: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="m10 12.5-2 2 2 2M14 12.5l2 2-2 2" />
    </>
  ),
  // Phone
  mobile: (
    <>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  // Monitor on a stand
  desktop: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M12 17v4M8 21h8" />
    </>
  ),
  // Sparkles
  agents: (
    <>
      <path d="m10 3 1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8Z" />
      <path d="m18 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
    </>
  ),
  // Terminal prompt
  tools: <path d="m4 17 5-5-5-5M12 19h8" />,
  // Looping arrows
  automations: (
    <>
      <path d="M20 11A8 8 0 0 0 5.1 7.5M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.9 3.5M20 20v-4h-4" />
    </>
  ),
  // Plug
  integrations: (
    <>
      <path d="M9 2v5M15 2v5" />
      <path d="M6 7h12v4a6 6 0 0 1-12 0Z" />
      <path d="M12 17v5" />
    </>
  ),
  // Bar chart on axes
  dashboards: <path d="M3 3v18h18M8 16v-4M13 16V8M18 16V9" />,
}

function BuildLogo({ kind, className = '' }) {
  const icon = icons[kind]
  if (!icon) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`text-accent ${className}`}
    >
      {icon}
    </svg>
  )
}

export default BuildLogo
