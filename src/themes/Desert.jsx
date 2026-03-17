export default function Desert() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1a0a00 0%, #3d1500 18%, #8b2e00 38%, #d4520a 54%, #f5891e 66%, #fbb040 76%, #fce4a0 88%, #d4b890 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="82" r="28" fill="#ffdf80" opacity="0.9"/>
        <circle cx="250" cy="82" r="42" fill="#ffb040" opacity="0.18"/>
        <path d="M0,108 Q80,88 160,104 Q240,120 320,100 Q400,82 480,104 L500,108 L500,148 L0,148Z" fill="#1a0a00" opacity="0.9"/>
        <path d="M0,120 Q60,110 130,122 Q200,134 280,116 Q360,100 450,118 L500,120 L500,148 L0,148Z" fill="#0d0500"/>
        <path d="M35,120 L44,82 L53,120Z" fill="#0d0500" opacity="0.85"/>
        <path d="M42,95 Q44,80 46,95" stroke="#0d0500" strokeWidth="4" fill="none"/>
        <path d="M155,122 L170,72 L185,122Z" fill="#0d0500" opacity="0.8"/>
        <path d="M164,85 Q170,68 176,85" stroke="#0d0500" strokeWidth="4.5" fill="none"/>
        <path d="M380,112 L392,76 L404,112Z" fill="#0d0500" opacity="0.75"/>
        <path d="M388,88 Q392,73 396,88" stroke="#0d0500" strokeWidth="3.5" fill="none"/>
        <path d="M440,115 L450,85 L460,115Z" fill="#0d0500" opacity="0.7"/>
        <path d="M448,92 Q450,78 452,92" stroke="#0d0500" strokeWidth="3" fill="none"/>
      </svg>
    </div>
  )
}
