import { useState, useEffect, useRef } from 'react'
import './index.css'

/* ─── useInView hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ─── Fade-in wrapper ─── */
function Reveal({ children, delay = 0, direction = 'up', style = {} }) {
  const [ref, inView] = useInView()
  const transforms = { up: 'translateY(36px)', left: 'translateX(-36px)', right: 'translateX(36px)', none: 'none' }
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : transforms[direction],
      transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ─── Typewriter ─── */
function Typewriter({ words, speed = 75, pause = 1800 }) {
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const w = words[wi]
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(w.slice(0, ci + 1))
        if (ci + 1 === w.length) setTimeout(() => setDel(true), pause)
        else setCi(ci + 1)
      } else {
        setDisplay(w.slice(0, ci - 1))
        if (ci - 1 === 0) { setDel(false); setWi((wi + 1) % words.length); setCi(0) }
        else setCi(ci - 1)
      }
    }, del ? speed / 2 : speed)
    return () => clearTimeout(t)
  }, [ci, del, wi, words, speed, pause])
  return (
    <span>
      {display}
      <span style={{ borderRight: '2px solid #6366f1', animation: 'blink 1s step-end infinite' }}>&nbsp;</span>
    </span>
  )
}

/* ─── Particles ─── */
function Particles() {
  const pts = useRef(Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 3 + 1,
    dur: Math.random() * 7 + 5,
    delay: Math.random() * 4,
  }))).current
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.55)',
          animation: `float ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  )
}

/* ─── CountUp ─── */
function CountUp({ target, suffix = '', duration = 1600 }) {
  const [ref, inView] = useInView()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let v = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      v += step
      if (v >= target) { setN(target); clearInterval(timer) }
      else setN(Math.floor(v))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target, duration])
  return <span ref={ref}>{n}{suffix}</span>
}

/* ─── Pill tag ─── */
function Pill({ label, accent }) {
  const [h, setH] = useState(false)
  return (
    <span
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-block', padding: '4px 12px', borderRadius: 20,
        fontSize: 12, fontWeight: 600,
        background: h ? (accent ? '#6366f1' : '#e0e7ff') : (accent ? '#eef2ff' : '#f1f5f9'),
        color: h ? (accent ? '#fff' : '#6366f1') : (accent ? '#6366f1' : '#475569'),
        border: `1px solid ${h ? '#6366f1' : accent ? '#c7d2fe' : '#e2e8f0'}`,
        transform: h ? 'translateY(-2px) scale(1.05)' : 'none',
        transition: 'all .2s ease', cursor: 'default',
      }}
    >{label}</span>
  )
}

/* ─── Project card ─── */
function ProjectCard({ p, delay }) {
  const [ref, inView] = useInView()
  const [h, setH] = useState(false)
  return (
    <div
      ref={ref}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: '#fff', borderRadius: 20,
        border: `1.5px solid ${h ? '#6366f1' : '#e2e8f0'}`,
        padding: '26px 26px 20px',
        display: 'flex', flexDirection: 'column', gap: 14,
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(36px)',
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms, border-color .3s, box-shadow .3s`,
        boxShadow: h ? '0 20px 56px rgba(99,102,241,0.14)' : '0 2px 14px rgba(0,0,0,0.05)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: p.gradient,
        opacity: h ? 1 : 0.5,
        transition: 'opacity .3s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <span style={{ fontSize: 22 }}>{p.emoji}</span>
            {p.badges?.map(b => (
              <span key={b.label} style={{
                padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: b.bg, color: b.color, border: `1px solid ${b.border}`,
                letterSpacing: '.05em', textTransform: 'uppercase',
              }}>{b.label}</span>
            ))}
          </div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a', fontFamily: 'Fraunces, Georgia, serif' }}>{p.name}</h3>
          {p.company && <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginTop: 2 }}>{p.company}</div>}
        </div>
        {p.link && (
          <a href={p.link} target="_blank" rel="noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34, borderRadius: 9, background: '#f1f5f9',
            border: '1px solid #e2e8f0', fontSize: 15, flexShrink: 0,
            transition: 'all .2s', color: '#475569',
            transform: h ? 'scale(1.1) rotate(-5deg)' : 'none',
          }}>↗</a>
        )}
      </div>

      <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{p.desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
        {p.stack.map(s => <Pill key={s} label={s} accent />)}
      </div>
    </div>
  )
}

