export default function Ocean() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #04131f 0%, #072a45 30%, #0a3d5c 55%, #0f5070 72%, #2080a0 100%)' }} />
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 500 148" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        {[
          {cx:60,cy:18,r:1.2,delay:'0s',dur:'2s'},
          {cx:130,cy:10,r:1,delay:'0.4s',dur:'2.5s'},
          {cx:200,cy:22,r:1.5,delay:'0.8s',dur:'1.8s'},
          {cx:270,cy:8,r:1,delay:'0.2s',dur:'2.2s'},
          {cx:340,cy:16,r:1.3,delay:'1s',dur:'2s'},
          {cx:410,cy:6,r:1,delay:'0.6s',dur:'2.8s'},
          {cx:470,cy:20,r:1.2,delay:'1.2s',dur:'2.1s'},
          {cx:95,cy:30,r:0.8,delay:'0.3s',dur:'3s'},
          {cx:230,cy:35,r:1,delay:'0.9s',dur:'2.4s'},
          {cx:380,cy:28,r:0.9,delay:'0.5s',dur:'1.9s'},
        ].map((star,i) => (
          <circle key={i} cx={star.cx} cy={star.cy} r={star.r} fill="white" opacity="0.7"
            style={{animation:`starTwinkle ${star.dur} ease-in-out infinite ${star.delay}`}}/>
        ))}
        <g style={{animation:'waveMove 4s linear infinite'}} opacity="0.45">
          <path d="M-50,105 Q-25,97 0,105 Q25,113 50,105 Q75,97 100,105 Q125,113 150,105 Q175,97 200,105 Q225,113 250,105 Q275,97 300,105 Q325,113 350,105 Q375,97 400,105 Q425,113 450,105 Q475,97 500,105 Q525,113 550,105" stroke="#4cc9e8" strokeWidth="1.5" fill="none"/>
        </g>
        <g style={{animation:'waveMove 6s linear infinite reverse'}} opacity="0.35">
          <path d="M-50,118 Q-10,111 30,118 Q70,125 110,118 Q150,111 190,118 Q230,125 270,118 Q310,111 350,118 Q390,125 430,118 Q470,111 510,118 Q550,125 590,118" stroke="#2eb5d4" strokeWidth="1" fill="none"/>
        </g>
        <g style={{animation:'waveMove 3s linear infinite'}} opacity="0.25">
          <path d="M-50,130 Q0,125 50,130 Q100,135 150,130 Q200,125 250,130 Q300,135 350,130 Q400,125 450,130 Q500,135 550,130" stroke="#5dd6f0" strokeWidth="0.8" fill="none"/>
        </g>
      </svg>
    </div>
  )
}
