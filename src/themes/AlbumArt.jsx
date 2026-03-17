import { useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'

export function extractAlbumColors(imageUrl, callback) {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 10
      canvas.height = 10
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 10, 10)

      const samples = [
        ctx.getImageData(1, 1, 1, 1).data,
        ctx.getImageData(8, 1, 1, 1).data,
        ctx.getImageData(1, 8, 1, 1).data,
        ctx.getImageData(8, 8, 1, 1).data,
        ctx.getImageData(5, 5, 1, 1).data,
      ]

      const avg = samples.reduce(
        (acc, d) => ({ r: acc.r + d[0], g: acc.g + d[1], b: acc.b + d[2] }),
        { r: 0, g: 0, b: 0 }
      )
      const r = Math.round(avg.r / samples.length)
      const g = Math.round(avg.g / samples.length)
      const b = Math.round(avg.b / samples.length)

      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      const isDark = luminance < 0.45

      // Darken for overlay bg
      const dr = Math.round(r * 0.35)
      const dg = Math.round(g * 0.35)
      const db = Math.round(b * 0.35)

      callback({ r, g, b, dr, dg, db, isDark, luminance })
    } catch {
      callback(null)
    }
  }
  img.onerror = () => callback(null)
  img.src = imageUrl
}

export default function AlbumArt({ albumArt }) {
  const { albumColors, setAlbumColors } = useTheme()

  useEffect(() => {
    if (!albumArt) return
    extractAlbumColors(albumArt, (colors) => {
      if (colors) setAlbumColors(colors)
    })
  }, [albumArt, setAlbumColors])

  if (!albumColors) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1a1033 0%, #3d2060 25%, #e8712a 55%, #fce4b3 100%)' }} />
    )
  }

  const { dr, dg, db, r, g, b } = albumColors

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, rgb(${dr},${dg},${db}) 0%, rgb(${Math.round(dr*0.7)},${Math.round(dg*0.7)},${Math.round(db*0.7)}) 60%, rgb(${Math.round(dr*0.5)},${Math.round(dg*0.5)},${Math.round(db*1.2 > 255 ? 255 : db*1.2)}) 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 30% 50%, rgba(${r},${g},${b},0.25) 0%, transparent 70%)`,
      }} />
    </div>
  )
}
