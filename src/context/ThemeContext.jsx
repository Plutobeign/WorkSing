import { createContext, useContext, useState } from 'react'

export const THEMES = [
  { id: 'mountains',  name: 'Mountains',      textDark: false },
  { id: 'floral',     name: 'Floral',         textDark: true  },
  { id: 'forest',     name: 'Forest',         textDark: false },
  { id: 'ocean',      name: 'Ocean',          textDark: false },
  { id: 'desert',     name: 'Desert Sunset',  textDark: false },
  { id: 'sakura',     name: 'Cherry Blossom', textDark: true  },
  { id: 'nightsky',   name: 'Night Sky',      textDark: false },
  { id: 'lofi',       name: 'Lo-Fi Rain',     textDark: false },
  { id: 'albumart',   name: 'Album Art',      textDark: false },
]

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem('ws-theme') || 'mountains'
  )
  const [albumColors, setAlbumColors] = useState(null)

  function setTheme(id) {
    setThemeId(id)
    localStorage.setItem('ws-theme', id)
  }

  const activeTheme = THEMES.find(t => t.id === themeId) || THEMES[0]

  return (
    <ThemeContext.Provider value={{ themeId, setTheme, activeTheme, albumColors, setAlbumColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
