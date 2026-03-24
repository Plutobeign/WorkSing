import { useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { MODE_SIZES } from './PlayerWidget'

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

function buildHTML({ currentLine, prevLine, nextLine, trackName, artistName,
                     albumArt, progressMs, durationMs, status, themeId,
                     albumColors, mode, opacity }) {
  const pct      = durationMs > 0 ? Math.min((progressMs / durationMs) * 100, 100) : 0
  const bg       = getThemeBg(themeId, albumColors)
  const isLight  = LIGHT_THEMES.has(themeId)
  const bgOpacity = 1 - ((opacity ?? 0) / 100)
  const br       = mode === 'pill' ? '22px' : '14px'

  const lyric = status === 'synced' ? (currentLine || '♪')
    : status === 'loading' ? 'Loading…'
    : status === 'notFound' ? (trackName || '—')
    : (trackName || 'Nothing playing')

  const prev = status === 'synced' ? (prevLine || '\u00a0') : '\u00a0'
  const next = status === 'synced' ? (nextLine || '\u00a0') : '\u00a0'

  const artHtml = albumArt
    ? `<img id="ws-art" src="${albumArt}" style="width:26px;height:26px;border-radius:6px;object-fit:cover;flex-shrink:0" crossorigin="anonymous">`
    : `<div style="width:26px;height:26px;border-radius:6px;background:rgba(255,255,255,0.1);flex-shrink:0"></div>`

  const darkOverlay = isLight
    ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.42);z-index:1;border-radius:${br}"></div>`
    : ''

  const blurDiv = `<div style="position:absolute;inset:0;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);z-index:2;border-radius:${br}"></div>`

  let content = ''

  if (mode === 'pill') {
    content = `
      <div style="position:absolute;inset:0;z-index:3;display:flex;align-items:center;gap:9px;padding:0 14px">
        <div style="width:6px;height:6px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        <span id="ws-lyric" style="flex:1;font-size:14px;font-weight:600;color:rgba(255,255,255,0.96);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-0.02em;text-shadow:0 1px 6px rgba(0,0,0,0.9);-webkit-font-smoothing:antialiased">${lyric}</span>
        <span style="font-size:10px;color:rgba(255,255,255,0.35);white-space:nowrap;flex-shrink:0">${artistName || ''}</span>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4;border-radius:0 0 22px 22px">
        <div id="ws-prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.5)"></div>
      </div>`

  } else if (mode === 'compact') {
    content = `
      <div style="position:absolute;inset:0;z-index:3;display:flex;align-items:center;gap:10px;padding:0 14px">
        ${artHtml}
        <div style="flex:1;min-width:0">
          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${prev}</p>
          <p id="ws-lyric" style="margin:0;font-size:17px;font-weight:600;color:rgba(255,255,255,0.97);letter-spacing:-0.025em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 6px rgba(0,0,0,0.9);-webkit-font-smoothing:antialiased">${lyric}</p>
        </div>
        <span style="font-size:10px;color:rgba(255,255,255,0.3);white-space:nowrap;flex-shrink:0;max-width:90px;overflow:hidden;text-overflow:ellipsis">${artistName || ''}</span>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.08);z-index:4">
        <div id="ws-prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.5)"></div>
      </div>`

  } else {
    // Full mode
    content = `
      <div style="position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;padding:10px 14px 0">
        <div style="display:flex;align-items:center;gap:9px;flex-shrink:0;margin-bottom:4px">
          ${artHtml}
          <div style="flex:1;min-width:0">
            <p style="margin:0;font-size:11px;font-weight:500;color:rgba(255,255,255,0.88);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${trackName || '—'}</p>
            <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.4)">${artistName || ''}</p>
          </div>
          <div style="width:7px;height:7px;border-radius:50%;background:#1D9E75;flex-shrink:0"></div>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:5px;padding:0 6px">
          <p id="ws-prev" style="margin:0;font-size:12px;font-weight:400;color:rgba(255,255,255,0.28);letter-spacing:-0.01em;line-height:1.4;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${prev}</p>
          <p id="ws-lyric" style="margin:0;font-size:20px;font-weight:600;color:rgba(255,255,255,0.97);letter-spacing:-0.025em;line-height:1.2;text-shadow:0 1px 8px rgba(0,0,0,0.9);-webkit-font-smoothing:antialiased;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${lyric}</p>
          <p id="ws-next" style="margin:0;font-size:12px;font-weight:400;color:rgba(255,255,255,0.28);letter-spacing:-0.01em;line-height:1.4;width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${next}</p>
        </div>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.1);z-index:4">
        <div id="ws-prog" style="height:100%;width:${pct}%;background:rgba(255,255,255,0.5)"></div>
      </div>`
  }

  return `
    <div id="ws-bg" style="position:absolute;inset:0;background:${bg};opacity:${bgOpacity};border-radius:${br}"></div>
    ${darkOverlay}
    ${blurDiv}
    ${content}
  `
}

