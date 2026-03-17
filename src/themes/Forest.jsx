export default function Forest() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #071a0e 0%, #0d2e18 40%, #133d20 70%, #1a4d28 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="22" r="12" fill="#fffde0" opacity="0.8"/>
        <circle cx="250" cy="22" r="22" fill="#fffde0" opacity="0.06"/>
        <g opacity="0.88">
          <polygon points="10,148 28,95 46,148" fill="#091e0c"/>
          <polygon points="22,148 44,68 66,148" fill="#0d3515"/>
          <polygon points="5,148 28,80 52,148" fill="#0a2810"/>
        </g>
        <g opacity="0.82">
          <polygon points="70,148 95,72 120,148" fill="#0f3c18"/>
          <polygon points="88,148 118,45 148,148" fill="#0c2e12"/>
          <polygon points="115,148 142,75 169,148" fill="#112a0e"/>
        </g>
        <g opacity="0.78">
          <polygon points="165,148 198,50 231,148" fill="#0e3315"/>
          <polygon points="200,148 238,65 276,148" fill="#0b2810"/>
          <polygon points="248,148 282,55 316,148" fill="#133a1c"/>
        </g>
        <g opacity="0.74">
          <polygon points="300,148 338,42 376,148" fill="#0d3015"/>
          <polygon points="348,148 386,62 424,148" fill="#0a2510"/>
          <polygon points="400,148 434,50 468,148" fill="#112e18"/>
        </g>
        <g opacity="0.7">
          <polygon points="448,148 478,70 508,148" fill="#0e3315"/>
          <polygon points="470,148 500,45 530,148" fill="#0c2e12"/>
        </g>
        <rect x="0" y="0" width="500" height="148" fill="url(#fogGrad)" opacity="0.25"/>
        <defs>
          <linearGradient id="fogGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8e6cf" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#a8e6cf" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