/* ─── Timeline item ─── */
function TimelineItem({ item, isLast, delay }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      display: 'flex', gap: 20,
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateX(-28px)',
      transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          border: '3px solid #e0e7ff', flexShrink: 0, marginTop: 4,
          boxShadow: '0 0 0 4px rgba(99,102,241,0.12)',
        }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: '#e0e7ff', margin: '6px 0' }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 32, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', fontWeight: 500 }}>{item.period}</span>
          {item.current && (
            <span style={{
              padding: '1px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
              background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0',
            }}>● EN COURS</span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 2, fontFamily: 'Fraunces, Georgia, serif' }}>{item.role}</div>
        <div style={{ fontSize: 13, color: '#6366f1', fontWeight: 600, marginBottom: 8 }}>{item.company}</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{item.desc}</div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMove = e => setCursor({ x: e.clientX, y: e.clientY, visible: true })
    const onLeave = () => setCursor(c => ({ ...c, visible: false }))
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave) }
  }, [])

  const navLinks = [
    { id: 'about', label: 'À propos' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Expériences' },
    { id: 'projects', label: 'Projets' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ]

  const projects = [
    {
      emoji: '🏥', name: 'NavinMed', company: 'NavinSpire IA · Startup française · Remote',
      desc: "Application web intelligente d'aide à la pratique médicale pour médecins et dentistes. Système d'aide à la décision clinique, gestion des consultations et génération automatique de résumés médicaux via IA.",
      stack: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'Python 3.11', 'Tailwind CSS', 'PostgreSQL'],
      gradient: 'linear-gradient(90deg,#6366f1,#3b82f6)',
      badges: [
        { label: 'PFE', bg: '#dbeafe', color: '#2563eb', border: '#bfdbfe' },
        { label: 'En cours', bg: '#dcfce7', color: '#16a34a', border: '#bbf7d0' },
      ],
    },
    {
      emoji: '🌾', name: 'WIE EMPOWER',
      desc: "Plateforme IA + IoT pour la sécurité des femmes agricultrices. Détection de risques GPS via bracelets connectés, boutique d'outils agricoles. Primée 🥉 3ème place WIE ACT Technical Challenge.",
      stack: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind', 'IoT/GPS', 'AI', 'Vercel'],
      gradient: 'linear-gradient(90deg,#f59e0b,#ef4444)',
      link: 'https://wie-act-4-0.vercel.app',
      badges: [
        { label: '🥉 3ème Place', bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
        { label: 'WIE ACT 4.0', bg: '#fce7f3', color: '#be185d', border: '#fbcfe8' },
      ],
    },
    {
      emoji: '🌿', name: 'HarvestHer',
      desc: 'Système IoT & IA pour améliorer la sécurité et le bien-être des femmes agricultrices. Capteurs terrain + modèles ML pour détecter des risques environnementaux et envoyer des alertes en temps réel. · Remote',
      stack: ['Python', 'IoT', 'AI / ML', 'Sensors'],
      gradient: 'linear-gradient(90deg,#10b981,#06b6d4)',
      badges: [],
    },
    {
      emoji: '🧠', name: 'AI Mental Health Classification',
      desc: 'Pipeline ML pour classifier des posts de forums santé mentale en 5 catégories (dépression, anxiété, PTSD, relations, automutilation). Compétition Kaggle avec NLP avancé.',
      stack: ['Python', 'Scikit-learn', 'NLTK', 'NLP', 'Pandas', 'Kaggle'],
      gradient: 'linear-gradient(90deg,#8b5cf6,#ec4899)',
      badges: [{ label: 'Kaggle', bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' }],
    },
    {
      emoji: '💬', name: 'TalkSpot', company: 'SWConsulting · Stage',
      desc: 'Plateforme de communication interne full-stack responsive pour centraliser les données employés et améliorer la collaboration. Développé durant le stage chez SWConsulting.',
      stack: ['React.js', 'Node.js', 'Full-Stack'],
      gradient: 'linear-gradient(90deg,#06b6d4,#6366f1)',
      badges: [{ label: 'Stage', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }],
    },
  ]

  const skills = [
    { cat: 'Langages', items: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'SQL'], accent: true },
    { cat: 'Web Development', items: ['React.js', 'Next.js 15', 'Node.js', 'FastAPI', 'Tailwind CSS', 'PostgreSQL', 'MongoDB'], accent: true },
    { cat: 'ML & Data Science', items: ['Machine Learning', 'Scikit-learn', 'NLTK', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'], accent: false },
    { cat: 'Cloud & DevOps', items: ['AWS', 'Git', 'GitHub', 'Vercel', 'IoT'], accent: false },
    { cat: 'Outils & Design', items: ['VS Code', 'IntelliJ', 'Figma', 'Canva', 'Photoshop', 'Jira'], accent: false },
  ]

  const experiences = [
    {
      period: 'Fév 2025 → Juin 2025', current: true,
      role: 'Développeuse Full-Stack — PFE',
      company: 'NavinSpire IA · Startup française · Télétravail',
      desc: 'Développement de NavinMed — application intelligente d\'aide médicale. Stack Next.js 15 + FastAPI. Architecture modulaire avec endpoints REST médicaux, proxy API, aide à la décision clinique.',
    },
    {
      period: 'Juin 2025 → Juil 2025',
      role: 'Stagiaire Développement Web',
      company: 'SWConsulting · Monastir, Tunisie',
      desc: 'Développement de TalkSpot, plateforme de communication interne scalable (React.js + Node.js).',
    },
    {
      period: 'Juin 2024 → Août 2024',
      role: 'Stagiaire IT',
      company: 'SEBN-TN · Jendouba, Tunisie',
      desc: 'Support infrastructure IT, maintenance réseaux et systèmes ERP SAP en environnement industriel.',
    },
  ]

  const certs = [
    { title: 'AWS Academy Graduate — Cloud Developing', issuer: 'Amazon Web Services', date: 'Déc 2025', icon: '☁️', color: '#FF9900' },
    { title: 'AWS Academy Graduate — Cloud Foundations', issuer: 'Amazon Web Services', date: 'Nov 2025', icon: '☁️', color: '#FF9900' },
    { title: 'Introduction to Data Science', issuer: 'Cisco Networking Academy', date: 'Août 2025', icon: '📊', color: '#1BA0D7' },
  ]

  const SH = { fontFamily: 'Fraunces, Georgia, serif' }

  const SectionHeader = ({ eyebrow, title }) => (
    <Reveal style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 6 }}>
        <div style={{ width: 4, height: 30, borderRadius: 2, background: 'linear-gradient(180deg,#6366f1,#8b5cf6)' }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: '.12em', textTransform: 'uppercase' }}>{eyebrow}</span>
      </div>
      <h2 style={{ ...SH, fontSize: 'clamp(1.7rem,3vw,2.6rem)', fontWeight: 700 }}>{title}</h2>
    </Reveal>
  )

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>

      {/* Custom cursor */}
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        left: cursor.x - 12, top: cursor.y - 12,
        width: 24, height: 24, borderRadius: '50%',
        border: '2px solid #6366f1',
        opacity: cursor.visible ? 0.55 : 0,
        transition: 'left .07s, top .07s, opacity .2s',
      }} />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.93)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #e2e8f0' : 'none',
        transition: 'all .3s',
        padding: '0 clamp(1rem,4vw,3rem)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="#home" style={{ ...SH, fontSize: 22, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CG</a>
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} style={{
                padding: '6px 13px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                color: '#64748b', transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#6366f1'; e.currentTarget.style.background = '#eef2ff' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' }}
              >{l.label}</a>
            ))}
            <a href="mailto:chifaguesmi9@gmail.com" style={{
              marginLeft: 8, padding: '8px 18px', borderRadius: 20,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.35)' }}
            >Me contacter</a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg,#f8fafc 0%,#eef2ff 50%,#faf5ff 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '6rem clamp(1rem,4vw,3rem) 4rem',
      }}>
        <Particles />
        <div style={{ position: 'absolute', top: '8%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.10),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '8%', left: '3%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(139,92,246,0.08),transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
          <div>
            {/* Available badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 100, fontSize: 12, fontWeight: 600, color: '#16a34a',
              background: '#fff', border: '1.5px solid #bbf7d0',
              boxShadow: '0 2px 12px rgba(22,163,74,0.12)',
              marginBottom: 28, animation: 'pulseRing 2.5s infinite',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'blink 1.5s infinite' }} />
              Disponible · Ouverte aux stages &amp; collaborations · Remote ✓
            </div>

            <h1 style={{
              ...SH, fontWeight: 900,
              fontSize: 'clamp(2.6rem,5vw,4.4rem)',
              lineHeight: 1.08, marginBottom: 14,
              animation: 'fadeUp .7s .1s ease both',
            }}>
              Bonjour, je suis<br />
              <span className="hero-gradient-text">Chifa Guesmi</span>
            </h1>

            <div style={{
              fontSize: 'clamp(.95rem,1.6vw,1.2rem)', color: '#64748b',
              minHeight: 34, marginBottom: 24,
              animation: 'fadeUp .7s .25s ease both',
            }}>
              <Typewriter words={[
                'Étudiante en Informatique @ ISIMM',
                'Développeuse Full-Stack',
                'Passionnée IA & IoT',
                'Vice-Présidente IEEE WIE',
                'Jeune Chercheuse UNICEF',
              ]} />
            </div>

            <p style={{
              fontSize: 15, color: '#64748b', lineHeight: 1.8, maxWidth: 500, marginBottom: 34,
              animation: 'fadeUp .7s .4s ease both',
            }}>
              Je construis des solutions intelligentes qui ont un <strong style={{ color: '#0f172a' }}>impact réel</strong> — de l'IA médicale aux systèmes IoT pour l'agriculture, en passant par des apps full-stack modernes.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', animation: 'fadeUp .7s .55s ease both' }}>
              <a href="#projects" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 26px', borderRadius: 14,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.35)' }}
              >🚀 Voir mes projets</a>

              {/* CV Download */}
              <a href="/Chifa_Guesmi_CV.pdf" download style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 26px', borderRadius: 14,
                background: '#fff', color: '#0f172a', fontWeight: 700, fontSize: 14,
                border: '1.5px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0,0,0,0.07)',
                transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a' }}
              >⬇️ Télécharger CV</a>
            </div>

            {/* Socials */}
            <div style={{ display: 'flex', gap: 10, marginTop: 26, animation: 'fadeUp .7s .7s ease both' }}>
              {[
                { href: 'https://github.com/chifaguesmi', label: 'GitHub', icon: '⌥' },
                { href: 'https://linkedin.com/in/chifaguesmi', label: 'LinkedIn', icon: 'in' },
                { href: 'mailto:chifaguesmi9@gmail.com', label: 'Email', icon: '✉' },
              ].map(s => (
                <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  title={s.label}
                  style={{
                    width: 40, height: 40, borderRadius: 10, background: '#fff',
                    border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 15, color: '#475569',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.1)'; e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569' }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Photo + stats */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 220, height: 220, borderRadius: '50%',
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
                padding: 4, boxShadow: '0 20px 60px rgba(99,102,241,0.28)',
                animation: 'spin 14s linear infinite',
              }}>
                <div style={{
                  width: '100%', height: '100%', borderRadius: '50%',
                  background: '#fff', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'spinReverse 14s linear infinite',
                }}>
                  <img
                    src="/profile.jpg"
                    alt="Chifa Guesmi"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                    onError={e => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.insertAdjacentHTML('afterend', '<span style="font-family:Fraunces,serif;font-size:4rem;font-weight:900;background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent">CG</span>')
                    }}
                  />
                </div>
              </div>
              <div style={{
                position: 'absolute', bottom: -8, right: -10,
                background: '#fff', border: '2px solid #e0e7ff', borderRadius: 12,
                padding: '5px 11px', boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
                fontSize: 11, fontWeight: 700, color: '#6366f1',
              }}>🎓 ISIMM</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: 210 }}>
              {[{ n: 5, s: '+', l: 'Projets' }, { n: 3, s: '', l: 'Certs' }, { n: 2, s: '', l: 'Stages' }, { n: 4, s: '', l: 'Langues' }].map(s => (
                <div key={s.l} style={{
                  background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14,
                  padding: '11px 8px', textAlign: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                  <div style={{ ...SH, fontSize: 22, fontWeight: 900, color: '#6366f1' }}>
                    <CountUp target={s.n} suffix={s.s} />
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '5rem clamp(1rem,4vw,3rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader eyebrow="À propos" title="Qui suis-je ?" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            <Reveal delay={100}>
              <div style={{ background: '#fff', borderRadius: 20, padding: 30, border: '1.5px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.85, marginBottom: 14 }}>
                  Étudiante passionnée en <strong style={{ color: '#0f172a' }}>Licence Informatique à l'ISIMM</strong>, je construis des solutions intelligentes à l'intersection de l'IA, de l'IoT et du développement web.
                </p>
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.85 }}>
                  Engagée dans la communauté tech : <strong style={{ color: '#0f172a' }}>Vice-Présidente IEEE Women in Engineering</strong> et jeune chercheuse sur un projet en partenariat avec l'<strong style={{ color: '#0f172a' }}>UNICEF</strong>.
                </p>
              </div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '📧', label: 'Email', value: 'chifaguesmi9@gmail.com', href: 'mailto:chifaguesmi9@gmail.com' },
                { icon: '📞', label: 'Téléphone', value: '+216 95 51 42 73', href: 'tel:+21695514273' },
                { icon: '🎓', label: 'Formation', value: 'Licence CS · ISIMM · 2023–présent' },
                { icon: '🌍', label: 'Langues', value: 'Arabe · Français C1 · Anglais B2 · Espagnol A1' },
                { icon: '📍', label: 'Localisation', value: 'Monastir, Tunisie · Remote ✓' },
              ].map((item, i) => (
                <Reveal key={item.label} delay={100 + i * 60}>
                  <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18, width: 28, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em' }}>{item.label}</div>
                      {item.href
                        ? <a href={item.href} style={{ fontSize: 13, fontWeight: 500, color: '#6366f1' }}>{item.value}</a>
                        : <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{item.value}</div>
                      }
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: '5rem clamp(1rem,4vw,3rem)', background: 'linear-gradient(135deg,#eef2ff,#faf5ff)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader eyebrow="Compétences" title="Stack technique" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {skills.map((cat, i) => (
              <Reveal key={cat.cat} delay={i * 70}>
                <div style={{ background: '#fff', borderRadius: 16, padding: '18px 22px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>{cat.cat}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {cat.items.map(s => <Pill key={s} label={s} accent={cat.accent} />)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: '5rem clamp(1rem,4vw,3rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader eyebrow="Expériences" title="Parcours professionnel" />
          <div style={{ maxWidth: 680 }}>
            {experiences.map((e, i) => (
              <TimelineItem key={i} item={e} isLast={i === experiences.length - 1} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: '5rem clamp(1rem,4vw,3rem)', background: 'linear-gradient(135deg,#f8fafc,#eef2ff)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader eyebrow="Projets" title="Réalisations clés" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: 18 }}>
            {projects.map((p, i) => <ProjectCard key={p.name} p={p} delay={i * 70} />)}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section id="certifications" style={{ padding: '5rem clamp(1rem,4vw,3rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader eyebrow="Certifications" title="Formations" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 16 }}>
            {certs.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 18, padding: '22px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${c.color},transparent)` }} />
                  <div style={{ fontSize: 30, flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a', marginBottom: 4, lineHeight: 1.4 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{c.issuer}</div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: c.color, fontWeight: 600 }}>{c.date}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section style={{ padding: '5rem clamp(1rem,4vw,3rem)', background: 'linear-gradient(135deg,#faf5ff,#eef2ff)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader eyebrow="Leadership" title="Engagement & Impact" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 18 }}>
            {[
              { emoji: '⚡', title: 'Vice-Présidente — IEEE WIE', org: 'ISIMM Student Branch', desc: 'Promotion des femmes dans les STEM, organisation d\'événements, recrutement et gestion des membres de la section étudiante.' },
              { emoji: '🌍', title: 'Jeune Chercheuse — Projet PAR', org: 'Partenariat UNICEF · Jendouba', desc: 'Solutions technologiques à impact social pour les communautés locales, en collaboration avec l\'UNICEF.' },
            ].map((l, i) => (
              <Reveal key={l.title} delay={i * 120}>
                <div style={{ background: '#fff', borderRadius: 20, padding: '26px 22px', border: '1.5px solid #e0e7ff', boxShadow: '0 4px 18px rgba(99,102,241,0.08)' }}>
                  <div style={{ fontSize: 30, marginBottom: 12 }}>{l.emoji}</div>
                  <div style={{ ...SH, fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 4 }}>{l.title}</div>
                  <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginBottom: 10 }}>{l.org}</div>
                  <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{l.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '5rem clamp(1rem,4vw,3rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{
              background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%)',
              borderRadius: 28, padding: 'clamp(2rem,4vw,3.5rem)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-30%', right: '-8%', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-20%', left: '25%', width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', textAlign: 'center', marginBottom: 36 }}>
                <h2 style={{ ...SH, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 900, color: '#fff', marginBottom: 10 }}>Travaillons ensemble ✨</h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', maxWidth: 460, margin: '0 auto' }}>
                  Ouverte aux stages · collaborations IA &amp; IoT &amp; Full-Stack · Remote disponible
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(195px,1fr))', gap: 12, marginBottom: 30 }}>
                {[
                  { href: 'mailto:chifaguesmi9@gmail.com', icon: '✉️', label: 'Email', value: 'chifaguesmi9@gmail.com' },
                  { href: 'https://github.com/chifaguesmi', icon: '⌥', label: 'GitHub', value: 'github.com/chifaguesmi' },
                  { href: 'https://linkedin.com/in/chifaguesmi', icon: 'in', label: 'LinkedIn', value: 'linkedin.com/in/chifaguesmi' },
                  { href: 'tel:+21695514273', icon: '📞', label: 'Téléphone', value: '+216 95 51 42 73' },
                ].map(c => (
                  <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    style={{
                      background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)', borderRadius: 14,
                      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ fontSize: 18, width: 30, textAlign: 'center' }}>{c.icon}</div>
                    <div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>{c.label}</div>
                      <div style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <a href="mailto:chifaguesmi9@gmail.com" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 32px', borderRadius: 14,
                  background: '#fff', color: '#6366f1', fontWeight: 700, fontSize: 14,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)', transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
                >✉️ Envoyer un message</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '1.8rem clamp(1rem,4vw,3rem)', background: '#fff',
        borderTop: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ ...SH, fontSize: 16, fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Chifa Guesmi</span>
          <span>© 2025 · Monastir, Tunisie · Made with ❤️</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} style={{ color: '#94a3b8', transition: 'color .2s', fontSize: 12 }}
                onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
              >{l.label}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