export function useFloatOverlay(nowPlaying, lyricsData, currentLineData, mode, opacity = 0) {
  const pipRef     = useRef(null)
  const payloadRef = useRef({})
  const { themeId, albumColors } = useTheme()

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
      mode, themeId, albumColors, opacity,
    }
  })

  // Push updates to PiP DOM on every change
  useEffect(() => {
    const pip = pipRef.current
    if (!pip || pip.closed) return

    const p = payloadRef.current
    const pct = p.durationMs > 0 ? Math.min((p.progressMs / p.durationMs) * 100, 100) : 0

    const lyric = p.status === 'synced' ? (p.currentLine || '♪')
      : p.status === 'loading' ? 'Loading…'
      : p.status === 'notFound' ? (p.trackName || '—')
      : (p.trackName || 'Nothing playing')

    // Lyric with fade on change
    const lyricEl = pip.document.getElementById('ws-lyric')
    if (lyricEl && lyricEl.textContent !== lyric) {
      lyricEl.style.transition = 'opacity 0.15s ease, transform 0.2s ease'
      lyricEl.style.opacity = '0'
      lyricEl.style.transform = 'translateY(5px)'
      setTimeout(() => {
        if (!pip.closed) {
          lyricEl.textContent = lyric
          lyricEl.style.opacity = '1'
          lyricEl.style.transform = 'translateY(0)'
        }
      }, 120)
    }

    // Prev / next
    const prevEl = pip.document.getElementById('ws-prev')
    const nextEl = pip.document.getElementById('ws-next')
    if (prevEl) prevEl.textContent = p.status === 'synced' ? (p.prevLine || '\u00a0') : '\u00a0'
    if (nextEl) nextEl.textContent = p.status === 'synced' ? (p.nextLine || '\u00a0') : '\u00a0'

    // Progress bar
    const progEl = pip.document.getElementById('ws-prog')
    if (progEl) progEl.style.width = `${pct}%`

    // Background + opacity
    const bgEl = pip.document.getElementById('ws-bg')
    if (bgEl) {
      bgEl.style.background = getThemeBg(p.themeId, p.albumColors)
      bgEl.style.opacity = String(1 - ((p.opacity ?? 0) / 100))
    }

    // Album art
    const artEl = pip.document.getElementById('ws-art')
    if (artEl && p.albumArt && artEl.src !== p.albumArt) artEl.src = p.albumArt

  }, [
    currentLineData.currentLine,
    currentLineData.prevLine,
    currentLineData.nextLine,
    nowPlaying.progressMs,
    nowPlaying.trackName,
    nowPlaying.albumArt,
    lyricsData.status,
    themeId, albumColors, opacity,
  ])

  const openOverlay = useCallback(async () => {
    if (!('documentPictureInPicture' in window)) {
      alert('Floating overlay needs Chrome 116+.\nOpen WorkSing in Chrome.')
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

      // Inject Inter font
      const link = pip.document.createElement('link')
      link.rel  = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap'
      pip.document.head.appendChild(link)

      // Full CSS reset — kills the white background
      const style = pip.document.createElement('style')
      style.textContent = `
        html, body {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden;
          background: transparent !important;
          font-family: 'Inter', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        * { box-sizing: border-box; }
      `
      pip.document.head.appendChild(style)

      pip.document.body.style.cssText =
        'position:relative;width:100%;height:100%;overflow:hidden;background:transparent;'

      pip.document.body.innerHTML = buildHTML(payloadRef.current)

      pip.addEventListener('pagehide', () => { pipRef.current = null })

    } catch (err) {
      console.error('PiP error:', err)
    }
  }, [mode])

  const closeOverlay = useCallback(() => {
    if (pipRef.current && !pipRef.current.closed) {
      pipRef.current.close()
      pipRef.current = null
    }
  }, [])

  const isOpen = useCallback(() => !!(pipRef.current && !pipRef.current.closed), [])

  return { openOverlay, closeOverlay, isOpen }
}
