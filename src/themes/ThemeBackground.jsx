import Mountains  from './Mountains'
import Floral     from './Floral'
import Forest     from './Forest'
import Ocean      from './Ocean'
import Desert     from './Desert'
import Sakura     from './Sakura'
import NightSky   from './NightSky'
import LoFi       from './LoFi'
import AlbumArt   from './AlbumArt'
import { useTheme } from '../context/ThemeContext'

export default function ThemeBackground({ albumArt }) {
  const { themeId } = useTheme()

  const map = {
    mountains: <Mountains />,
    floral:    <Floral />,
    forest:    <Forest />,
    ocean:     <Ocean />,
    desert:    <Desert />,
    sakura:    <Sakura />,
    nightsky:  <NightSky />,
    lofi:      <LoFi />,
    albumart:  <AlbumArt albumArt={albumArt} />,
  }

  return map[themeId] || <Mountains />
}
