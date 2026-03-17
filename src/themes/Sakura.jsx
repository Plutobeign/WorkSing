export default function Sakura() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #ffe8f5 0%, #ffd0e8 35%, #fce8c0 70%, #f5d8b0 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <line x1="60" y1="0" x2="42" y2="148" stroke="#c87090" strokeWidth="3" opacity="0.45"/>
        <line x1="60" y1="45" x2="8" y2="95" stroke="#c87090" strokeWidth="2" opacity="0.4"/>
        <line x1="60" y1="45" x2="118" y2="78" stroke="#c87090" strokeWidth="2" opacity="0.38"/>
        <line x1="60" y1="82" x2="0" y2="115" stroke="#c87090" strokeWidth="1.5" opacity="0.32"/>
        <g opacity="0.72" style={{animation:'petalSway 3.5s ease-in-out infinite',transformOrigin:'10px 88px'}}>
          <ellipse cx="10" cy="88" rx="8" ry="4.5" fill="#f4a0c0" transform="rotate(-20 10 88)"/>
          <ellipse cx="10" cy="88" rx="8" ry="4.5" fill="#f4a0c0" transform="rotate(40 10 88)"/>
          <ellipse cx="10" cy="88" rx="8" ry="4.5" fill="#f4a0c0" transform="rotate(100 10 88)"/>
          <circle cx="10" cy="88" r="3" fill="#fce080"/>
        </g>
        <g opacity="0.65" style={{animation:'petalSway 4.5s ease-in-out infinite reverse',transformOrigin:'120px 75px'}}>
          <ellipse cx="120" cy="75" rx="7" ry="4" fill="#f9b0d0" transform="rotate(10 120 75)"/>
          <ellipse cx="120" cy="75" rx="7" ry="4" fill="#f9b0d0" transform="rotate(70 120 75)"/>
          <ellipse cx="120" cy="75" rx="7" ry="4" fill="#f9b0d0" transform="rotate(130 120 75)"/>
          <circle cx="120" cy="75" r="3" fill="#fad070"/>
        </g>
        <g opacity="0.55" style={{animation:'petalSway 5s ease-in-out infinite',transformOrigin:'22px 40px'}}>
          <ellipse cx="22" cy="40" rx="6" ry="3.5" fill="#f4a8c8" transform="rotate(-30 22 40)"/>
          <ellipse cx="22" cy="40" rx="6" ry="3.5" fill="#f4a8c8" transform="rotate(30 22 40)"/>
          <ellipse cx="22" cy="40" rx="6" ry="3.5" fill="#f4a8c8" transform="rotate(90 22 40)"/>
          <circle cx="22" cy="40" r="2.5" fill="#fce080"/>
        </g>
        <g opacity="0.3">
          <ellipse cx="240" cy="55" rx="5" ry="3" fill="#f090b8" transform="rotate(15 240 55)"/>
          <ellipse cx="240" cy="55" rx="5" ry="3" fill="#f090b8" transform="rotate(75 240 55)"/>
          <circle cx="240" cy="55" r="2" fill="#f5d060"/>
        </g>
        <g opacity="0.22">
          <ellipse cx="380" cy="95" rx="5" ry="3" fill="#e888b0" transform="rotate(-10 380 95)"/>
          <ellipse cx="380" cy="95" rx="5" ry="3" fill="#e888b0" transform="rotate(50 380 95)"/>
          <ellipse cx="380" cy="95" rx="5" ry="3" fill="#e888b0" transform="rotate(110 380 95)"/>
          <circle cx="380" cy="95" r="2" fill="#f5d060"/>
        </g>
      </svg>
    </div>
  )
}
