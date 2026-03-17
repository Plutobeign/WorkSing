import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { MODE_SIZES } from './PlayerWidget'

const CHANNEL = 'worksing-sync'

const THEME_CSS = {
  mountains: `background:linear-gradient(180deg,#1a1033 0%,#3d2060 25%,#e8712a 55%,#f5a623 70%,#fce4b3 88%,#c8d8f0 100%)`,
  floral:    `background:linear-gradient(135deg,#fce4f0 0%,#f9d0e8 40%,#fbeacd 75%,#f5c8e0 100%)`,
  forest:    `background:linear-gradient(180deg,#071a0e 0%,#0d2e18 40%,#133d20 70%,#1a4d28 100%)`,
  ocean:     `background:linear-gradient(180deg,#04131f 0%,#072a45 30%,#0a3d5c 55%,#0f5070 72%,#2080a0 100%)`,
  desert:    `background:linear-gradient(180deg,#1a0a00 0%,#3d1500 18%,#8b2e00 38%,#d4520a 54%,#f5891e 66%,#fbb040 76%,#fce4a0 88%)`,
  sakura:    `background:linear-gradient(180deg,#ffe8f5 0%,#ffd0e8 35%,#fce8c0 70%,#f5d8b0 100%)`,
  nightsky:  `background:linear-gradient(180deg,#020410 0%,#050820 30%,#0a0f35 60%,#0f1845 80%,#152060 100%)`,
  lofi:      `background:linear-gradient(180deg,#0a0805 0%,#15120a 40%,#1e1810 70%,#2a2218 100%)`,
  albumart:  `background:linear-gradient(135deg,#1a1033,#534AB7)`,
}

// Light themes need a dark overlay so white text stays readable
const LIGHT_THEMES = new Set(['floral', 'sakura'])

