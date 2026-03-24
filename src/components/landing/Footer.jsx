import { Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <span style={s.brand}>WorkSing</span>
        <div style={s.links}>
          <a href="#" style={s.link}>About</a>
          <a href="#" style={s.link}>Privacy</a>
          <a
            href="https://github.com/Plutobeign/WorkSing"
            target="_blank"
            rel="noopener noreferrer"
            style={s.ghLink}
          >
            <Github size={15} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer: { padding: '40px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' },
  inner: { maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  brand: { fontFamily: "'Outfit','Inter',sans-serif", fontWeight: 600, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' },
  links: { display: 'flex', alignItems: 'center', gap: 24 },
  link: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Grotesk','Inter',sans-serif", textDecoration: 'none' },
  ghLink: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Space Grotesk','Inter',sans-serif", textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 },
}
