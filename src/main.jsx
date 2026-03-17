import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const style = document.createElement('style')
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.8); opacity: 0; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.35; }
  }
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  @keyframes waveMove {
    0% { transform: translateX(0); }
    100% { transform: translateX(-60px); }
  }
  @keyframes cloudDrift {
    0% { transform: translateX(0); }
    100% { transform: translateX(30px); }
  }
  @keyframes petalSway {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
`
document.head.appendChild(style)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
