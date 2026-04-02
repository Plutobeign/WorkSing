import { motion } from 'framer-motion'
import previewImg from '../../assets/worksing-preview.png'

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
          <div style={s.fadeOverlay} />
          <img src={previewImg} alt="WorkSing lyrics overlay on a code editor" style={s.img} />
        </motion.div>

        <p style={s.caption}>
          {`Lyrics overlay on your workspace,\nthat way you Sing along while you work.\nDont be too Loud though`}
        </p>
      </div>
    </section>
  )
}

const s = {
  section: { padding: '0 24px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  inner: { maxWidth: 640, width: '100%', margin: '0 auto' },
  frame: { position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px -10px rgba(29,158,117,0.35)' },
  fadeOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,14,0.6) 0%, transparent 50%)', zIndex: 1, pointerEvents: 'none' },
  img: { width: '100%', height: 'auto', display: 'block' },
  caption: { marginTop: 32, fontSize: 16, color: 'rgba(255,255,255,0.45)', textAlign: 'center', fontFamily: "'Space Grotesk',monospace", fontWeight: 300, lineHeight: 1.8, whiteSpace: 'pre-line' },
}
