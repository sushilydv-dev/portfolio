// Line icons for the services (home page and the Services page). Use with <svg {...STROKE}>.
export const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const icons = {
  // Stacked layers: front end, back end, database
  layers: (
    <>
      <path d="M12 2.5 3 7.5l9 5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" />
    </>
  ),
  // Shield with a spark: AI that stays private
  shield: (
    <>
      <path d="M12 2.5 4.5 5.5v5.5c0 4.6 3.1 8.2 7.5 10.5 4.4-2.3 7.5-5.9 7.5-10.5V5.5Z" />
      <path d="m12 8 1.1 2.9L16 12l-2.9 1.1L12 16l-1.1-2.9L8 12l2.9-1.1Z" />
    </>
  ),
  // Two-way arrows: systems exchanging data
  exchange: (
    <>
      <path d="M4 8h15M15 4l4 4-4 4" />
      <path d="M20 16H5M9 12l-4 4 4 4" />
    </>
  ),
  // Laptop beside a phone
  devices: (
    <>
      <rect x="2.5" y="5" width="12.5" height="9" rx="1.2" />
      <path d="M1 17.5h15.5" />
      <rect x="17.5" y="8" width="5" height="11" rx="1.2" />
    </>
  ),
}
