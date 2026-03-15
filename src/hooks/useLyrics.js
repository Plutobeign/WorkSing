import { useState, useEffect, useRef } from 'react'

const CACHE_PREFIX = 'ws-lyrics-'
const CACHE_MAX = 50

// ── LRC parser ────────────────────────────────────────────
// Converts "[MM:SS.xx] lyric text" into { timeMs, text }[]
function parseLRC(lrc) {
  const lines = lrc.split('\n')
  const result = []
  const regex = /\[(\d{2}):(\d{2}\.\d+)\](.*)/

  for (const line of lines) {
    const match = line.match(regex)
    if (!match) continue
    const minutes = parseInt(match[1], 10)
    const seconds = parseFloat(match[2])
    const text = match[3].trim()
    if (!text) continue
    const timeMs = (minutes * 60 + seconds) * 1000
    result.push({ timeMs, text })
  }

  return result.sort((a, b) => a.timeMs - b.timeMs)
}

// ── localStorage cache helpers ────────────────────────────
function loadFromCache(trackId) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + trackId)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToCache(trackId, data) {
  try {
    // Evict oldest entries if over limit
    const allKeys = Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX))
      .map(k => ({ key: k, ts: JSON.parse(localStorage.getItem(k))?.cachedAt || 0 }))
      .sort((a, b) => a.ts - b.ts)

    while (allKeys.length >= CACHE_MAX) {
      localStorage.removeItem(allKeys.shift().key)
    }

    localStorage.setItem(
      CACHE_PREFIX + trackId,
      JSON.stringify({ ...data, cachedAt: Date.now() })
    )
  } catch {
    // localStorage full — just skip caching
  }
}

// ── Main hook ─────────────────────────────────────────────
export function useLyrics(trackName, artistName, albumName, trackId) {
  const [state, setState] = useState({
    lines:       [],    // [{ timeMs, text }]
    plainLyrics: null,  // fallback plain text
    status:      'idle' // idle | loading | synced | plain | notFound
  })

  const lastTrackId = useRef(null)

  useEffect(() => {
    // Nothing playing
    if (!trackId || !trackName || !artistName) {
      setState({ lines: [], plainLyrics: null, status: 'idle' })
      return
    }

    // Same track — don't re-fetch
    if (trackId === lastTrackId.current) return
    lastTrackId.current = trackId

    // Check localStorage cache first
    const cached = loadFromCache(trackId)
    if (cached) {
      setState({
        lines:       cached.lines       || [],
        plainLyrics: cached.plainLyrics || null,
        status:      cached.status,
      })
      return
    }

    // Fetch from lrclib
    setState({ lines: [], plainLyrics: null, status: 'loading' })

    const params = new URLSearchParams({
      track_name:  trackName,
      artist_name: artistName,
      album_name:  albumName || '',
    })

    fetch(`https://lrclib.net/api/get?${params}`)
      .then(res => {
        if (res.status === 404) return null
        if (!res.ok) throw new Error('lrclib error')
        return res.json()
      })
      .then(data => {
        if (!data) {
          const result = { lines: [], plainLyrics: null, status: 'notFound' }
          setState(result)
          saveToCache(trackId, result)
          return
        }

        if (data.syncedLyrics) {
          const lines = parseLRC(data.syncedLyrics)
          const result = { lines, plainLyrics: null, status: 'synced' }
          setState(result)
          saveToCache(trackId, result)
          return
        }

        if (data.plainLyrics) {
          const result = { lines: [], plainLyrics: data.plainLyrics, status: 'plain' }
          setState(result)
          saveToCache(trackId, result)
          return
        }

        const result = { lines: [], plainLyrics: null, status: 'notFound' }
        setState(result)
        saveToCache(trackId, result)
      })
      .catch(() => {
        setState({ lines: [], plainLyrics: null, status: 'notFound' })
      })
  }, [trackId, trackName, artistName, albumName])

  return state
}
