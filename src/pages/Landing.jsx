import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isLoggedIn } from '../utils/spotifyAuth'
import HeroSection    from '../components/landing/HeroSection'
import PreviewSection from '../components/landing/PreviewSection'
import HowItWorks     from '../components/landing/HowItWorks'
import Footer         from '../components/landing/Footer'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn()) navigate('/player')
  }, [navigate])

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")" }}>
      <HeroSection />
      <PreviewSection />
      <HowItWorks />
      <Footer />
    </div>
  )
}
