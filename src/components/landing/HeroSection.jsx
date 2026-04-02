import { motion } from 'framer-motion'
import { MicVocal } from 'lucide-react'
import { redirectToSpotifyLogin } from '../../utils/spotifyAuth'

export default function HeroSection() {
  return (
    <section style={s.section}>
      <div style={s.glow} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={s.inner}
      >
        {/* Icon */}
        <motion.div
          style={s.iconWrap}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div style={s.iconBox}>
            <MicVocal size={28} color='#1D9E75' />
          </div>
          <div style={s.iconGlow} />
        </motion.div>

        {/* Wordmark */}
        <h1 style={s.h1}>
          <span style={s.gradient}>WorkSing</span>
        </h1>

        <p style={s.tagline}>
          Karaoke mode while you work. See realtime lyrics overlay while you code, design, or browse.
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            style={s.btn}
            onClick={redirectToSpotifyLogin}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Connect Spotify
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={s.badges}
        >
          <span style={s.badgeGroup}>
            <span style={s.badgeDot} />
            <span style={s.badgeText}>Free</span>
          </span>
          <span style={s.divider} />
          <span style={s.badgeGroup}>
            <span style={s.badgeDot} />
            <span style={s.badgeText}>Only on Chrome on Desktop</span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}

const s = {
  section: { position: 'relative', minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', overflow: 'hidden' },
  glow: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(29,158,117,0.10) 0%, transparent 65%)', pointerEvents: 'none' },
  inner: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 640 },
  iconWrap: { position: 'relative', marginBottom: 24 },
  iconBox: { width: 56, height: 56, borderRadius: 16, background: 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconGlow: { position: 'absolute', inset: -8, borderRadius: 24, background: 'rgba(29,158,117,0.05)', zIndex: -1 },
  h1: { fontSize: 'clamp(56px,10vw,96px)', fontWeight: 800, letterSpacing: '-0.04em', fontFamily: "'Outfit','Inter',sans-serif", lineHeight: 1, marginBottom: 16 },
  gradient: { background: 'linear-gradient(135deg, #1D9E75, rgba(29,158,117,0.65))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' },
  tagline: { fontSize: 18, color: 'rgba(255,255,255,0.55)', marginBottom: 32, maxWidth: 420, lineHeight: 1.65, fontFamily: "'Space Grotesk','Inter',sans-serif" },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', borderRadius: 50, background: '#1D9E75', color: '#fff', fontSize: 17, fontWeight: 600, fontFamily: "'Inter',sans-serif", border: 'none', cursor: 'pointer', transition: 'transform 0.15s', marginBottom: 24 },
  badges: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  badgeGroup: { display: 'flex', alignItems: 'center', gap: 6 },
  divider: { width: 1, height: 12, background: 'rgba(255,255,255,0.15)', display: 'inline-block' },
  badgeDot: { width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' },
  badgeText: { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'Space Grotesk','Inter',sans-serif" },
}