function buildPipHTML({ currentLine, prevLine, nextLine, trackName, artistName,
                        albumArt, progressMs, durationMs, status, mode, themeId, albumColors }) {
  const pct = durationMs > 0 ? Math.min((progressMs / durationMs) * 100, 100) : 0
  const isLight = LIGHT_THEMES.has(themeId)

  let themeBg = THEME_CSS[themeId] || THEME_CSS.mountains
  if (themeId === 'albumart' && albumColors) {
    const { dr, dg, db, r, g, b } = albumColors
    themeBg = `background:linear-gradient(135deg,rgb(${dr},${dg},${db}),rgb(${Math.round(dr*0.6)},${Math.round(dg*0.6)},${Math.round(db*0.6)}))`
  }

  const lyricLine = status === 'synced'
    ? (currentLine || '♪')
    : status === 'loading' ? 'Loading…'
    : status === 'notFound' ? trackName || '—'
    : trackName || 'Nothing playing'

  const subLine = status === 'synced' && prevLine
    ? prevLine
    : artistName || ''

  if (mode === 'pill') {
    return `
      <div id="bg" style="${themeBg};position:absolute;inset:0;border-radius:22px;overflow:hidden"></div>
      ${isLight ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.38);border-radius:22px;z-index:1"></div>` : ''}
      <div style="position:absolute;inset:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:2;border-radius:22px"></div>
      <div style="position:absolute;inset:0;z-index:3;display:flex;align-items:center;gap:9px;padding:0 16px">
        <div style="width:6px;height:6px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        <span id="lyric" style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.95);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.02em;text-shadow:0 1px 6px rgba(0,0,0,0.7);-webkit-font-smoothing:antialiased">${lyricLine}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.35);white-space:nowrap;flex-shrink:0">${artistName || ''}</span>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4;border-radius:0 0 22px 22px">
        <div id="prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.45);border-radius:0 0 0 22px;transition:width 0.1s linear"></div>
      </div>`
  }

  if (mode === 'compact') {
    return `
      <div id="bg" style="${themeBg};position:absolute;inset:0"></div>
      ${isLight ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.38);z-index:1"></div>` : ''}
      <div style="position:absolute;inset:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:2"></div>
      <div style="position:absolute;inset:0;z-index:3;display:flex;align-items:center;gap:10px;padding:0 14px">
        <div style="width:6px;height:6px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.28);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${subLine}</p>
          <p id="lyric" style="margin:0;font-size:17px;font-weight:600;color:rgba(255,255,255,0.97);letter-spacing:-0.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 6px rgba(0,0,0,0.7);-webkit-font-smoothing:antialiased">${lyricLine}</p>
        </div>
        <span style="font-size:10px;color:rgba(255,255,255,0.3);white-space:nowrap;flex-shrink:0;max-width:100px;overflow:hidden;text-overflow:ellipsis">${artistName || ''}</span>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4">
        <div id="prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.45);transition:width 0.1s linear"></div>
      </div>`
  }

  // Full mode
  return `
    <div id="bg" style="${themeBg};position:absolute;inset:0"></div>
    ${isLight ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.38);z-index:1"></div>` : ''}
    <div style="position:absolute;inset:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:2"></div>
    <div style="position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;padding:10px 14px 0">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;flex-shrink:0">
        ${albumArt ? `<img src="${albumArt}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0" crossorigin="anonymous">` : `<div style="width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.08);flex-shrink:0"></div>`}
        <div style="flex:1;min-width:0">
          <p style="margin:0;font-size:11px;font-weight:500;color:rgba(255,255,255,0.85);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${trackName || '—'}</p>
          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.38)">${artistName || ''}</p>
        </div>
        <div style="width:7px;height:7px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;text-align:center;padding:0 8px">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.28);letter-spacing:-0.01em">${status === 'synced' ? (prevLine || ' ') : ' '}</p>
        <p id="lyric" style="margin:0;font-size:20px;font-weight:600;color:rgba(255,255,255,0.97);letter-spacing:-0.025em;line-height:1.2;text-shadow:0 1px 8px rgba(0,0,0,0.7);-webkit-font-smoothing:antialiased">${lyricLine}</p>
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.28);letter-spacing:-0.01em">${status === 'synced' ? (nextLine || ' ') : ' '}</p>
      </div>
    </div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4">
      <div id="prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.45);transition:width 0.1s linear"></div>
    </div>`
}

export function useFloatOverlay(nowPlaying, lyricsData, currentLineData, mode) {
  const pipRef     = useRef(null)
  const channelRef = useRef(null)
  const { themeId, albumColors } = useTheme()

  // Send updates to PiP window via BroadcastChannel
  const sendUpdate = useCallback((payload) => {
    if (channelRef.current) {
      channelRef.current.postMessage(payload)
    }
  }, [])

  // Update PiP DOM directly (faster than full re-render)
  const updatePip = useCallback((payload) => {
    const pip = pipRef.current
    if (!pip || pip.closed) return

    const lyricEl = pip.document.getElementById('lyric')
    const progEl  = pip.document.getElementById('prog')
    const bgEl    = pip.document.getElementById('bg')

    if (lyricEl) {
      const newText = payload.status === 'synced'
        ? (payload.currentLine || '♪')
        : payload.trackName || 'Nothing playing'
      if (lyricEl.textContent !== newText) lyricEl.textContent = newText
    }

    if (progEl && payload.durationMs > 0) {
      const pct = Math.min((payload.progressMs / payload.durationMs) * 100, 100)
      progEl.style.width = `${pct}%`
    }

    // Update bg if theme changed
    if (bgEl && payload.themeId) {
      let newBg = THEME_CSS[payload.themeId] || THEME_CSS.mountains
      if (payload.themeId === 'albumart' && payload.albumColors) {
        const { dr, dg, db } = payload.albumColors
        newBg = `background:linear-gradient(135deg,rgb(${dr},${dg},${db}),rgb(${Math.round(dr*0.6)},${Math.round(dg*0.6)},${Math.round(db*0.6)}))`
      }
      bgEl.setAttribute('style', `${newBg};position:absolute;inset:0${payload.mode === 'pill' ? ';border-radius:22px;overflow:hidden' : ''}`)
    }
  }, [])

  // Open PiP window
  const openOverlay = useCallback(async () => {
    if (!('documentPictureInPicture' in window)) {
      alert('Floating overlay needs Chrome or Edge 116+.\nPlease open WorkSing in Chrome.')
      return
    }

    // Close existing
    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.close()
    }

    const size = MODE_SIZES[mode] || MODE_SIZES.full

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width:  size.width,
        height: size.height,
        preferInitialWindowPlacement: true,
      })
      pipRef.current = pip

      // Inject Inter font
      const fontLink = pip.document.createElement('link')
      fontLink.rel  = 'stylesheet'
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      pip.document.head.appendChild(fontLink)

      // Base styles
      const style = pip.document.createElement('style')
      style.textContent = `
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Inter',-apple-system,sans-serif; }
        body { overflow:hidden; background:transparent; border-radius:${mode === 'pill' ? '22px' : '14px'}; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        #lyric { animation: fadeIn 0.25s ease-out; }
      `
      pip.document.head.appendChild(style)

      // Render initial content
      pip.document.body.style.cssText = `position:relative;width:100%;height:100%;overflow:hidden;border-radius:${mode === 'pill' ? '22px' : '14px'}`
      pip.document.body.innerHTML = buildPipHTML({
        currentLine:  currentLineData.currentLine,
        prevLine:     currentLineData.prevLine,
        nextLine:     currentLineData.nextLine,
        trackName:    nowPlaying.trackName,
        artistName:   nowPlaying.artistName,
        albumArt:     nowPlaying.albumArt,
        progressMs:   nowPlaying.progressMs,
        durationMs:   nowPlaying.durationMs,
        status:       lyricsData.status,
        mode,
        themeId,
        albumColors,
      })

      // BroadcastChannel for updates
      const ch = new BroadcastChannel(CHANNEL)
      channelRef.current = ch

      ch.onmessage = (e) => updatePip(e.data)

      pip.addEventListener('pagehide', () => {
        ch.close()
        channelRef.current = null
        pipRef.current = null
      })

    } catch (err) {
      console.error('PiP error:', err)
    }
  }, [mode, themeId, albumColors, nowPlaying, lyricsData, currentLineData, updatePip])

  const closeOverlay = useCallback(() => {
    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.close()
    }
  }, [])

  const isOpen = useCallback(() => {
    return pipRef.current && !pipRef.current.closed
  }, [])

  // Broadcast updates every time data changes
  useEffect(() => {
    if (!isOpen()) return
    const payload = {
      currentLine:  currentLineData.currentLine,
      prevLine:     currentLineData.prevLine,
      nextLine:     currentLineData.nextLine,
      trackName:    nowPlaying.trackName,
      artistName:   nowPlaying.artistName,
      albumArt:     nowPlaying.albumArt,
      progressMs:   nowPlaying.progressMs,
      durationMs:   nowPlaying.durationMs,
      status:       lyricsData.status,
      mode,
      themeId,
      albumColors,
    }
    sendUpdate(payload)
  }, [
    currentLineData.currentLine, nowPlaying.progressMs,
    nowPlaying.trackName, lyricsData.status,
    mode, themeId, albumColors,
    sendUpdate, isOpen,
  ])

  return { openOverlay, closeOverlay, isOpen }
}
