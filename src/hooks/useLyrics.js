import { useState, useEffect, useRef } from 'react'

const CACHE_PREFIX = 'ws-lyrics-'
const CACHE_MAX    = 50

// ── LRC parser ────────────────────────────────────────────
function parseLRC(lrc) {
  const lines  = lrc.split('\n')
  const result = []
  const regex  = /\[(\d{2}):(\d{2}\.\d+)\](.*)/

  for (const line of lines) {
    const match = line.match(regex)
    if (!match) continue
    const minutes = parseInt(match[1], 10)
    const seconds = parseFloat(match[2])
    const text    = match[3].trim()
    if (!text) continue
    result.push({ timeMs: (minutes * 60 + seconds) * 1000, text })
  }

  return result.sort((a, b) => a.timeMs - b.timeMs)
}

// ── Cache helpers ─────────────────────────────────────────
function loadFromCache(trackId) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + trackId)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToCache(trackId, data) {
  try {
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
  } catch { /* localStorage full — skip */ }
}

// ── Source 1: lrclib (synced + plain) ────────────────────
async function fetchLrclib(trackName, artistName, albumName) {
  const params = new URLSearchParams({
    track_name:  trackName,
    artist_name: artistName,
    album_name:  albumName || '',
  })

  const res = await fetch(`https://lrclib.net/api/get?${params}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('lrclib error')

  const data = await res.json()
  if (!data) return null

  if (data.syncedLyrics) {
    return {
      lines:       parseLRC(data.syncedLyrics),
      plainLyrics: null,
      status:      'synced',
      source:      'lrclib',
    }
  }

  if (data.plainLyrics) {
    return {
      lines:       [],
      plainLyrics: data.plainLyrics,
      status:      'plain',
      source:      'lrclib',
    }
  }

  return null
}

// ── Source 2: lyrics.ovh (plain fallback) ────────────────
async function fetchLyricsOvh(trackName, artistName) {
  const artist = encodeURIComponent(artistName)
  const title  = encodeURIComponent(trackName)

  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
  if (!res.ok) return null

  const data = await res.json()
  if (!data.lyrics || data.lyrics.trim().length < 20) return null

  return {
    lines:       [],
    plainLyrics: data.lyrics.trim(),
    status:      'plain',
    source:      'lyrics.ovh',
  }
}

// ── Main hook ─────────────────────────────────────────────
export function useLyrics(trackName, artistName, albumName, trackId) {
  const [state, setState] = useState({
    lines:       [],
    plainLyrics: null,
    status:      'idle',
    source:      null,
  })

  const lastTrackId = useRef(null)

  useEffect(() => {
    if (!trackId || !trackName || !artistName) {
      setState({ lines: [], plainLyrics: null, status: 'idle', source: null })
      return
    }

    if (trackId === lastTrackId.current) return
    lastTrackId.current = trackId

    // Check cache first
    const cached = loadFromCache(trackId)
    if (cached) {
      setState({
        lines:       cached.lines       || [],
        plainLyrics: cached.plainLyrics || null,
        status:      cached.status,
        source:      cached.source      || null,
      })
      return
    }

    setState({ lines: [], plainLyrics: null, status: 'loading', source: null })

    async function fetchAll() {
      try {
        // Try lrclib first
        const lrclibResult = await fetchLrclib(trackName, artistName, albumName)

        if (lrclibResult) {
          setState(lrclibResult)
          saveToCache(trackId, lrclibResult)
          return
        }

        // lrclib had nothing — try lyrics.ovh
        const ovhResult = await fetchLyricsOvh(trackName, artistName)

        if (ovhResult) {
          setState(ovhResult)
          saveToCache(trackId, ovhResult)
          return
        }

        // Both failed
        const notFound = { lines: [], plainLyrics: null, status: 'notFound', source: null }
        setState(notFound)
        saveToCache(trackId, notFound)

      } catch {
        setState({ lines: [], plainLyrics: null, status: 'notFound', source: null })
      }
    }

    fetchAll()
  }, [trackId, trackName, artistName, albumName])

  return state
}
