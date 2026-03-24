import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, clearTokens } from '../utils/spotifyAuth'
import { useNowPlaying }   from '../hooks/useNowPlaying'
import { useLyrics }       from '../hooks/useLyrics'
import { useCurrentLine }  from '../hooks/useCurrentLine'
import PlayerWidget, { MODE_SIZES } from '../components/PlayerWidget'
import ThemeBackground     from '../themes/ThemeBackground'
import { useTheme, THEMES } from '../context/ThemeContext'
import { useFloatOverlay } from '../components/FloatOverlay'

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
  const [mode, setMode]           = useState(() => localStorage.getItem('ws-mode') || 'full')
  const [themeOpen, setThemeOpen] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [opacity, setOpacity]     = useState(() => Number(localStorage.getItem('ws-opacity') || 0))
  const [opacityOpen, setOpacityOpen] = useState(false)
  const dropdownRef  = useRef(null)
  const opacityRef   = useRef(null)

  useEffect(() => { if (!isLoggedIn()) navigate('/') }, [navigate])

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setThemeOpen(false)
      if (opacityRef.current && !opacityRef.current.contains(e.target)) setOpacityOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.altKey && e.key === 'w') {
        e.preventDefault()
        setMode(prev => {
          const next = MODES[(MODES.indexOf(prev) + 1) % MODES.length]
          localStorage.setItem('ws-mode', next)
          return next
        })
      }
      if (e.ctrlKey && e.altKey && e.key === 't') {
        e.preventDefault()
        const ids = THEMES.map(t => t.id)
        setTheme(ids[(ids.indexOf(themeId) + 1) % ids.length])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [themeId, setTheme])

  const nowPlaying = useNowPlaying(navigate, overlayOpen)
  const { trackName, artistName, albumName, albumArt,
          progressMs, durationMs, isPlaying, trackId, connectionLost } = nowPlaying

  const { lines, status: lyricsStatus } = useLyrics(trackName, artistName, albumName, trackId)
  const { prevLine, currentLine, nextLine } = useCurrentLine(lines, progressMs)

  const lyricsData      = { status: lyricsStatus }
  const currentLineData = { currentLine, prevLine, nextLine }

  const { openOverlay, closeOverlay, isOpen } = useFloatOverlay(
    nowPlaying, lyricsData, currentLineData, mode, opacity
  )

  const handleFloat = useCallback(() => {
    if (isOpen()) { closeOverlay(); setOverlayOpen(false) }
    else { openOverlay(); setOverlayOpen(true) }
  }, [isOpen, openOverlay, closeOverlay])

  // Push opacity changes to open overlay
  const handleOpacity = (val) => {
    setOpacity(val)
    localStorage.setItem('ws-opacity', val)
  }

  const size = MODE_SIZES[mode]
  const isLightTheme = activeTheme?.textDark

  return (
    <div style={s.page}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.logoRow}>
          <div style={s.logoDot} />
          <span style={s.wordmark}>WorkSing</span>
        </div>

        <div style={s.headerRight}>

          {/* Mode buttons */}
          <div style={s.modeBtns}>
            {MODES.map(m => (
              <button key={m}
                style={{ ...s.modeBtn, ...(mode === m ? s.modeBtnActive : {}) }}
                onClick={() => { setMode(m); localStorage.setItem('ws-mode', m) }}
              >{m}</button>
            ))}
          </div>

          {/* Theme dropdown */}
          <div style={s.dropWrap} ref={dropdownRef}>
            <button style={s.themeBtn} onClick={() => setThemeOpen(o => !o)}>
              <div style={{ ...s.themeDot, background: SWATCH_BG[themeId] }} />
              <span>{activeTheme?.name || 'Theme'}</span>
              <span style={s.caret}>{themeOpen ? '▲' : '▼'}</span>
            </button>
            {themeOpen && (
              <div style={s.dropdown}>
                {THEMES.map(t => (
                  <button key={t.id}
                    style={{ ...s.dropItem, ...(themeId === t.id ? s.dropItemActive : {}) }}
                    onClick={() => { setTheme(t.id); setThemeOpen(false) }}
                  >
                    <div style={{ ...s.dropSwatch, background: SWATCH_BG[t.id] }} />
                    <span>{t.name}</span>
                    {themeId === t.id && <span style={s.checkmark}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Opacity control */}
          <div style={s.dropWrap} ref={opacityRef}>
            <button style={s.opacityBtn} onClick={() => setOpacityOpen(o => !o)}>
              <span>Transparency {opacity}%</span>
              <span style={s.caret}>{opacityOpen ? '▲' : '▼'}</span>
            </button>
            {opacityOpen && (
              <div style={s.opacityPanel}>
                <p style={s.opacityLabel}>0% = full theme · 100% = see-through</p>
                <div style={s.sliderRow}>
                  <span style={s.sliderHint}>Transparent</span>
                  <input
                    type="range" min="0" max="100" step="1"
                    value={opacity}
                    onChange={e => handleOpacity(Number(e.target.value))}
                    style={s.slider}
                  />
                  <span style={s.sliderHint}>Solid</span>
                </div>
                <div style={s.opacityPreview}>
                  <div style={{
                    ...s.opacityDot,
                    opacity: opacity / 100,
                    background: SWATCH_BG[themeId],
                  }} />
                  <span style={s.opacityValue}>{opacity}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Float button */}
          <button
            style={{ ...s.floatBtn, ...(overlayOpen ? s.floatBtnActive : {}) }}
            onClick={handleFloat}
          >
            {overlayOpen ? '✕ Close overlay' : '⬆ Float overlay'}
          </button>

          {/* Disconnect */}
          <button style={s.disconnectBtn} onClick={() => { clearTokens(); navigate('/') }}>
            Disconnect
          </button>

        </div>
      </div>

      {/* ── Stage ── */}
      <div style={s.stage}>
        <p style={s.hint}>Ctrl+Alt+W — mode &nbsp;·&nbsp; Ctrl+Alt+T — theme</p>

        <div style={{
          ...s.widgetWrap,
          width: size.width,
          height: size.height,
          borderRadius: mode === 'pill' ? 22 : 14,
        }}>
          <ThemeBackground albumArt={albumArt} />
          {isLightTheme && <div style={s.lightOverlay} />}
          <div style={s.blurLayer} />
          <div style={s.widgetInner}>
            <PlayerWidget
              trackName={trackName} artistName={artistName} albumArt={albumArt}
              progressMs={progressMs} durationMs={durationMs}
              isPlaying={isPlaying} trackId={trackId} connectionLost={connectionLost}
              currentLine={currentLine} prevLine={prevLine} nextLine={nextLine}
              lyricsStatus={lyricsStatus} mode={mode} textDark={isLightTheme}
            />
          </div>
        </div>

        <p style={s.overlayHint}>
          {overlayOpen
            ? 'Overlay is floating above your screen — drag it anywhere'
            : 'Click "Float overlay" to pin WorkSing above all your apps'}
        </p>
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
  headerRight: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  modeBtns: { display: 'flex', gap: 4 },
  modeBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', textTransform: 'capitalize' },
  modeBtnActive: { background: 'rgba(29,158,117,0.15)', border: '0.5px solid #1D9E75', color: '#1D9E75' },
  dropWrap: { position: 'relative' },
  themeBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
  themeDot: { width: 12, height: 12, borderRadius: 3, flexShrink: 0 },
  caret: { fontSize: 8, opacity: 0.5 },
  dropdown: { position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 180, background: '#16141a', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' },
  dropItem: { width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Inter',sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'left' },
  dropItemActive: { background: 'rgba(29,158,117,0.12)', color: '#fff' },
  dropSwatch: { width: 20, height: 14, borderRadius: 4, flexShrink: 0 },
  checkmark: { marginLeft: 'auto', color: '#1D9E75', fontSize: 11 },

  opacityBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' },
  opacityPanel: { position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: 220, background: '#16141a', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 14px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' },
  opacityLabel: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10 },
  sliderRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
  sliderHint: { fontFamily: "'Inter',sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.25)', flexShrink: 0 },
  slider: { flex: 1, accentColor: '#1D9E75', cursor: 'pointer' },
  opacityPreview: { display: 'flex', alignItems: 'center', gap: 8 },
  opacityDot: { width: 32, height: 18, borderRadius: 4, transition: 'opacity 0.1s' },
  opacityValue: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' },

  floatBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, padding: '5px 13px', borderRadius: 20, border: '0.5px solid rgba(29,158,117,0.5)', background: 'rgba(29,158,117,0.1)', color: '#1D9E75', cursor: 'pointer', transition: 'all 0.15s' },
  floatBtnActive: { background: 'rgba(239,159,39,0.12)', border: '0.5px solid rgba(239,159,39,0.5)', color: '#EF9F27' },
  disconnectBtn: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', padding: '4px 11px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.08)', background: 'transparent', cursor: 'pointer' },

  stage: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  hint: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.15)' },
  widgetWrap: { position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: '0 8px 40px rgba(0,0,0,0.6)' },
  lightOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1 },
  blurLayer: { position: 'absolute', inset: 0, backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', zIndex: 2 },
  widgetInner: { position: 'absolute', inset: 0, zIndex: 3 },
  overlayHint: { fontFamily: "'Inter',sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center' },
}
