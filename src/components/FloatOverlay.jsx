import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { MODE_SIZES } from './PlayerWidget'

const CHANNEL = 'worksing-sync'

const LIGHT_THEMES = new Set(['floral', 'sakura'])

const THEME_BG = {
  mountains: 'linear-gradient(180deg,#1a1033 0%,#3d2060 25%,#e8712a 55%,#f5a623 70%,#fce4b3 88%,#c8d8f0 100%)',
  floral:    'linear-gradient(135deg,#fce4f0 0%,#f9d0e8 40%,#fbeacd 75%,#f5c8e0 100%)',
  forest:    'linear-gradient(180deg,#071a0e 0%,#0d2e18 40%,#133d20 70%,#1a4d28 100%)',
  ocean:     'linear-gradient(180deg,#04131f 0%,#072a45 30%,#0a3d5c 55%,#0f5070 72%,#2080a0 100%)',
  desert:    'linear-gradient(180deg,#1a0a00 0%,#3d1500 18%,#8b2e00 38%,#d4520a 54%,#f5891e 66%,#fbb040 76%,#fce4a0 88%)',
  sakura:    'linear-gradient(180deg,#ffe8f5 0%,#ffd0e8 35%,#fce8c0 70%,#f5d8b0 100%)',
  nightsky:  'linear-gradient(180deg,#020410 0%,#050820 30%,#0a0f35 60%,#0f1845 80%,#152060 100%)',
  lofi:      'linear-gradient(180deg,#0a0805 0%,#15120a 40%,#1e1810 70%,#2a2218 100%)',
  albumart:  'linear-gradient(135deg,#1a1033,#534AB7)',
}

function getThemeBg(themeId, albumColors) {
  if (themeId === 'albumart' && albumColors) {
    const { dr, dg, db } = albumColors
    return `linear-gradient(135deg,rgb(${dr},${dg},${db}),rgb(${Math.round(dr*0.6)},${Math.round(dg*0.6)},${Math.round(db*0.6)}))`
  }
  return THEME_BG[themeId] || THEME_BG.mountains
}

function renderPipContent(pip, payload) {
  const { currentLine, prevLine, nextLine, trackName, artistName,
          albumArt, progressMs, durationMs, status, mode, themeId, albumColors } = payload

  const pct = durationMs > 0 ? Math.min((progressMs / durationMs) * 100, 100) : 0
  const isLight = LIGHT_THEMES.has(themeId)
  const bg = getThemeBg(themeId, albumColors)
  const br = mode === 'pill' ? '22px' : '14px'

  const lyric = status === 'synced'
    ? (currentLine || '♪')
    : status === 'loading' ? 'Loading…'
    : status === 'notFound' ? (trackName || '—')
    : (trackName || 'Nothing playing')

  const darkOverlay = isLight
    ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);z-index:1;border-radius:${br}"></div>`
    : ''

  const blurDiv = `<div style="position:absolute;inset:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:2;border-radius:${br}"></div>`

  let inner = ''

  if (mode === 'pill') {
    inner = `
      <div style="position:absolute;inset:0;z-index:3;display:flex;align-items:center;gap:9px;padding:0 16px">
        <div style="width:6px;height:6px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        <span id="ws-lyric" style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.95);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.02em;text-shadow:0 1px 6px rgba(0,0,0,0.8);-webkit-font-smoothing:antialiased">${lyric}</span>
        <span style="font-size:11px;color:rgba(255,255,255,0.35);white-space:nowrap;flex-shrink:0">${artistName || ''}</span>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4;border-radius:0 0 22px 22px">
        <div id="ws-prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.5);border-radius:0 0 0 22px"></div>
      </div>`
  } else if (mode === 'compact') {
    inner = `
      <div style="position:absolute;inset:0;z-index:3;display:flex;align-items:center;gap:10px;padding:0 14px">
        <div style="width:6px;height:6px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        <div style="flex:1;min-width:0">
          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${status === 'synced' ? (prevLine || ' ') : ' '}</p>
          <p id="ws-lyric" style="margin:0;font-size:17px;font-weight:600;color:rgba(255,255,255,0.97);letter-spacing:-0.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 6px rgba(0,0,0,0.8);-webkit-font-smoothing:antialiased">${lyric}</p>
        </div>
        <span style="font-size:10px;color:rgba(255,255,255,0.3);white-space:nowrap;flex-shrink:0">${artistName || ''}</span>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4">
        <div id="ws-prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.5)"></div>
      </div>`
  } else {
    // full
    const artHtml = albumArt
      ? `<img src="${albumArt}" style="width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0" crossorigin="anonymous">`
      : `<div style="width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.08);flex-shrink:0"></div>`

    inner = `
      <div style="position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;padding:10px 14px 4px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-shrink:0">
          ${artHtml}
          <div style="flex:1;min-width:0">
            <p style="margin:0;font-size:11px;font-weight:500;color:rgba(255,255,255,0.88);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${trackName || '—'}</p>
            <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.4)">${artistName || ''}</p>
          </div>
          <div style="width:7px;height:7px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;text-align:center;padding:0 4px">
          <p id="ws-prev" style="margin:0;font-size:12px;color:rgba(255,255,255,0.28);letter-spacing:-0.01em;line-height:1.3">${status === 'synced' ? (prevLine || '\u00a0') : '\u00a0'}</p>
          <p id="ws-lyric" style="margin:0;font-size:20px;font-weight:600;color:rgba(255,255,255,0.97);letter-spacing:-0.025em;line-height:1.2;text-shadow:0 1px 8px rgba(0,0,0,0.8);-webkit-font-smoothing:antialiased">${lyric}</p>
          <p id="ws-next" style="margin:0;font-size:12px;color:rgba(255,255,255,0.28);letter-spacing:-0.01em;line-height:1.3">${status === 'synced' ? (nextLine || '\u00a0') : '\u00a0'}</p>
        </div>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4">
        <div id="ws-prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.5)"></div>
      </div>`
  }

  pip.document.body.innerHTML = `
    <div id="ws-bg" style="position:absolute;inset:0;background:${bg};border-radius:${br}"></div>
    ${darkOverlay}
    ${blurDiv}
    ${inner}
  `
}

