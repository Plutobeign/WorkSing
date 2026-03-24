import { AnimatePresence, motion } from 'framer-motion'

export const MODE_SIZES = {
  full:    { width: 500, height: 148 },
  compact: { width: 480, height: 72  },
  pill:    { width: 480, height: 44  },
}

function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = String(s % 60).padStart(2, '0')
  return `${m}:${sec}`
}

// Colour tokens — light vs dark theme
function tokens(dark) {
  return dark ? {
    textPrimary:   'rgba(30,15,10,0.95)',
    textDim:       'rgba(30,15,10,0.38)',
    textShadow:    '0 1px 4px rgba(255,255,255,0.4)',
    progress:      'rgba(0,0,0,0.3)',
    dotBorder:     'rgba(0,0,0,0.15)',
  } : {
    textPrimary:   'rgba(255,255,255,0.97)',
    textDim:       'rgba(255,255,255,0.32)',
    textShadow:    '0 1px 8px rgba(0,0,0,0.65)',
    progress:      'rgba(255,255,255,0.45)',
    dotBorder:     'transparent',
  }
}

export default function PlayerWidget({
  trackName, artistName, albumArt,
  progressMs, durationMs, isPlaying,
  trackId, connectionLost,
  currentLine, prevLine, nextLine,
  lyricsStatus,
  mode = 'full',
  textDark = false,
}) {
  const pct = durationMs > 0 ? Math.min((progressMs / durationMs) * 100, 100) : 0
  const tk  = tokens(textDark)

  const dotColor = connectionLost
    ? '#EF9F27'
    : lyricsStatus === 'synced' ? '#1D9E75'
    : lyricsStatus === 'plain'  ? '#EF9F27'
    : lyricsStatus === 'notFound' ? '#888780'
    : isPlaying ? '#1D9E75'
    : textDark ? '#888780' : '#444441'

  if (mode === 'pill')    return <PillMode    dotColor={dotColor} currentLine={currentLine} artistName={artistName} trackName={trackName} pct={pct} lyricsStatus={lyricsStatus} trackId={trackId} tk={tk} />
  if (mode === 'compact') return <CompactMode dotColor={dotColor} currentLine={currentLine} prevLine={prevLine} artistName={artistName} pct={pct} lyricsStatus={lyricsStatus} tk={tk} />
  return <FullMode dotColor={dotColor} currentLine={currentLine} prevLine={prevLine} nextLine={nextLine} artistName={artistName} trackName={trackName} albumArt={albumArt} progressMs={progressMs} durationMs={durationMs} pct={pct} lyricsStatus={lyricsStatus} trackId={trackId} isPlaying={isPlaying} tk={tk} />
}

