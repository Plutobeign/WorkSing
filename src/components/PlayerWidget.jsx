import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Mode dimensions — used later for PiP overlay sizing
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

export default function PlayerWidget({
  trackName, artistName, albumArt,
  progressMs, durationMs, isPlaying,
  trackId, connectionLost,
  currentLine, prevLine, nextLine,
  lyricsStatus,
  mode = 'full',
}) {
  const pct = durationMs > 0
    ? Math.min((progressMs / durationMs) * 100, 100)
    : 0

  const dotColor = connectionLost
    ? '#EF9F27'
    : lyricsStatus === 'synced'
    ? '#1D9E75'
    : lyricsStatus === 'plain'
    ? '#EF9F27'
    : lyricsStatus === 'notFound'
    ? '#888780'
    : isPlaying
    ? '#1D9E75'
    : '#444441'

  if (mode === 'pill') return (
    <PillMode
      dotColor={dotColor}
      currentLine={currentLine}
      artistName={artistName}
      trackName={trackName}
      pct={pct}
      lyricsStatus={lyricsStatus}
      trackId={trackId}
    />
  )

  if (mode === 'compact') return (
    <CompactMode
      dotColor={dotColor}
      currentLine={currentLine}
      prevLine={prevLine}
      artistName={artistName}
      trackName={trackName}
      albumArt={albumArt}
      progressMs={progressMs}
      durationMs={durationMs}
      pct={pct}
      lyricsStatus={lyricsStatus}
      trackId={trackId}
    />
  )

  // Full mode
  return (
    <FullMode
      dotColor={dotColor}
      currentLine={currentLine}
      prevLine={prevLine}
      nextLine={nextLine}
      artistName={artistName}
      trackName={trackName}
      albumArt={albumArt}
      progressMs={progressMs}
      durationMs={durationMs}
      pct={pct}
      lyricsStatus={lyricsStatus}
      trackId={trackId}
      isPlaying={isPlaying}
    />
  )
}

