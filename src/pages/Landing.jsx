import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { redirectToSpotifyLogin, isLoggedIn } from '../utils/spotifyAuth'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn()) navigate('/player')
  }, [navigate])

  return (
    <div style={styles.wrap}>
      <div style={styles.center}>

        {/* Logo dot */}
        <div style={styles.logoRow}>
          <div style={styles.dot} />
          <div style={styles.dotPulse} />
        </div>

        {/* Wordmark */}
        <h1 style={styles.wordmark}>WorkSing</h1>

        {/* Tagline */}
        <p style={styles.tagline}>Karaoke mode. For people who work.</p>

        {/* Connect button */}
        <button style={styles.btn} onClick={redirectToSpotifyLogin}>
          <SpotifyIcon />
          Connect Spotify
        </button>

        {/* Footer note */}
        <p style={styles.footnote}>
          Free · No backend · Chrome overlay support
        </p>
      </div>
    </div>
  )
}

function SpotifyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ flexShrink: 0 }}
    >
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 50% 40%, #0f1a14 0%, #0a0a0c 70%)',
  },
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
    textAlign: 'center',
    padding: '0 24px',
  },
  logoRow: {
    position: 'relative',
    width: 12,
    height: 12,
    marginBottom: 28,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#1D9E75',
    position: 'absolute',
    top: 1,
    left: 1,
    zIndex: 1,
  },
  dotPulse: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: 'rgba(29, 158, 117, 0.25)',
    position: 'absolute',
    top: 0,
    left: 0,
    animation: 'pulse 2s ease-in-out infinite',
  },
  wordmark: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 38,
    fontWeight: 600,
    letterSpacing: '-0.04em',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 1,
  },
  tagline: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 15,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.52)',
    marginBottom: 40,
    letterSpacing: '-0.01em',
  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '13px 28px',
    borderRadius: 50,
    background: '#1D9E75',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    border: 'none',
    transition: 'opacity 0.15s, transform 0.1s',
    marginBottom: 20,
  },
  footnote: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: '0.01em',
  },
}