// ── Full ──────────────────────────────────────────────────
function FullMode({ dotColor, currentLine, prevLine, nextLine, artistName, trackName, albumArt, progressMs, durationMs, pct, lyricsStatus, trackId, tk }) {
  return (
    <div style={f.wrap}>
      <div style={f.topBar}>
        {albumArt ? <img src={albumArt} alt="" style={f.art} /> : <div style={f.artEmpty} />}
        <div style={f.trackInfo}>
          <p style={{ ...f.trackName, color: tk.textPrimary }}>{trackName || '—'}</p>
          <p style={{ ...f.artistName, color: tk.textDim }}>{artistName || 'Nothing playing'}</p>
        </div>
        <div style={{ ...f.dot, background: dotColor }} />
      </div>

      <div style={f.lyricsArea}>
        {lyricsStatus === 'loading' && (
          <div style={f.skeletonWrap}>
            <div style={f.skel} />
            <div style={{ ...f.skel, width: '55%', marginTop: 6 }} />
          </div>
        )}
        {lyricsStatus === 'synced' && (
          <>
            <p style={{ ...f.lyricDim, color: tk.textDim }}>{prevLine || ' '}</p>
            <AnimatePresence mode="wait">
              <motion.p key={currentLine}
                style={{ ...f.lyricMain, color: tk.textPrimary, textShadow: tk.textShadow }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                {currentLine || '♪'}
              </motion.p>
            </AnimatePresence>
            <p style={{ ...f.lyricDim, color: tk.textDim }}>{nextLine || ' '}</p>
          </>
        )}
        {lyricsStatus === 'plain' && <p style={{ ...f.lyricDim, color: tk.textDim }}>Lyrics found — no timestamp sync</p>}
        {lyricsStatus === 'notFound' && trackId && <p style={{ ...f.lyricDim, color: tk.textDim }}>No lyrics found for this track</p>}
        {(!trackId || lyricsStatus === 'idle') && <p style={{ ...f.lyricDim, color: tk.textDim }}>Play something in Spotify</p>}
      </div>

      <div style={f.progressWrap}>
        <div style={{ ...f.progressFill, width: `${pct}%`, background: tk.progress }} />
      </div>
    </div>
  )
}

// ── Compact ───────────────────────────────────────────────
function CompactMode({ dotColor, currentLine, prevLine, artistName, pct, lyricsStatus, tk }) {
  return (
    <div style={c.wrap}>
      <div style={{ ...c.dot, background: dotColor }} />
      <div style={c.center}>
        <p style={{ ...c.prev, color: tk.textDim }}>
          {lyricsStatus === 'synced' ? (prevLine || ' ') : ' '}
        </p>
        <AnimatePresence mode="wait">
          <motion.p key={currentLine} style={{ ...c.main, color: tk.textPrimary, textShadow: tk.textShadow }}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {lyricsStatus === 'synced' ? (currentLine || '♪')
              : lyricsStatus === 'loading' ? 'Loading…'
              : lyricsStatus === 'notFound' ? 'No lyrics found'
              : 'Play something'}
          </motion.p>
        </AnimatePresence>
      </div>
      <p style={{ ...c.artist, color: tk.textDim }}>{artistName || ''}</p>
      <div style={c.progressWrap}>
        <div style={{ ...c.progressFill, width: `${pct}%`, background: tk.progress }} />
      </div>
    </div>
  )
}

// ── Pill ──────────────────────────────────────────────────
function PillMode({ dotColor, currentLine, artistName, trackName, pct, lyricsStatus, tk }) {
  const text = lyricsStatus === 'synced' ? (currentLine || '♪') : (trackName || 'Nothing playing')
  return (
    <div style={p.wrap}>
      <div style={{ ...p.dot, background: dotColor }} />
      <AnimatePresence mode="wait">
        <motion.span key={text} style={{ ...p.line, color: tk.textPrimary, textShadow: tk.textShadow }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {text}
        </motion.span>
      </AnimatePresence>
      {artistName && <span style={{ ...p.artist, color: tk.textDim }}>{artistName}</span>}
      <div style={p.progressWrap}>
        <div style={{ ...p.progressFill, width: `${pct}%`, background: tk.progress }} />
      </div>
    </div>
  )
}

const inter = "'Inter', sans-serif"

const f = {
  wrap: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 14px 0', position: 'relative' },
  topBar: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexShrink: 0 },
  art: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 },
  artEmpty: { width: 28, height: 28, borderRadius: 6, background: 'rgba(128,128,128,0.2)', flexShrink: 0 },
  trackInfo: { flex: 1, minWidth: 0 },
  trackName: { fontFamily: inter, fontSize: 11, fontWeight: 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 },
  artistName: { fontFamily: inter, fontSize: 10, margin: 0, marginTop: 1 },
  dot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0, transition: 'background 0.3s' },
  lyricsArea: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', padding: '0 8px' },
  skeletonWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  skel: { height: 10, width: '75%', background: 'rgba(128,128,128,0.15)', borderRadius: 4, animation: 'shimmer 1.5s ease-in-out infinite' },
  lyricDim: { fontFamily: inter, fontSize: 12, fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.4, margin: 0, width: '100%' },
  lyricMain: { fontFamily: inter, fontSize: 20, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0, WebkitFontSmoothing: 'antialiased', width: '100%' },
  progressWrap: { height: 2, background: 'rgba(128,128,128,0.15)', overflow: 'hidden', marginTop: 'auto', flexShrink: 0 },
  progressFill: { height: '100%', transition: 'width 0.1s linear' },
}

const c = {
  wrap: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', position: 'relative' },
  dot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.3s' },
  center: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
  prev: { fontFamily: inter, fontSize: 10, fontWeight: 400, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 },
  main: { fontFamily: inter, fontSize: 17, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, WebkitFontSmoothing: 'antialiased' },
  artist: { fontFamily: inter, fontSize: 10, flexShrink: 0, maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  progressWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(128,128,128,0.1)' },
  progressFill: { height: '100%', transition: 'width 0.1s linear' },
}

const p = {
  wrap: { display: 'inline-flex', alignItems: 'center', gap: 9, padding: '0 16px', height: '100%', position: 'relative', maxWidth: '100%' },
  dot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.3s' },
  line: { fontFamily: inter, fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', WebkitFontSmoothing: 'antialiased' },
  artist: { fontFamily: inter, fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0 },
  progressWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(128,128,128,0.1)', borderRadius: '0 0 22px 22px' },
  progressFill: { height: '100%', transition: 'width 0.1s linear', borderRadius: '0 0 0 22px' },
}
