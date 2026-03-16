import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, clearTokens } from '../utils/spotifyAuth'
import { useNowPlaying } from '../hooks/useNowPlaying'
import { useLyrics } from '../hooks/useLyrics'
import { useCurrentLine } from '../hooks/useCurrentLine'
import PlayerWidget, { MODE_SIZES } from '../components/PlayerWidget'

const MODES = ['full', 'compact', 'pill']

export default function Player() {
  const navigate = useNavigate()
  const [mode, setMode] = useState(
    () => localStorage.getItem('ws-mode') || 'full'
  )

  useEffect(() => {
    if (!isLoggedIn()) navigate('/')
  }, [navigate])

  // Cycle modes with Ctrl+Shift+L
  const cycleMode = useCallback(() => {
    setMode(prev => {
      const next = MODES[(MODES.indexOf(prev) + 1) % MODES.length]
      localStorage.setItem('ws-mode', next)
      return next
    })
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault()
        cycleMode()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cycleMode])

  const nowPlaying = useNowPlaying(navigate)
  const { trackName, artistName, albumName, albumArt,
          progressMs, durationMs, isPlaying, trackId, connectionLost } = nowPlaying

  const { lines, plainLyrics, status: lyricsStatus } = useLyrics(
    trackName, artistName, albumName, trackId
  )
  const { prevLine, currentLine, nextLine } = useCurrentLine(lines, progressMs)

  const size = MODE_SIZES[mode]

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.logoRow}>
          <div style={s.logoDot} />
          <span style={s.wordmark}>WorkSing</span>
        </div>
        <div style={s.headerRight}>
          {/* Mode toggle buttons */}
          <div style={s.modeBtns}>
            {MODES.map(m => (
              <button
                key={m}
                style={{ ...s.modeBtn, ...(mode === m ? s.modeBtnActive : {}) }}
                onClick={() => { setMode(m); localStorage.setItem('ws-mode', m) }}
              >
                {m}
              </button>
            ))}
          </div>
          <button style={s.disconnectBtn} onClick={() => { clearTokens(); navigate('/') }}>
            Disconnect
          </button>
        </div>
      </div>

      {/* Widget preview area */}
      <div style={s.stage}>
        <p style={s.hint}>Ctrl+Shift+L to cycle modes</p>

        {/* Widget container — matches real overlay dimensions */}
        <div style={{
          ...s.widgetWrap,
          width:  size.width,
          height: size.height,
          borderRadius: mode === 'pill' ? 22 : 14,
        }}>
          {/* Dark bg for preview */}
          <div style={s.widgetBg} />
          {/* Blur layer */}
          <div style={s.blurLayer} />
          {/* The actual widget */}
          <div style={s.widgetInner}>
            <PlayerWidget
              trackName={trackName}
              artistName={artistName}
              albumArt={albumArt}
              progressMs={progressMs}
              durationMs={durationMs}
              isPlaying={isPlaying}
              trackId={trackId}
              connectionLost={connectionLost}
              currentLine={currentLine}
              prevLine={prevLine}
              nextLine={nextLine}
              lyricsStatus={lyricsStatus}
              mode={mode}
            />
          </div>
        </div>

        {/* Size label */}
        <p style={s.sizeLabel}>{size.width} × {size.height}px — {mode} mode</p>
      </div>

    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0a0c', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 10 },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8 },
  logoDot: { width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' },
  wordmark: { fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: '-0.03em', color: '#fff' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  modeBtns: { display: 'flex', gap: 4 },
  modeBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize' },
  modeBtnActive: { background: 'rgba(29,158,117,0.15)', border: '0.5px solid #1D9E75', color: '#1D9E75' },
  disconnectBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' },
  stage: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 14 },
  hint: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.01em' },
  widgetWrap: { position: 'relative', overflow: 'hidden', transition: 'width 0.3s ease, height 0.3s ease, border-radius 0.3s ease', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' },
  widgetBg: { position: 'absolute', inset: 0, background: 'rgba(10,10,14,0.78)' },
  blurLayer: { position: 'absolute', inset: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' },
  widgetInner: { position: 'absolute', inset: 0 },
  sizeLabel: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.15)' },
}
