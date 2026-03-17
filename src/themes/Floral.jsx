export default function Floral() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #fce4f0 0%, #f9d0e8 40%, #fbeacd 75%, #f5c8e0 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.6" style={{animation:'petalSway 4s ease-in-out infinite',transformOrigin:'30px 28px'}}>
          <ellipse cx="30" cy="28" rx="16" ry="8" fill="#f4a0c8" transform="rotate(-30 30 28)"/>
          <ellipse cx="30" cy="28" rx="16" ry="8" fill="#f4a0c8" transform="rotate(30 30 28)"/>
          <ellipse cx="30" cy="28" rx="16" ry="8" fill="#f4a0c8" transform="rotate(90 30 28)"/>
          <ellipse cx="30" cy="28" rx="16" ry="8" fill="#f4a0c8" transform="rotate(150 30 28)"/>
          <circle cx="30" cy="28" r="6" fill="#fce08a"/>
        </g>
        <g opacity="0.5" style={{animation:'petalSway 5s ease-in-out infinite reverse',transformOrigin:'180px 95px'}}>
          <ellipse cx="180" cy="95" rx="14" ry="7" fill="#f9b8d8" transform="rotate(-45 180 95)"/>
          <ellipse cx="180" cy="95" rx="14" ry="7" fill="#f9b8d8" transform="rotate(45 180 95)"/>
          <ellipse cx="180" cy="95" rx="14" ry="7" fill="#f9b8d8" transform="rotate(0 180 95)"/>
          <ellipse cx="180" cy="95" rx="14" ry="7" fill="#f9b8d8" transform="rotate(90 180 95)"/>
          <circle cx="180" cy="95" r="5" fill="#fce08a"/>
        </g>
        <g opacity="0.55" style={{transformOrigin:'340px 35px'}}>
          <ellipse cx="340" cy="35" rx="13" ry="6" fill="#e8a0c0" transform="rotate(20 340 35)"/>
          <ellipse cx="340" cy="35" rx="13" ry="6" fill="#e8a0c0" transform="rotate(80 340 35)"/>
          <ellipse cx="340" cy="35" rx="13" ry="6" fill="#e8a0c0" transform="rotate(140 340 35)"/>
          <ellipse cx="340" cy="35" rx="13" ry="6" fill="#e8a0c0" transform="rotate(-40 340 35)"/>
          <circle cx="340" cy="35" r="5" fill="#fad070"/>
        </g>
        <g opacity="0.4" style={{animation:'petalSway 6s ease-in-out infinite',transformOrigin:'460px 110px'}}>
          <ellipse cx="460" cy="110" rx="11" ry="5" fill="#f9c0d8" transform="rotate(15 460 110)"/>
          <ellipse cx="460" cy="110" rx="11" ry="5" fill="#f9c0d8" transform="rotate(75 460 110)"/>
          <ellipse cx="460" cy="110" rx="11" ry="5" fill="#f9c0d8" transform="rotate(135 460 110)"/>
          <circle cx="460" cy="110" r="4" fill="#fce08a"/>
        </g>
        <g opacity="0.35" style={{transformOrigin:'260px 70px'}}>
          <ellipse cx="260" cy="70" rx="10" ry="5" fill="#d490b8" transform="rotate(-20 260 70)"/>
          <ellipse cx="260" cy="70" rx="10" ry="5" fill="#d490b8" transform="rotate(40 260 70)"/>
          <ellipse cx="260" cy="70" rx="10" ry="5" fill="#d490b8" transform="rotate(100 260 70)"/>
          <circle cx="260" cy="70" r="4" fill="#f5d060"/>
        </g>
      </svg>
    </div>
  )
}
