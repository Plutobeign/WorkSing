import { motion } from 'framer-motion'
import previewImg from '../../assets/worksing-preview.jpg'

export default function PreviewSection() {
  return (
    <section style={s.section}>
      <div style={s.inner}>
        <motion.div
          style={s.frame}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Gradient fade at bottom */}
          <div style={s.fadeOverlay} />
          <img src={previewImg} alt="WorkSing lyrics overlay on a code editor" style={s.img} />
          <div style={s.caption}>
            <p style={s.captionText}>Lyrics overlay on your workspace — distraction-free karaoke</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

const s = {
  section: { padding: '0 24px 64px' },
  inner: { maxWidth: 900, margin: '0 auto' },
  frame: { position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px -10px rgba(29,158,117,0.35)' },
  fadeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,14,0.6) 0%, transparent 50%)', zIndex: 1, pointerEvents: 'none' },
  img: { width: '100%', height: 'auto', display: 'block' },
  caption: { position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', zIndex: 2 },
  captionText: { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'Space Grotesk','Inter',sans-serif" },
}
