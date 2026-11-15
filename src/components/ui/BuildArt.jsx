// Original vector illustrations for the "what I build" marquee. Vector, so they stay crisp at any size.
// Each is a 320x220 scene; pick one by key with <BuildArt kind="websites" />.

const Defs = ({ id, from, to }) => (
  <defs>
    <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
    <filter id={`${id}-sh`} x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#0b1033" floodOpacity="0.28" />
    </filter>
  </defs>
)

const scenes = {
  websites: (
    <>
      <Defs id="web" from="#2747e6" to="#7b93ff" />
      <rect width="320" height="220" fill="url(#web-bg)" />
      <circle cx="285" cy="30" r="60" fill="#fff" opacity="0.08" />
      <g filter="url(#web-sh)">
        <rect x="34" y="34" width="252" height="168" rx="10" fill="#fff" />
        <rect x="34" y="34" width="252" height="22" rx="10" fill="#eef0f6" />
        <rect x="34" y="46" width="252" height="10" fill="#eef0f6" />
        <circle cx="47" cy="45" r="3.5" fill="#ff5f57" />
        <circle cx="58" cy="45" r="3.5" fill="#febc2e" />
        <circle cx="69" cy="45" r="3.5" fill="#28c840" />
        <rect x="90" y="40" width="140" height="10" rx="5" fill="#fff" />
      </g>
      <rect x="50" y="70" width="34" height="6" rx="3" fill="#1a1a1a" />
      <rect x="200" y="70" width="18" height="5" rx="2.5" fill="#c9cbd3" />
      <rect x="224" y="70" width="18" height="5" rx="2.5" fill="#c9cbd3" />
      <rect x="248" y="68" width="24" height="9" rx="4.5" fill="#2747e6" />
      <rect x="50" y="94" width="120" height="12" rx="3" fill="#1a1a1a" />
      <rect x="50" y="112" width="96" height="12" rx="3" fill="#1a1a1a" />
      <rect x="50" y="132" width="110" height="5" rx="2.5" fill="#b4b7c2" />
      <rect x="50" y="142" width="88" height="5" rx="2.5" fill="#b4b7c2" />
      <rect x="50" y="158" width="46" height="14" rx="7" fill="#2747e6" />
      <rect x="182" y="90" width="90" height="94" rx="8" fill="#e5e9fd" />
      <circle cx="227" cy="126" r="22" fill="#2747e6" />
      <rect x="198" y="160" width="58" height="6" rx="3" fill="#7b93ff" />
    </>
  ),
  mobile: (
    <>
      <Defs id="mob" from="#ff7a59" to="#ffc36b" />
      <rect width="320" height="220" fill="url(#mob-bg)" />
      <circle cx="40" cy="190" r="70" fill="#fff" opacity="0.12" />
      <g filter="url(#mob-sh)" transform="rotate(-8 160 110)">
        <rect x="112" y="14" width="96" height="196" rx="18" fill="#141414" />
        <rect x="118" y="20" width="84" height="184" rx="13" fill="#fff" />
        <rect x="146" y="25" width="28" height="7" rx="3.5" fill="#141414" />
      </g>
      <g transform="rotate(-8 160 110)">
        <rect x="126" y="42" width="40" height="6" rx="3" fill="#1a1a1a" />
        <rect x="126" y="56" width="68" height="44" rx="8" fill="#ff7a59" />
        <circle cx="178" cy="74" r="10" fill="#fff" opacity="0.5" />
        <rect x="126" y="108" width="68" height="20" rx="6" fill="#f2f2f0" />
        <circle cx="136" cy="118" r="5" fill="#ffc36b" />
        <rect x="146" y="115" width="36" height="5" rx="2.5" fill="#9a9a96" />
        <rect x="126" y="132" width="68" height="20" rx="6" fill="#f2f2f0" />
        <circle cx="136" cy="142" r="5" fill="#2747e6" />
        <rect x="146" y="139" width="30" height="5" rx="2.5" fill="#9a9a96" />
        <rect x="126" y="156" width="68" height="20" rx="6" fill="#f2f2f0" />
        <circle cx="136" cy="166" r="5" fill="#28c840" />
        <rect x="146" y="163" width="40" height="5" rx="2.5" fill="#9a9a96" />
        <rect x="140" y="190" width="40" height="4" rx="2" fill="#1a1a1a" />
      </g>
    </>
  ),
  desktop: (
    <>
      <Defs id="desk" from="#1d1f2b" to="#3a3f5c" />
      <rect width="320" height="220" fill="url(#desk-bg)" />
      <circle cx="260" cy="180" r="90" fill="#7b93ff" opacity="0.18" />
      <g filter="url(#desk-sh)">
        <rect x="28" y="30" width="264" height="160" rx="10" fill="#f7f7f5" />
      </g>
      <rect x="28" y="30" width="70" height="160" rx="10" fill="#e9e9ef" />
      <rect x="88" y="30" width="10" height="160" fill="#e9e9ef" />
      <circle cx="41" cy="43" r="3.5" fill="#ff5f57" />
      <circle cx="52" cy="43" r="3.5" fill="#febc2e" />
      <circle cx="63" cy="43" r="3.5" fill="#28c840" />
      <rect x="38" y="62" width="50" height="10" rx="4" fill="#2747e6" />
      <rect x="38" y="80" width="40" height="5" rx="2.5" fill="#a3a5b3" />
      <rect x="38" y="93" width="46" height="5" rx="2.5" fill="#a3a5b3" />
      <rect x="38" y="106" width="36" height="5" rx="2.5" fill="#a3a5b3" />
      <rect x="112" y="46" width="70" height="8" rx="4" fill="#1a1a1a" />
      <rect x="112" y="66" width="80" height="50" rx="7" fill="#fff" stroke="#e3e3e8" />
      <rect x="200" y="66" width="80" height="50" rx="7" fill="#fff" stroke="#e3e3e8" />
      <rect x="120" y="76" width="30" height="5" rx="2.5" fill="#a3a5b3" />
      <rect x="120" y="88" width="50" height="12" rx="3" fill="#1a1a1a" />
      <rect x="208" y="76" width="30" height="5" rx="2.5" fill="#a3a5b3" />
      <rect x="208" y="88" width="44" height="12" rx="3" fill="#2747e6" />
      <rect x="112" y="124" width="168" height="54" rx="7" fill="#fff" stroke="#e3e3e8" />
      <polyline points="122,166 146,150 168,158 192,138 218,146 244,130 270,136" fill="none" stroke="#2747e6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  agents: (
    <>
      <Defs id="ai" from="#0f172a" to="#2747e6" />
      <rect width="320" height="220" fill="url(#ai-bg)" />
      <circle cx="70" cy="50" r="80" fill="#a78bfa" opacity="0.22" />
      <g filter="url(#ai-sh)">
        <rect x="150" y="30" width="140" height="34" rx="14" fill="#fff" />
        <rect x="30" y="78" width="190" height="62" rx="14" fill="#1e2440" />
        <rect x="170" y="154" width="120" height="34" rx="14" fill="#fff" />
      </g>
      <rect x="164" y="44" width="96" height="6" rx="3" fill="#2a2a33" />
      <circle cx="50" cy="98" r="9" fill="#7b93ff" />
      <path d="M50 91 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#fff" />
      <rect x="66" y="94" width="130" height="6" rx="3" fill="#c7d0ff" />
      <rect x="66" y="108" width="110" height="6" rx="3" fill="#c7d0ff" opacity="0.7" />
      <rect x="66" y="122" width="70" height="6" rx="3" fill="#c7d0ff" opacity="0.5" />
      <rect x="184" y="168" width="70" height="6" rx="3" fill="#2a2a33" />
      <circle cx="272" cy="171" r="7" fill="#2747e6" />
      <path d="M269 171h6m-3-3l3 3-3 3" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="270" cy="110" r="3" fill="#fff" opacity="0.6" />
      <circle cx="286" cy="96" r="2" fill="#fff" opacity="0.4" />
      <path d="M262 124 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#fff" opacity="0.85" />
    </>
  ),
  tools: (
    <>
      <Defs id="tool" from="#10b981" to="#065f46" />
      <rect width="320" height="220" fill="url(#tool-bg)" />
      <circle cx="290" cy="40" r="70" fill="#fff" opacity="0.08" />
      <g filter="url(#tool-sh)">
        <rect x="34" y="32" width="252" height="160" rx="10" fill="#111317" />
      </g>
      <circle cx="48" cy="46" r="3.5" fill="#ff5f57" />
      <circle cx="59" cy="46" r="3.5" fill="#febc2e" />
      <circle cx="70" cy="46" r="3.5" fill="#28c840" />
      <g fontFamily="ui-monospace, Menlo, monospace" fontSize="11">
        <text x="48" y="76" fill="#34d399">$</text>
        <text x="60" y="76" fill="#e5e7eb">deploy --prod</text>
        <text x="48" y="96" fill="#6b7280">› building assets…</text>
        <text x="48" y="114" fill="#6b7280">› running 128 tests</text>
        <text x="48" y="132" fill="#34d399">✓ all checks passed</text>
        <text x="48" y="150" fill="#7b93ff">✓ live in 4.2s</text>
        <text x="48" y="174" fill="#34d399">$</text>
      </g>
      <rect x="60" y="165" width="7" height="12" fill="#e5e7eb" />
    </>
  ),
  automations: (
    <>
      <Defs id="auto" from="#f5f3ff" to="#ddd6fe" />
      <rect width="320" height="220" fill="url(#auto-bg)" />
      <g fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round">
        <path d="M92 70 C130 70 120 110 160 110" />
        <path d="M92 150 C130 150 120 110 160 110" />
        <path d="M214 110 L240 110" />
      </g>
      <g filter="url(#auto-sh)">
        <rect x="30" y="50" width="62" height="40" rx="10" fill="#fff" />
        <rect x="30" y="130" width="62" height="40" rx="10" fill="#fff" />
        <rect x="160" y="88" width="54" height="44" rx="12" fill="#7c3aed" />
        <rect x="240" y="88" width="54" height="44" rx="12" fill="#fff" />
      </g>
      <circle cx="46" cy="70" r="7" fill="#fbbf24" />
      <rect x="58" y="67" width="24" height="6" rx="3" fill="#c4b5fd" />
      <circle cx="46" cy="150" r="7" fill="#2747e6" />
      <rect x="58" y="147" width="24" height="6" rx="3" fill="#c4b5fd" />
      <path d="M181 98 l-6 13 h9 l-5 12 12 -16 h-9 l5 -9z" fill="#fff" />
      <path d="M256 110 l6 6 12 -13" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  integrations: (
    <>
      <Defs id="int" from="#fff7ed" to="#fed7aa" />
      <rect width="320" height="220" fill="url(#int-bg)" />
      <g stroke="#1a1a1a" strokeWidth="2" opacity="0.25">
        <line x1="160" y1="110" x2="70" y2="52" />
        <line x1="160" y1="110" x2="250" y2="52" />
        <line x1="160" y1="110" x2="62" y2="160" />
        <line x1="160" y1="110" x2="258" y2="160" />
        <line x1="160" y1="110" x2="160" y2="196" />
      </g>
      <g filter="url(#int-sh)">
        <circle cx="160" cy="110" r="32" fill="#1a1a1a" />
        <rect x="50" y="32" width="40" height="40" rx="11" fill="#fff" />
        <rect x="230" y="32" width="40" height="40" rx="11" fill="#fff" />
        <rect x="42" y="140" width="40" height="40" rx="11" fill="#fff" />
        <rect x="238" y="140" width="40" height="40" rx="11" fill="#fff" />
      </g>
      <path d="M150 102 h20 M150 118 h20 M146 110 h28" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="52" r="9" fill="#2747e6" />
      <rect x="240" y="44" width="20" height="16" rx="4" fill="#ff7a59" />
      <path d="M53 160 l9 -9 9 9 -9 9z" fill="#10b981" />
      <circle cx="258" cy="160" r="9" fill="none" stroke="#7c3aed" strokeWidth="4" />
      <circle cx="160" cy="196" r="7" fill="#f59e0b" />
    </>
  ),
  dashboards: (
    <>
      <Defs id="dash" from="#e0f2fe" to="#bae6fd" />
      <rect width="320" height="220" fill="url(#dash-bg)" />
      <g filter="url(#dash-sh)">
        <rect x="30" y="30" width="122" height="78" rx="12" fill="#fff" />
        <rect x="168" y="30" width="122" height="78" rx="12" fill="#fff" />
        <rect x="30" y="122" width="260" height="70" rx="12" fill="#fff" />
      </g>
      <rect x="44" y="44" width="40" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="44" y="58" width="64" height="16" rx="4" fill="#0f172a" />
      <rect x="44" y="84" width="34" height="10" rx="5" fill="#dcfce7" />
      <circle cx="229" cy="69" r="26" fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle cx="229" cy="69" r="26" fill="none" stroke="#2747e6" strokeWidth="10" strokeDasharray="115 164" transform="rotate(-90 229 69)" strokeLinecap="round" />
      <g fill="#2747e6">
        <rect x="48" y="160" width="14" height="20" rx="3" opacity="0.5" />
        <rect x="70" y="148" width="14" height="32" rx="3" opacity="0.6" />
        <rect x="92" y="154" width="14" height="26" rx="3" opacity="0.7" />
        <rect x="114" y="140" width="14" height="40" rx="3" opacity="0.8" />
        <rect x="136" y="134" width="14" height="46" rx="3" />
      </g>
      <polyline points="170,170 196,158 222,164 248,144 274,138" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

function BuildArt({ kind, className = '' }) {
  return (
    <svg viewBox="0 0 320 220" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      {scenes[kind]}
    </svg>
  )
}

export default BuildArt
