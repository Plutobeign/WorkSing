const RAIN = Array.from({ length: 22 }, (_, i) => ({
  x: 15 + (i * 22) % 470,
  y: -5 + (i * 9) % 35,
  h: 8 + (i % 4) * 3,
  delay: `${(i * 0.15) % 2}s`,
  dur: `${1.2 + (i % 4) * 0.3}s`,
}))

export default function LoFi() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0a0805 0%, #15120a 40%, #1e1810 70%, #2a2218 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        {/* Rain */}
        {RAIN.map((r, i) => (
          <line key={i} x1={r.x} y1={r.y} x2={r.x - 2} y2={r.y + r.h}
            stroke="rgba(180,200,220,0.14)" strokeWidth="0.7"
            style={{animation:`shimmer ${r.dur} ease-in-out infinite ${r.delay}`}}/>
        ))}
        {/* Desk surface */}
        <rect x="20" y="95" width="200" height="53" rx="3" fill="#1a1510" stroke="#2a2218" strokeWidth="0.5" opacity="0.9"/>
        {/* Window */}
        <rect x="30" y="102" width="52" height="38" rx="2" fill="#0a0f14" stroke="#2a2218" strokeWidth="0.5"/>
        <line x1="56" y1="102" x2="56" y2="140" stroke="#1a2530" strokeWidth="0.5"/>
        <line x1="30" y1="121" x2="82" y2="121" stroke="#1a2530" strokeWidth="0.5"/>
        {/* Warm glow on window */}
        <rect x="30" y="102" width="52" height="38" rx="2" fill="#d4a060" opacity="0.06"/>
        {/* Record player */}
        <rect x="92" y="105" width="50" height="35" rx="3" fill="#120f0a" stroke="#1e1810" strokeWidth="0.5"/>
        <circle cx="117" cy="122" r="13" fill="none" stroke="#2a2218" strokeWidth="1.2"/>
        <circle cx="117" cy="122" r="3" fill="#2a2218"/>
        <line cx="117" cy="109" x1="117" y1="109" x2="117" y2="135" stroke="#222" strokeWidth="0.5"/>
        {/* Bookshelf */}
        <rect x="155" y="105" width="55" height="35" rx="2" fill="#1a1510" stroke="#2a2218" strokeWidth="0.5"/>
        <rect x="158" y="108" width="8" height="29" rx="1" fill="#c87830" opacity="0.4"/>
        <rect x="168" y="108" width="6" height="29" rx="1" fill="#8b4020" opacity="0.35"/>
        <rect x="176" y="108" width="9" height="29" rx="1" fill="#d4a060" opacity="0.3"/>
        <rect x="187" y="108" width="7" height="29" rx="1" fill="#6b3820" opacity="0.35"/>
        <rect x="196" y="108" width="10" height="29" rx="1" fill="#c87830" opacity="0.25"/>
        {/* Desk lamp glow */}
        <ellipse cx="65" cy="95" rx="55" ry="30" fill="#d4a060" opacity="0.04"/>
        {/* Floor */}
        <rect x="0" y="140" width="500" height="8" fill="#0a0805" opacity="0.9"/>
      </svg>
    </div>
  )
}
