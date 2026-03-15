import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, clearTokens } from '../utils/spotifyAuth'
import { useNowPlaying } from '../hooks/useNowPlaying'
import { useLyrics } from '../hooks/useLyrics'
import { useCurrentLine } from '../hooks/useCurrentLine'

export default function Player() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn()) navigate('/')
  }, [navigate])

  const {
    trackName,
    artistName,
    albumName,
    albumArt,
    progressMs,
    durationMs,
    isPlaying,
    trackId,
    connectionLost,
  } = useNowPlaying(navigate)

  const { lines, plainLyrics, status } = useLyrics(
    trackName, artistName, albumName, trackId
  )

  const { prevLine, currentLine, nextLine } = useCurrentLine(lines, progressMs)

  function handleDisconnect() {
    clearTokens()
    navigate('/')
  }

  const pct = durationMs > 0 ? (progressMs / durationMs) * 100 : 0

  function fmt(ms) {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const sec = String(s % 60).padStart(2, '0')
    return `${m}:${sec}`
  }

  const dotColor = connectionLost
    ? '#EF9F27'
    : isPlaying
    ? '#1D9E75'
    : '#444441'

  const dotLabel = connectionLost
    ? 'Reconnecting…'
    : isPlaying
    ? 'Playing'
    : trackId
    ? 'Paused'
    : 'Nothing playing'

  // Status badge for lyrics
  const lyricsBadge = {
    idle:     { text: 'Nothing playing',       color: '#444441' },
    loading:  { text: 'Loading lyrics…',       color: '#EF9F27' },
    synced:   { text: 'Lyrics synced',         color: '#1D9E75' },
    plain:    { text: 'No sync available',     color: '#EF9F27' },
    notFound: { text: 'Lyrics not available',  color: '#888780' },
  }[status] || { text: '', color: '#444441' }

  return (
    <div style={s.wrap}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.logoRow}>
          <div style={s.dot} />
          <span style={s.wordmark}>WorkSing</span>
        </div>
        <button style={s.disconnectBtn} onClick={handleDisconnect}>
          Disconnect
        </button>
      </div>

      <div style={s.content}>
        <div style={s.card}>

          {/* Status row */}
          <div style={s.statusRow}>
            <div style={{ ...s.statusDot, background: dotColor }} />
            <span style={s.statusLabel}>{dotLabel}</span>
            <div style={{ ...s.lyricsBadge, background: lyricsBadge.color + '22', color: lyricsBadge.color }}>
              {lyricsBadge.text}
            </div>
          </div>

          {/* Track info */}
          <div style={s.trackRow}>
            {albumArt
              ? <img src={albumArt} alt="Album" style={s.art} />
              : <div style={s.artPlaceholder} />
            }
            <div style={s.trackInfo}>
              <p style={s.trackName}>{trackName || '—'}</p>
              <p style={s.artistName}>{artistName || 'No track playing'}</p>
            </div>
          </div>

          {/* Lyrics display */}
          <div style={s.lyricsBox}>
            {status === 'loading' && (
              <div style={s.lyricsLoading}>
                <div style={s.skeleton} />
                <div style={{ ...s.skeleton, width: '70%', marginTop: 8 }} />
              </div>
            )}

            {status === 'synced' && (
              <div style={s.lyricsCenter}>
                <p style={s.lyricPrev}>{prevLine || ''}</p>
                <p style={s.lyricCurrent}>{currentLine || '♪'}</p>
                <p style={s.lyricNext}>{nextLine || ''}</p>
              </div>
            )}

            {status === 'plain' && (
              <div style={s.plainWrap}>
                <p style={s.plainBadge}>Plain lyrics — no timestamp sync</p>
                <p style={s.plainText}>{plainLyrics?.slice(0, 300)}…</p>
              </div>
            )}

            {status === 'notFound' && trackId && (
              <p style={s.notFound}>No lyrics found for this track</p>
            )}

            {status === 'idle' && (
              <p style={s.notFound}>Play something in Spotify</p>
            )}
          </div>

          {/* Progress bar */}
          <div style={s.progressWrap}>
            <div style={{ ...s.progressFill, width: `${pct}%` }} />
          </div>
          <div style={s.timeRow}>
            <span style={s.timeText}>{fmt(progressMs)}</span>
            <span style={s.timeText}>{fmt(durationMs)}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight: '100vh', background: '#0a0a0c', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.06)' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: '50%', background: '#1D9E75' },
  wordmark: { fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600, letterSpacing: '-0.03em', color: '#ffffff' },
  disconnectBtn: { fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', padding: '5px 12px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.1)', background: 'transparent', cursor: 'pointer' },
  content: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { width: '100%', maxWidth: 520, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  statusDot: { width: 8, height: 8, borderRadius: '50%', transition: 'background 0.3s', flexShrink: 0 },
  statusLabel: { fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', flex: 1 },
  lyricsBadge: { fontFamily: "'Inter', sans-serif", fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 500 },
  trackRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 },
  art: { width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  artPlaceholder: { width: 52, height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.06)', flexShrink: 0 },
  trackInfo: { flex: 1, minWidth: 0 },
  trackName: { fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 },
  artistName: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  lyricsBox: { minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, padding: '0 8px' },
  lyricsLoading: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  skeleton: { height: 14, width: '85%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, animation: 'shimmer 1.5s ease-in-out infinite' },
  lyricsCenter: { width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 },
  lyricPrev: { fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em', lineHeight: 1.4, minHeight: 20 },
  lyricCurrent: { fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 600, color: 'rgba(255,255,255,0.97)', letterSpacing: '-0.02em', lineHeight: 1.25, textShadow: '0 1px 8px rgba(0,0,0,0.5)', WebkitFontSmoothing: 'antialiased' },
  lyricNext: { fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.28)', letterSpacing: '-0.01em', lineHeight: 1.4, minHeight: 20 },
  plainWrap: { width: '100%', textAlign: 'center' },
  plainBadge: { fontFamily: "'Inter', sans-serif", fontSize: 10, color: '#EF9F27', marginBottom: 8 },
  plainText: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, textAlign: 'left' },
  notFound: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.25)', textAlign: 'center' },
  progressWrap: { height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', background: '#1D9E75', borderRadius: 2, transition: 'width 0.1s linear' },
  timeRow: { display: 'flex', justifyContent: 'space-between' },
  timeText: { fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', fontVariantNumeric: 'tabular-nums' },
}
