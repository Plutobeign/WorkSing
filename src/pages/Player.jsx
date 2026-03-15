import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn, clearTokens } from '../utils/spotifyAuth'
import { useNowPlaying } from '../hooks/useNowPlaying'

export default function Player() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn()) navigate('/')
  }, [navigate])

  const {
    trackName,
    artistName,
    albumArt,
    progressMs,
    durationMs,
    isPlaying,
    trackId,
    connectionLost,
  } = useNowPlaying(navigate)

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

  return (
    <div style={s.wrap}>
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

          <div style={s.statusRow}>
            <div style={{ ...s.statusDot, background: dotColor }} />
            <span style={s.statusLabel}>{dotLabel}</span>
          </div>

          <div style={s.trackRow}>
            {albumArt ? (
              <img src={albumArt} alt="Album art" style={s.art} />
            ) : (
              <div style={s.artPlaceholder} />
            )}
            <div style={s.trackInfo}>
              <p style={s.trackName}>{trackName || '—'}</p>
              <p style={s.artistName}>{artistName || 'No track playing'}</p>
            </div>
          </div>

          <div style={s.progressWrap}>
            <div style={{ ...s.progressFill, width: `${pct}%` }} />
          </div>
          <div style={s.timeRow}>
            <span style={s.timeText}>{fmt(progressMs)}</span>
            <span style={s.timeText}>{fmt(durationMs)}</span>
          </div>

          <div style={s.confirmBox}>
            <p style={s.confirmTitle}>Step 2 working</p>
            <p style={s.confirmSub}>
              trackId: <code style={s.code}>{trackId ?? 'null — play something in Spotify'}</code>
            </p>
            <p style={s.confirmSub}>
              progressMs: <code style={s.code}>{Math.round(progressMs)}</code>
              {' '}— counts up smoothly between polls
            </p>
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
  card: { width: '100%', maxWidth: 480, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 },
  statusDot: { width: 8, height: 8, borderRadius: '50%', transition: 'background 0.3s' },
  statusLabel: { fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)' },
  trackRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 },
  art: { width: 56, height: 56, borderRadius: 8, objectFit: 'cover', flexShrink: 0 },
  artPlaceholder: { width: 56, height: 56, borderRadius: 8, background: 'rgba(255,255,255,0.06)', flexShrink: 0 },
  trackInfo: { flex: 1, minWidth: 0 },
  trackName: { fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 },
  artistName: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  progressWrap: { height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', background: '#1D9E75', borderRadius: 2, transition: 'width 0.1s linear' },
  timeRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 24 },
  timeText: { fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.25)', fontVariantNumeric: 'tabular-nums' },
  confirmBox: { background: 'rgba(29,158,117,0.08)', border: '0.5px solid rgba(29,158,117,0.2)', borderRadius: 10, padding: '12px 14px' },
  confirmTitle: { fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: '#1D9E75', marginBottom: 6 },
  confirmSub: { fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 },
  code: { fontFamily: "'Courier New', monospace", fontSize: 10.5, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: 4 },
}
