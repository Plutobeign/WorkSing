import { motion } from 'framer-motion'
import { Headphones, MonitorPlay, Music } from 'lucide-react'

const steps = [
  { Icon: Headphones, title: 'Connect Spotify', desc: 'Link your Spotify account in one click. We only read what\'s currently playing.' },
  { Icon: Music,      title: 'Play any song',   desc: 'Hit play on your favorite track. Lyrics are fetched and synced automatically.' },
  { Icon: MonitorPlay,title: 'Sing while you work', desc: 'A translucent overlay shows lyrics on top of your screen. Minimal, unobtrusive, fun.' },
]

export default function HowItWorks() {
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <motion.h2
          style={s.h2}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.h2>

        <div style={s.grid}>
          {steps.map(({ Icon, title, desc }, i) => (
            <motion.div
              key={title}
              style={s.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(29,158,117,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
            >
              <div style={s.iconBox}>
                <Icon size={28} color='#1D9E75' />
              </div>
              <div style={s.stepLabel}>Step {i + 1}</div>
              <h3 style={s.h3}>{title}</h3>
              <p style={s.desc}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const s = {
  section: { padding: '96px 24px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  h2: { fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, textAlign: 'center', marginBottom: 64, fontFamily: "'Outfit','Inter',sans-serif", color: '#fff', letterSpacing: '-0.02em' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 28 },
  card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, transition: 'border-color 0.2s' },
  iconBox: { width: 64, height: 64, borderRadius: 18, background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  stepLabel: { fontSize: 12, fontWeight: 500, color: '#1D9E75', marginBottom: 8, fontFamily: "'Space Grotesk','Inter',sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' },
  h3: { fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 10, fontFamily: "'Outfit','Inter',sans-serif" },
  desc: { fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, fontFamily: "'Space Grotesk','Inter',sans-serif" },
}
