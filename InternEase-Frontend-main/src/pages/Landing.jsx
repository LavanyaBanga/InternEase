import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const features = [
  { icon: '🎯', title: 'Smart Internship Matching', desc: 'AI-powered algorithm pairs you with internships based on your skills, goals, and interests.' },
  { icon: '🚀', title: 'Event Discovery', desc: 'Never miss a hackathon, conference, or networking event that could change your career.' },
  { icon: '📚', title: 'Skill Development', desc: 'Access curated courses and materials to sharpen your edge before applications go out.' },
  { icon: '📊', title: 'Application Tracking', desc: 'All your applications in one unified dashboard with real-time status updates.' },
  { icon: '📝', title: 'AI Resume Analysis', desc: 'Get instant, actionable feedback on your resume to maximize your selection odds.' },
  { icon: '🏆', title: 'Gamified Progress', desc: 'Earn XP and badges, climb leaderboards, and stay motivated on your career path.' },
]

const testimonials = [
  {
    name: 'Priya Sharma', role: 'Software Engineer · Google',
    content: 'internEase helped me land my dream internship at Google. The AI matching is eerily accurate — it found roles I never would have searched for myself.',
    rating: 5, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Arjun Patel', role: 'Data Scientist · Microsoft',
    content: "Found the perfect internship in just 2 days. The platform is fast, clean, and actually understands what you're looking for.",
    rating: 5, avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    name: 'Sneha Reddy', role: 'Product Manager · Amazon',
    content: 'The gamification made job hunting feel less daunting. Earned my first badge within a week and got 3 interview calls that month!',
    rating: 5, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
]

const faqs = [
  { q: 'How does internEase work?', a: 'internEase uses AI to match students with relevant internships based on their skills, interests, and career goals. Complete your profile and our algorithm surfaces the most relevant opportunities.' },
  { q: 'Is internEase free to use?', a: 'Yes, completely free for students. We believe everyone deserves access to great career opportunities regardless of background.' },
  { q: 'How do I get started?', a: 'Sign up for free, complete your profile in under 5 minutes, and immediately start exploring thousands of curated internship opportunities.' },
  { q: 'Can I track all my applications?', a: 'Absolutely. Our application tracker gives you a unified view of every application and its current status — nothing slips through the cracks.' },
  { q: 'What kind of support do you provide?', a: "We offer 24/7 support via our AI assistant and a dedicated human support team. You're never on your own." },
]

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", background: 'linear-gradient(135deg, #0F172A 0%, #312E81 50%, #8B5CF6 100%)', color: '#0f0f1a', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem 3rem'
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#fff', fontWeight: 400 }}>
          intern<span style={{ color: '#a78bfa' }}>Ease</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Features', 'Events', 'Pricing'].map(l => (
            <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>{l}</a>
          ))}
          <Link to="/signup" style={{
            background: 'rgba(108,71,255,0.8)', color: '#fff', padding: '9px 22px',
            borderRadius: '100px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            border: '1px solid rgba(108,71,255,0.5)'
          }}>Sign in</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', background: '#1a1a2e', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
      }}>
        {/* Background blobs */}
        {[
          { w: 500, h: 500, bg: '#6c47ff', top: '-100px', right: '-80px' },
          { w: 350, h: 350, bg: '#ff6b6b', bottom: '-50px', left: '-50px' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
            background: b.bg, filter: 'blur(80px)', opacity: 0.3,
            top: b.top, right: b.right, bottom: b.bottom, left: b.left, pointerEvents: 'none'
          }} />
        ))}
        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', maxWidth: '780px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(108,71,255,0.25)', border: '1px solid rgba(108,71,255,0.4)',
            color: '#c4b5fd', padding: '6px 16px', borderRadius: '100px',
            fontSize: '13px', fontWeight: 500, marginBottom: '2rem', letterSpacing: '0.02em'
          }}>
            <span style={{ width: 7, height: 7, background: '#a78bfa', borderRadius: '50%', display: 'inline-block' }} />
            AI-Powered Career Platform
          </div>

          <h1 style={{
            fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(3rem,7vw,5.5rem)',
            lineHeight: 1.05, color: '#fff', marginBottom: '1.5rem', fontWeight: 400
          }}>
            Your gateway to a{' '}
            <em style={{ fontStyle: 'italic', color: '#a78bfa' }}>dream career</em>
            {' '}starts here
          </h1>

          <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: 'rgba(255,255,255,0.65)', maxWidth: '540px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Connect with top companies, discover tailored internships, and fast-track your career with intelligent recommendations.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              background: '#6c47ff', color: '#fff', padding: '14px 32px', borderRadius: '100px',
              fontSize: '15px', fontWeight: 600, textDecoration: 'none', letterSpacing: '0.01em'
            }}>
              Get started — it's free
            </Link>
         
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', gap: '40px', justifyContent: 'center',
            marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.08)',
            flexWrap: 'wrap'
          }}>
            {[['50K+', 'Students placed'], ['1,200+', 'Partner companies'], ['98%', 'Satisfaction rate']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: 'Georgia, serif' }}>{v}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 1.5rem', background: '#f8f7ff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6c47ff', marginBottom: '14px' }}>Platform features</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, lineHeight: 1.1, margin: 0 }}>
              Everything you need<br />to land the role
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: '520px', lineHeight: 1.7, margin: 0 }}>
              Built from the ground up for students navigating the competitive internship landscape.
            </p>
          </div>

          {/* Grid with hairline dividers */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: '2px', marginTop: '3.5rem', background: 'rgba(108,71,255,0.12)'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fff', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                <span style={{
                  fontFamily: 'Georgia, serif', fontSize: '3.5rem', color: 'rgba(108,71,255,0.08)',
                  position: 'absolute', top: '1rem', right: '1.5rem', fontWeight: 400, lineHeight: 1
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{
                  width: '44px', height: '44px', background: 'rgba(108,71,255,0.1)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', marginBottom: '1.5rem'
                }}>
                  {f.icon}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6c47ff', marginBottom: '14px' }}>Success stories</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, lineHeight: 1.1, margin: 0 }}>
              Loved by students<br />across India
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: '400px', lineHeight: 1.7, margin: 0 }}>
              Real stories from real people who found their perfect fit.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: '#f8f7ff', borderRadius: '20px', padding: '2rem',
                border: '1px solid rgba(108,71,255,0.12)', position: 'relative'
              }}>
                <span style={{ fontSize: '3rem', color: 'rgba(108,71,255,0.15)', position: 'absolute', top: '1rem', right: '1.5rem', fontFamily: 'serif', lineHeight: 1 }}>❝</span>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                  {'★★★★★'.split('').map((s, j) => <span key={j} style={{ color: '#f5c842', fontSize: '14px' }}>{s}</span>)}
                </div>
                <p style={{ fontSize: '0.95rem', color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.content}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(108,71,255,0.2)' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '1px' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '100px 1.5rem', background: '#f8f7ff' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6c47ff', marginBottom: '14px' }}>Got questions?</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '3rem' }}>Frequently asked</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(108,71,255,0.12)' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ background: '#fff' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '1.4rem 2rem', cursor: 'pointer', border: 'none', background: 'transparent',
                    fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600, color: '#0f0f1a', textAlign: 'left'
                  }}
                >
                  <span>{f.q}</span>
                  <span style={{
                    width: 26, height: 26, background: 'rgba(108,71,255,0.1)', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#6c47ff', fontSize: '18px', fontWeight: 300, flexShrink: 0
                  }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <p style={{ padding: '0 2rem 1.5rem', fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 1.5rem', background: '#1a1a2e', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: '#6c47ff', filter: 'blur(80px)', opacity: 0.2, top: '-100px', right: '-80px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: '#ff6b6b', filter: 'blur(80px)', opacity: 0.2, bottom: '-50px', left: '-50px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a78bfa', marginBottom: '14px' }}>Start today</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#fff', fontWeight: 400, marginBottom: '1rem', lineHeight: 1.1 }}>
            Ready to launch your{' '}
            <em style={{ fontStyle: 'italic', color: '#a78bfa' }}>career journey?</em>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Join 50,000+ students who've already found their dream internships through internEase.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              background: '#6c47ff', color: '#fff', padding: '14px 32px',
              borderRadius: '100px', fontSize: '15px', fontWeight: 600, textDecoration: 'none'
            }}>
              Create free account
            </Link>
            <Link to="/contact" style={{
              background: 'transparent', color: 'rgba(255,255,255,0.8)', padding: '14px 32px',
              borderRadius: '100px', fontSize: '15px', fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none'
            }}>
              Contact us
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Landing