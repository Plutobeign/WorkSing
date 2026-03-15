import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeCodeForToken, clearTokens } from '../utils/spotifyAuth'

export default function Callback() {
  const navigate = useNavigate()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const error = params.get('error')

    if (error || !code) {
      console.error('Spotify auth error:', error)
      navigate('/')
      return
    }

    exchangeCodeForToken(code)
      .then(() => navigate('/player'))
      .catch((err) => {
        console.error('Token exchange failed:', err)
        clearTokens()
        navigate('/')
      })
  }, [navigate])

  return (
    <div style={styles.wrap}>
      <div style={styles.spinner} />
      <p style={styles.text}>Connecting to Spotify…</p>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0c',
    gap: 16,
  },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    border: '2.5px solid rgba(255,255,255,0.1)',
    borderTopColor: '#1D9E75',
    animation: 'spin 0.7s linear infinite',
  },
  text: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: 400,
  },
}
