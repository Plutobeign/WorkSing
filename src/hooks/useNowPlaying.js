import { useState, useEffect, useRef, useCallback } from 'react'
import { spotifyFetch, clearTokens } from '../utils/spotifyAuth'

const POLL_INTERVAL = 1000      // ms between API calls
const RETRY_INTERVAL = 5000     // ms between retries when connection lost

export function useNowPlaying(navigate) {
  const [state, setState] = useState({
    trackName:      null,
    artistName:     null,
    albumName:      null,
    albumArt:       null,
    progressMs:     0,
    durationMs:     0,
    isPlaying:      false,
    trackId:        null,
    connectionLost: false,
  })

  // Refs so callbacks always see latest values without re-creating
  const stateRef        = useRef(state)
  const rafRef          = useRef(null)
  const pollTimerRef    = useRef(null)
  const lastFrameRef    = useRef(null)
  const isPlayingRef    = useRef(false)
  const connectionRef   = useRef(false)
  const mountedRef      = useRef(true)

  stateRef.current    = state
  isPlayingRef.current = state.isPlaying
  connectionRef.current = state.connectionLost

  // ── Smooth RAF ticker ─────────────────────────────────────
  // Increments progressMs every frame while playing
  // so lyrics feel smooth instead of jumping every second
  const startTicker = useCallback(() => {
    if (rafRef.current) return
    lastFrameRef.current = performance.now()

    const tick = (now) => {
      if (!mountedRef.current) return
      if (!isPlayingRef.current) {
        rafRef.current = null
        return
      }
      const delta = now - (lastFrameRef.current || now)
      lastFrameRef.current = now
      setState(prev => ({
        ...prev,
        progressMs: Math.min(prev.progressMs + delta, prev.durationMs),
      }))
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const stopTicker = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastFrameRef.current = null
  }, [])

  // ── API poll ──────────────────────────────────────────────
  const poll = useCallback(async () => {
    try {
      const res = await spotifyFetch('/me/player/currently-playing')

      // 401 — token dead, kick to login
      if (res.status === 401) {
        clearTokens()
        navigate('/')
        return
      }

      // 204 — nothing playing
      if (res.status === 204) {
        stopTicker()
        setState(prev => ({
          ...prev,
          isPlaying:      false,
          trackName:      null,
          artistName:     null,
          albumName:      null,
          albumArt:       null,
          trackId:        null,
          progressMs:     0,
          durationMs:     0,
          connectionLost: false,
        }))
        return
      }

      if (!res.ok) return

      const data = await res.json()
      if (!data || !data.item) return

      const track    = data.item
      const trackId  = track.id
      const isPlaying = data.is_playing
      const progressMs = data.progress_ms ?? 0
      const durationMs = track.duration_ms ?? 0
      const trackName  = track.name
      const artistName = track.artists?.map(a => a.name).join(', ') ?? ''
      const albumName  = track.album?.name ?? ''
      const albumArt   = track.album?.images?.[0]?.url ?? null

      setState(prev => ({
        ...prev,
        trackName,
        artistName,
        albumName,
        albumArt,
        progressMs,   // re-sync from API on every poll
        durationMs,
        isPlaying,
        trackId,
        connectionLost: false,
      }))

      // Start or stop the RAF ticker based on play state
      if (isPlaying) {
        startTicker()
      } else {
        stopTicker()
      }

    } catch (err) {
      // Network error — show reconnecting state
      if (!connectionRef.current) {
        setState(prev => ({ ...prev, connectionLost: true, isPlaying: false }))
        stopTicker()
      }
    }
  }, [navigate, startTicker, stopTicker])

  // ── Polling loop ──────────────────────────────────────────
  const schedulePoll = useCallback(() => {
    clearTimeout(pollTimerRef.current)
    const interval = connectionRef.current ? RETRY_INTERVAL : POLL_INTERVAL
    pollTimerRef.current = setTimeout(async () => {
      if (!mountedRef.current) return
      await poll()
      schedulePoll()
    }, interval)
  }, [poll])

  // ── Visibility change ─────────────────────────────────────
  // Pause polling when tab is hidden to save API calls
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        clearTimeout(pollTimerRef.current)
        stopTicker()
      } else {
        poll().then(schedulePoll)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [poll, schedulePoll, stopTicker])

  // ── Mount / unmount ───────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true
    poll().then(schedulePoll)

    return () => {
      mountedRef.current = false
      clearTimeout(pollTimerRef.current)
      stopTicker()
    }
  }, [poll, schedulePoll, stopTicker])

  return state
}
