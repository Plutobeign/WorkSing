export default function Mountains() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1a1033 0%, #3d2060 25%, #e8712a 55%, #f5a623 70%, #fce4b3 88%, #c8d8f0 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,148 40,80 80,110 115,50 155,95 195,30 225,75 265,20 305,80 345,25 385,65 420,10 450,55 490,15 500,35 500,148" fill="#0d0820" opacity="0.9"/>
        <polygon points="0,148 50,105 90,120 130,90 170,115 215,80 255,108 300,82 345,118 390,92 430,120 475,100 500,112 500,148" fill="#1a1235" opacity="0.95"/>
        <polygon points="0,148 40,128 90,138 140,120 190,135 240,118 290,132 340,115 390,138 440,122 490,135 500,130 500,148" fill="#0d0820"/>
        <ellipse cx="80" cy="38" rx="35" ry="8" fill="#fce4b3" opacity="0.12" style={{animation:'cloudDrift 10s ease-in-out infinite alternate'}}/>
        <ellipse cx="320" cy="22" rx="45" ry="9" fill="#fce4b3" opacity="0.1" style={{animation:'cloudDrift 14s ease-in-out infinite alternate-reverse'}}/>
      </svg>
    </div>
  )
}
