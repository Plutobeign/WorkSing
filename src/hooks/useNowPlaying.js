import { useState, useEffect, useRef, useCallback } from 'react'
import { spotifyFetch, clearTokens } from '../utils/spotifyAuth'

const POLL_NORMAL    = 1000
const POLL_FAST      = 200
const FAST_DURATION  = 4000
const RETRY_DELAY    = 3000

export function useNowPlaying(navigate, overlayOpen = false) {
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

  const rafRef          = useRef(null)
  const pollTimerRef    = useRef(null)
  const lastFrameRef    = useRef(null)
  const mountedRef      = useRef(true)
  const fastModeRef     = useRef(false)
  const fastModeTimer   = useRef(null)
  const lastTrackIdRef  = useRef(null)
  const isPlayingRef    = useRef(false)
  const connLostRef     = useRef(false)
  const overlayOpenRef  = useRef(overlayOpen)

  // Keep overlayOpenRef in sync
  useEffect(() => {
    overlayOpenRef.current = overlayOpen
  }, [overlayOpen])

  const enterFastMode = useCallback(() => {
    fastModeRef.current = true
    clearTimeout(fastModeTimer.current)
    fastModeTimer.current = setTimeout(() => {
      fastModeRef.current = false
    }, FAST_DURATION)
  }, [])

  const stopTicker = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastFrameRef.current = null
  }, [])

  const startTicker = useCallback(() => {
    if (rafRef.current) return
    lastFrameRef.current = performance.now()

    const tick = (now) => {
      if (!mountedRef.current) return
      if (!isPlayingRef.current) { rafRef.current = null; return }
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

  const poll = useCallback(async () => {
    try {
      const res = await spotifyFetch('/me/player/currently-playing')

      if (res.status === 401) { clearTokens(); navigate('/'); return }

      if (res.status === 204) {
        stopTicker()
        isPlayingRef.current = false
        setState(prev => ({
          ...prev,
          isPlaying: false, trackName: null, artistName: null,
          albumName: null, albumArt: null, trackId: null,
          progressMs: 0, durationMs: 0, connectionLost: false,
        }))
        return
      }

      if (!res.ok) return

      const data = await res.json()
      if (!data || !data.item) return

      const track      = data.item
      const trackId    = track.id
      const isPlaying  = data.is_playing
      const progressMs = data.progress_ms ?? 0
      const durationMs = track.duration_ms ?? 0
      const trackName  = track.name
      const artistName = track.artists?.map(a => a.name).join(', ') ?? ''
      const albumName  = track.album?.name ?? ''
      const albumArt   = track.album?.images?.[0]?.url ?? null

      if (trackId !== lastTrackIdRef.current) {
        lastTrackIdRef.current = trackId
        enterFastMode()
      }

      if (connLostRef.current) {
        connLostRef.current = false
        enterFastMode()
      }

      isPlayingRef.current = isPlaying

      setState(prev => ({
        ...prev,
        trackName, artistName, albumName, albumArt,
        progressMs, durationMs, isPlaying, trackId,
        connectionLost: false,
      }))

      if (isPlaying) startTicker()
      else stopTicker()

    } catch {
      if (!connLostRef.current) {
        connLostRef.current = true
        isPlayingRef.current = false
        stopTicker()
        setState(prev => ({ ...prev, connectionLost: true, isPlaying: false }))
      }
    }
  }, [navigate, startTicker, stopTicker, enterFastMode])

  const schedulePoll = useCallback(() => {
    clearTimeout(pollTimerRef.current)
    const interval = connLostRef.current ? RETRY_DELAY
      : fastModeRef.current ? POLL_FAST
      : POLL_NORMAL

    pollTimerRef.current = setTimeout(async () => {
      if (!mountedRef.current) return
      await poll()
      schedulePoll()
    }, interval)
  }, [poll])

  // Visibility change — only pause if overlay is NOT open
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && !overlayOpenRef.current) {
        // Tab hidden and no overlay — pause to save API calls
        clearTimeout(pollTimerRef.current)
        stopTicker()
      } else if (!document.hidden) {
        // Tab visible again — resume with fast mode
        enterFastMode()
        poll().then(schedulePoll)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [poll, schedulePoll, stopTicker, enterFastMode])

  // When overlay opens while tab is hidden — restart polling immediately
  useEffect(() => {
    if (overlayOpen && document.hidden) {
      enterFastMode()
      poll().then(schedulePoll)
    }
  }, [overlayOpen, poll, schedulePoll, enterFastMode])

  useEffect(() => {
    mountedRef.current = true
    poll().then(schedulePoll)
    return () => {
      mountedRef.current = false
      clearTimeout(pollTimerRef.current)
      clearTimeout(fastModeTimer.current)
      stopTicker()
    }
  }, [poll, schedulePoll, stopTicker])

  return state
}