// ── Full mode 500×148 ─────────────────────────────────────
function FullMode({ dotColor, currentLine, prevLine, nextLine, artistName, trackName, albumArt, progressMs, durationMs, pct, lyricsStatus, trackId, isPlaying }) {
  return (
    <div style={f.wrap}>
      {/* Top bar */}
      <div style={f.topBar}>
        {albumArt
          ? <img src={albumArt} alt="" style={f.art} />
          : <div style={f.artEmpty} />
        }
        <div style={f.trackInfo}>
          <p style={f.trackName}>{trackName || '—'}</p>
          <p style={f.artistName}>{artistName || 'Nothing playing'}</p>
        </div>
        <div style={{ ...f.dot, background: dotColor }} />
      </div>

      {/* Lyrics */}
      <div style={f.lyricsArea}>
        {lyricsStatus === 'loading' && (
          <div style={f.skeletonWrap}>
            <div style={f.skel} />
            <div style={{ ...f.skel, width: '60%', marginTop: 6 }} />
          </div>
        )}

        {lyricsStatus === 'synced' && (
          <>
            <p style={f.lyricDim}>{prevLine || ' '}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentLine}
                style={f.lyricMain}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {currentLine || '♪'}
              </motion.p>
            </AnimatePresence>
            <p style={f.lyricDim}>{nextLine || ' '}</p>
          </>
        )}

        {lyricsStatus === 'plain' && (
          <p style={f.lyricDim}>Plain lyrics only — no sync</p>
        )}

        {lyricsStatus === 'notFound' && trackId && (
          <p style={f.lyricDim}>No lyrics found</p>
        )}

        {(!trackId || lyricsStatus === 'idle') && (
          <p style={f.lyricDim}>Play something in Spotify</p>
        )}
      </div>

      {/* Progress */}
      <div style={f.progressWrap}>
        <div style={{ ...f.progressFill, width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Compact mode 480×72 ───────────────────────────────────
function CompactMode({ dotColor, currentLine, prevLine, artistName, trackName, albumArt, pct, lyricsStatus, trackId }) {
  return (
    <div style={c.wrap}>
      <div style={{ ...c.dot, background: dotColor }} />
      <div style={c.center}>
        <p style={c.prev}>
          {lyricsStatus === 'synced' ? (prevLine || ' ') : (trackName || '—')}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentLine}
            style={c.main}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {lyricsStatus === 'synced'
              ? (currentLine || '♪')
              : lyricsStatus === 'loading'
              ? 'Loading…'
              : lyricsStatus === 'notFound'
              ? 'No lyrics found'
              : 'Play something'}
          </motion.p>
        </AnimatePresence>
      </div>
      <p style={c.artist}>{artistName || ''}</p>
      <div style={c.progressWrap}>
        <div style={{ ...c.progressFill, width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Pill mode auto×44 ─────────────────────────────────────
function PillMode({ dotColor, currentLine, artistName, trackName, pct, lyricsStatus, trackId }) {
  const text = lyricsStatus === 'synced'
    ? (currentLine || '♪')
    : trackName || 'Nothing playing'

  return (
    <div style={p.wrap}>
      <div style={{ ...p.dot, background: dotColor }} />
      <AnimatePresence mode="wait">
        <motion.span
          key={text}
          style={p.line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
      {artistName && <span style={p.artist}>{artistName}</span>}
      <div style={p.progressWrap}>
        <div style={{ ...p.progressFill, width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Styles ────────────────────────────────────────────────
const inter = "'Inter', sans-serif"

const f = {
  wrap: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 14px 0', position: 'relative' },
  topBar: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexShrink: 0 },
  art: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover', flexShrink: 0 },
  artEmpty: { width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.08)', flexShrink: 0 },
  trackInfo: { flex: 1, minWidth: 0 },
  trackName: { fontFamily: inter, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 },
  artistName: { fontFamily: inter, fontSize: 10, color: 'rgba(255,255,255,0.38)', margin: 0, marginTop: 1 },
  dot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0, transition: 'background 0.3s' },
  lyricsArea: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', padding: '0 8px' },
  skeletonWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  skel: { height: 10, width: '75%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, animation: 'shimmer 1.5s ease-in-out infinite' },
  lyricDim: { fontFamily: inter, fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em', lineHeight: 1.4, margin: 0, width: '100%' },
  lyricMain: { fontFamily: inter, fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.025em', lineHeight: 1.2, margin: 0, textShadow: '0 1px 8px rgba(0,0,0,0.6)', WebkitFontSmoothing: 'antialiased', width: '100%' },
  progressWrap: { height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 0, overflow: 'hidden', marginTop: 'auto', flexShrink: 0 },
  progressFill: { height: '100%', background: 'rgba(255,255,255,0.45)', transition: 'width 0.1s linear' },
}

const c = {
  wrap: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', position: 'relative' },
  dot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.3s' },
  center: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 },
  prev: { fontFamily: inter, fontSize: 10, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 },
  main: { fontFamily: inter, fontSize: 17, fontWeight: 600, color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.025em', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, textShadow: '0 1px 6px rgba(0,0,0,0.5)', WebkitFontSmoothing: 'antialiased' },
  artist: { fontFamily: inter, fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0, maxWidth: 100, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  progressWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', background: 'rgba(255,255,255,0.45)', transition: 'width 0.1s linear' },
}

const p = {
  wrap: { display: 'inline-flex', alignItems: 'center', gap: 9, padding: '0 16px', height: '100%', position: 'relative', maxWidth: '100%' },
  dot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, transition: 'background 0.3s' },
  line: { fontFamily: inter, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', WebkitFontSmoothing: 'antialiased', textShadow: '0 1px 5px rgba(0,0,0,0.5)' },
  artist: { fontFamily: inter, fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', flexShrink: 0 },
  progressWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: '0 0 22px 22px' },
  progressFill: { height: '100%', background: 'rgba(255,255,255,0.45)', transition: 'width 0.1s linear', borderRadius: '0 0 0 22px' },
}