export function useFloatOverlay(nowPlaying, lyricsData, currentLineData, mode) {
  const pipRef    = useRef(null)
  const { themeId, albumColors } = useTheme()
  const payloadRef = useRef({})

  // Always keep payloadRef current
  useEffect(() => {
    payloadRef.current = {
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
  })

  // Push updates to open PiP window directly
  useEffect(() => {
    const pip = pipRef.current
    if (!pip || pip.closed) return

    const payload = payloadRef.current
    const pct = payload.durationMs > 0
      ? Math.min((payload.progressMs / payload.durationMs) * 100, 100)
      : 0

    // Update lyric text
    const lyricEl = pip.document.getElementById('ws-lyric')
    if (lyricEl) {
      const newText = payload.status === 'synced'
        ? (payload.currentLine || '♪')
        : (payload.trackName || 'Nothing playing')
      if (lyricEl.textContent !== newText) {
        lyricEl.style.opacity = '0'
        lyricEl.style.transform = 'translateY(4px)'
        lyricEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
        setTimeout(() => {
          lyricEl.textContent = newText
          lyricEl.style.opacity = '1'
          lyricEl.style.transform = 'translateY(0)'
        }, 50)
      }
    }

    // Update prev / next lines (full mode)
    const prevEl = pip.document.getElementById('ws-prev')
    const nextEl = pip.document.getElementById('ws-next')
    if (prevEl && payload.status === 'synced') prevEl.textContent = payload.prevLine || '\u00a0'
    if (nextEl && payload.status === 'synced') nextEl.textContent = payload.nextLine || '\u00a0'

    // Update progress bar
    const progEl = pip.document.getElementById('ws-prog')
    if (progEl) progEl.style.width = `${pct}%`

    // Update background if theme changed
    const bgEl = pip.document.getElementById('ws-bg')
    if (bgEl) {
      const newBg = getThemeBg(payload.themeId, payload.albumColors)
      bgEl.style.background = newBg
    }

  }, [
    currentLineData.currentLine,
    currentLineData.prevLine,
    currentLineData.nextLine,
    nowPlaying.progressMs,
    nowPlaying.trackName,
    nowPlaying.artistName,
    lyricsData.status,
    themeId,
    albumColors,
  ])

  const openOverlay = useCallback(async () => {
    if (!('documentPictureInPicture' in window)) {
      alert('Floating overlay needs Chrome 116+.\nPlease open WorkSing in Chrome.')
      return
    }

    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.close()
      pipRef.current = null
      return
    }

    const size = MODE_SIZES[mode] || MODE_SIZES.full

    try {
      const pip = await window.documentPictureInPicture.requestWindow({
        width:  size.width,
        height: size.height,
        preferInitialWindowPlacement: true,
      })
      pipRef.current = pip

      // Inject Inter font + base styles
      const link = pip.document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      pip.document.head.appendChild(link)

      const style = pip.document.createElement('style')
      style.textContent = `
        *{margin:0;padding:0;box-sizing:border-box;font-family:'Inter',-apple-system,sans-serif;}
        body{overflow:hidden;width:100%;height:100%;position:relative;}
      `
      pip.document.head.appendChild(style)

      pip.document.body.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;'

      // Render initial content
      renderPipContent(pip, payloadRef.current)

      pip.addEventListener('pagehide', () => {
        pipRef.current = null
      })

    } catch (err) {
      console.error('PiP failed:', err)
    }
  }, [mode])

  const closeOverlay = useCallback(() => {
    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.close()
      pipRef.current = null
    }
  }, [])

  const isOpen = useCallback(() => {
    return !!(pipRef.current && !pipRef.current.closed)
  }, [])

  return { openOverlay, closeOverlay, isOpen }
}
