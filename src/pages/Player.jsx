import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, clearTokens } from '../utils/spotifyAuth'
import { useNowPlaying }   from '../hooks/useNowPlaying'
import { useLyrics }       from '../hooks/useLyrics'
import { useCurrentLine }  from '../hooks/useCurrentLine'
import PlayerWidget, { MODE_SIZES } from '../components/PlayerWidget'
import ThemeBackground     from '../themes/ThemeBackground'
import { useTheme }        from '../context/ThemeContext'
import { THEMES }          from '../context/ThemeContext'

const MODES = ['full', 'compact', 'pill']

const SWATCH_BG = {
  mountains: 'linear-gradient(135deg,#1a1033,#e8712a)',
  floral:    'linear-gradient(135deg,#fce4f0,#fbeacd)',
  forest:    'linear-gradient(135deg,#071a0e,#133d20)',
  ocean:     'linear-gradient(135deg,#04131f,#1a6b8a)',
  desert:    'linear-gradient(135deg,#1a0a00,#f5891e)',
  sakura:    'linear-gradient(135deg,#ffe8f5,#fce8c0)',
  nightsky:  'linear-gradient(135deg,#020410,#152060)',
  lofi:      'linear-gradient(135deg,#0a0805,#2a2218)',
  albumart:  'linear-gradient(135deg,#534AB7,#1D9E75)',
}

export default function Player() {
  const navigate = useNavigate()
  const { themeId, setTheme, activeTheme } = useTheme()

  const [mode, setMode] = useState(
    () => localStorage.getItem('ws-mode') || 'full'
  )

  useEffect(() => {
    if (!isLoggedIn()) navigate('/')
  }, [navigate])

  const cycleMode = useCallback(() => {
    setMode(prev => {
      const next = MODES[(MODES.indexOf(prev) + 1) % MODES.length]
      localStorage.setItem('ws-mode', next)
      return next
    })
  }, [])

  const cycleTheme = useCallback(() => {
    const ids = THEMES.map(t => t.id)
    const next = ids[(ids.indexOf(themeId) + 1) % ids.length]
    setTheme(next)
  }, [themeId, setTheme])

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'W') { e.preventDefault(); cycleMode() }
      if (e.ctrlKey && e.shiftKey && e.key === 'T') { e.preventDefault(); cycleTheme() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cycleMode, cycleTheme])

  const nowPlaying = useNowPlaying(navigate)
  const { trackName, artistName, albumName, albumArt,
          progressMs, durationMs, isPlaying, trackId, connectionLost } = nowPlaying

  const { lines, plainLyrics, status: lyricsStatus } = useLyrics(
    trackName, artistName, albumName, trackId
  )
  const { prevLine, currentLine, nextLine } = useCurrentLine(lines, progressMs)

  const size = MODE_SIZES[mode]
  const isLightTheme = activeTheme?.textDark

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.logoRow}>
          <div style={s.logoDot} />
          <span style={s.wordmark}>WorkSing</span>
        </div>
        <div style={s.headerRight}>
          <div style={s.modeBtns}>
            {MODES.map(m => (
              <button key={m}
                style={{ ...s.modeBtn, ...(mode === m ? s.modeBtnActive : {}) }}
                onClick={() => { setMode(m); localStorage.setItem('ws-mode', m) }}
              >{m}</button>
            ))}
          </div>
          <button style={s.disconnectBtn} onClick={() => { clearTokens(); navigate('/') }}>
            Disconnect
          </button>
        </div>
      </div>

      <div style={s.stage}>
        <p style={s.hint}>Ctrl+Shift+W — mode &nbsp;·&nbsp; Ctrl+Shift+T — theme</p>

        {/* Widget */}
        <div style={{
          ...s.widgetWrap,
          width: size.width,
          height: size.height,
          borderRadius: mode === 'pill' ? 22 : 14,
        }}>
          <ThemeBackground albumArt={albumArt} />
          <div style={s.blurLayer} />
          <div style={s.widgetInner}>
            <PlayerWidget
              trackName={trackName} artistName={artistName} albumArt={albumArt}
              progressMs={progressMs} durationMs={durationMs}
              isPlaying={isPlaying} trackId={trackId} connectionLost={connectionLost}
              currentLine={currentLine} prevLine={prevLine} nextLine={nextLine}
              lyricsStatus={lyricsStatus}
              mode={mode}
              textDark={isLightTheme}
            />
          </div>
        </div>

        {/* Theme switcher */}
        <div style={s.themeRow}>
          {THEMES.map(t => (
            <button key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.name}
              style={{
                ...s.swatch,
                background: SWATCH_BG[t.id],
                outline: themeId === t.id ? '2px solid #1D9E75' : '2px solid transparent',
                outlineOffset: 2,
              }}
            >
              <span style={{
                fontSize: 9, fontFamily: "'Inter',sans-serif", fontWeight: 500,
                color: t.textDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.85)',
                textShadow: t.textDark ? 'none' : '0 1px 3px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
              }}>{t.name}</span>
            </button>
          ))}
        </div>

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
  modeBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', textTransform: 'capitalize' },
  modeBtnActive: { background: 'rgba(29,158,117,0.15)', border: '0.5px solid #1D9E75', color: '#1D9E75' },
  disconnectBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' },
  stage: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 },
  hint: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.18)' },
  widgetWrap: { position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' },
  blurLayer: { position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' },
  widgetInner: { position: 'absolute', inset: 0 },
  themeRow: { display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 520 },
  swatch: { height: 30, borderRadius: 8, padding: '0 10px', border: 'none', cursor: 'pointer', transition: 'outline 0.15s, transform 0.1s', display: 'flex', alignItems: 'center', justifyContent: 'center' },
}
