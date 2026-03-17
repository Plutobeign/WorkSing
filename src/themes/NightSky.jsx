const STARS = Array.from({ length: 42 }, (_, i) => ({
  cx: ((i * 97 + 31) % 480) + 10,
  cy: ((i * 53 + 11) % 120) + 5,
  r:  i % 5 === 0 ? 1.4 : i % 3 === 0 ? 1.0 : 0.7,
  delay: `${(i * 0.18) % 3}s`,
  dur:   `${1.5 + (i % 5) * 0.4}s`,
  op:    0.4 + (i % 5) * 0.12,
}))

export default function NightSky() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #020410 0%, #050820 30%, #0a0f35 60%, #0f1845 80%, #152060 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, transparent 20%, rgba(130,110,255,0.12) 45%, rgba(180,160,255,0.1) 55%, transparent 75%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        {STARS.map((star, i) => (
          <circle key={i} cx={star.cx} cy={star.cy} r={star.r} fill="white" opacity={star.op}
            style={{animation:`starTwinkle ${star.dur} ease-in-out infinite ${star.delay}`}}/>
        ))}
        <path d="M200,32 Q185,14 168,30" stroke="rgba(160,140,255,0.4)" strokeWidth="1.5" fill="none"/>
        <path d="M200,32 Q212,10 228,28" stroke="rgba(160,140,255,0.35)" strokeWidth="1.5" fill="none"/>
        <circle cx="196" cy="30" r="2.5" fill="rgba(200,190,255,0.65)" style={{animation:'starTwinkle 2s ease-in-out infinite'}}/>
        <polygon points="0,148 60,110 100,128 150,105 200,122 260,98 320,118 380,102 430,122 480,108 500,118 500,148" fill="#050820" opacity="0.95"/>
        <polygon points="0,148 40,132 90,142 150,128 210,140 270,125 330,138 390,128 450,140 500,132 500,148" fill="#020410"/>
      </svg>
    </div>
  )
}
