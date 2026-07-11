import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'Smart Internship Matching',
    desc: 'AI-powered algorithm pairs you with internships based on your skills, goals, and interests.',
  },
  {
    icon: '🚀',
    title: 'Event Discovery',
    desc: 'Never miss a hackathon, conference, or networking event that could change your career.',
  },
  {
    icon: '📚',
    title: 'Skill Development',
    desc: 'Access curated courses and materials to sharpen your edge before applications go out.',
  },
  {
    icon: '📊',
    title: 'Application Tracking',
    desc: 'All your applications in one unified dashboard with real-time status updates.',
  },
  {
    icon: '📝',
    title: 'AI Resume Analysis',
    desc: 'Get instant, actionable feedback on your resume to maximize your selection odds.',
  },
  {
    icon: '🏆',
    title: 'Gamified Progress',
    desc: 'Earn XP and badges, climb leaderboards, and stay motivated on your career path.',
  },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer · Google',
    content:
      'internEase helped me land my dream internship at Google. The AI matching is eerily accurate — it found roles I never would have searched for myself.',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Arjun Patel',
    role: 'Data Scientist · Microsoft',
    content:
      "Found the perfect internship in just 2 days. The platform is fast, clean, and actually understands what you're looking for.",
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Sneha Reddy',
    role: 'Product Manager · Amazon',
    content:
      'The gamification made job hunting feel less daunting. Earned my first badge within a week and got 3 interview calls that month!',
    rating: 5,
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
]

const faqs = [
  {
    q: 'How does internEase work?',
    a: 'internEase uses AI to match students with relevant internships based on their skills, interests, and career goals. Complete your profile and our algorithm surfaces the most relevant opportunities.',
  },
  {
    q: 'Is internEase free to use?',
    a: 'Yes, completely free for students. We believe everyone deserves access to great career opportunities regardless of background.',
  },
  {
    q: 'How do I get started?',
    a: 'Sign up for free, complete your profile in under 5 minutes, and immediately start exploring thousands of curated internship opportunities.',
  },
  {
    q: 'Can I track all my applications?',
    a: 'Absolutely. Our application tracker gives you a unified view of every application and its current status — nothing slips through the cracks.',
  },
  {
    q: 'What kind of support do you provide?',
    a: "We offer 24/7 support via our AI assistant and a dedicated human support team. You're never on your own.",
  },
]

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Stories', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
]

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-white text-slate-900"
      style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}
    >
      {/* NAVBAR */}
      <nav className="absolute inset-x-0 top-0 z-20 px-4 py-4 sm:px-6 md:py-5 lg:px-8">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between">
          <a
            href="#top"
            className="shrink-0 text-2xl font-normal text-slate-900 sm:text-[1.7rem]"
            style={{ fontFamily: 'Georgia, serif', textDecoration: 'none' }}
            onClick={closeMobileMenu}
          >
            intern<span className="text-indigo-600">Ease</span>
          </a>

          <div className="hidden items-center gap-6 md:flex lg:gap-9">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                style={{ textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}

            <Link
              to="/signup"
              className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              style={{ textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/signup"
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:text-sm"
              style={{ textDecoration: 'none' }}
            >
              Sign in
            </Link>

            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <span className="sr-only">Toggle menu</span>
              <span className="flex w-4 flex-col gap-1">
                <span
                  className={`h-0.5 w-4 rounded-full bg-current transition-transform ${
                    mobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                  }`}
                />
                <span
                  className={`h-0.5 w-4 rounded-full bg-current transition-opacity ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`h-0.5 w-4 rounded-full bg-current transition-transform ${
                    mobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                  }`}
                />
              </span>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="absolute left-0 right-0 top-14 rounded-2xl border border-indigo-100 bg-white/95 p-2 shadow-xl backdrop-blur md:hidden">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                  style={{ textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8"
        style={{
          background:
            'linear-gradient(180deg, #eef2ff 0%, #f8fafc 60%, #ffffff 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute -right-28 -top-24 h-72 w-72 rounded-full sm:h-[420px] sm:w-[420px] lg:h-[500px] lg:w-[500px]"
          style={{
            background: '#a5b4fc',
            filter: 'blur(90px)',
            opacity: 0.35,
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-24 h-64 w-64 rounded-full sm:h-[320px] sm:w-[320px] lg:h-[350px] lg:w-[350px]"
          style={{
            background: '#7dd3fc',
            filter: 'blur(90px)',
            opacity: 0.35,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(79,70,229,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(79,70,229,0.05) 1px,transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-200 bg-indigo-600/[0.08] px-3.5 py-2 text-xs font-medium tracking-wide text-indigo-700 sm:mb-8 sm:px-4 sm:text-[13px]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
            <span>AI-Powered Career Platform</span>
          </div>

          <h1
            className="mx-auto mb-5 max-w-4xl text-[clamp(2.6rem,12vw,5.5rem)] font-normal leading-[1.03] tracking-[-0.035em] text-slate-900 sm:mb-6 sm:text-[clamp(3.5rem,8vw,5.5rem)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Your gateway to a{' '}
            <em className="text-indigo-600" style={{ fontStyle: 'italic' }}>
              dream career
            </em>{' '}
            starts here
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-slate-500 sm:mb-10 sm:text-lg sm:leading-8">
            Connect with top companies, discover tailored internships, and
            fast-track your career with intelligent recommendations.
          </p>

          <div className="flex justify-center">
            <Link
              to="/signup"
              className="w-full rounded-full bg-indigo-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.25)] transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto sm:px-8 sm:text-[15px]"
              style={{ textDecoration: 'none' }}
            >
              Get started — it&apos;s free
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-7 border-t border-slate-900/10 pt-8 sm:mt-16 sm:grid-cols-3 sm:gap-4 sm:pt-10">
            {[
              ['50K+', 'Students placed'],
              ['1,200+', 'Partner companies'],
              ['98%', 'Satisfaction rate'],
            ].map(([value, label]) => (
              <div key={label} className="text-center">
                <div
                  className="text-3xl font-bold text-slate-900 sm:text-[2rem]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-[11px]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="scroll-mt-20 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
            Platform features
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <h2
              className="m-0 text-[clamp(2rem,7vw,3rem)] font-normal leading-[1.1] text-slate-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Everything you need
              <br className="hidden sm:block" /> to land the role
            </h2>
            <p className="m-0 max-w-xl text-base leading-7 text-slate-500 sm:text-[1.05rem]">
              Built from the ground up for students navigating the competitive
              internship landscape.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-indigo-200/70 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="relative overflow-hidden bg-white p-6 sm:p-8 lg:p-10"
              >
                <span
                  className="absolute right-5 top-4 text-5xl font-normal leading-none text-indigo-600/[0.08] sm:right-6 sm:text-[3.5rem]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/10 text-xl sm:mb-6">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="m-0 text-sm leading-6 text-slate-500">
                  {feature.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
            Success stories
          </div>

          <div className="mb-10 flex flex-col gap-5 lg:mb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <h2
              className="m-0 text-[clamp(2rem,7vw,3rem)] font-normal leading-[1.1] text-slate-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Loved by students
              <br className="hidden sm:block" /> across India
            </h2>
            <p className="m-0 max-w-md text-base leading-7 text-slate-500 sm:text-[1.05rem]">
              Real stories from real people who found their perfect fit.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="relative flex h-full flex-col rounded-2xl border border-indigo-100 bg-slate-50 p-6 sm:p-8"
              >
                <span
                  className="absolute right-5 top-3 text-5xl leading-none text-indigo-600/15 sm:right-6 sm:top-4"
                  style={{ fontFamily: 'serif' }}
                >
                  ❝
                </span>

                <div className="mb-4 flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {'★★★★★'.split('').map((star, index) => (
                    <span key={index} className="text-sm text-amber-500">
                      {star}
                    </span>
                  ))}
                </div>

                <p className="mb-6 flex-1 text-[0.95rem] italic leading-7 text-slate-700">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-indigo-200 object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">
                      {testimonial.name}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-slate-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
            Got questions?
          </div>
          <h2
            className="mb-9 text-[clamp(2rem,7vw,3rem)] font-normal leading-[1.1] text-slate-900 sm:mb-12"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Frequently asked
          </h2>

          <div className="flex flex-col gap-px overflow-hidden rounded-2xl bg-indigo-200/70">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index

              return (
                <div key={faq.q} className="bg-white">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 border-none bg-transparent px-4 py-5 text-left font-[inherit] text-[0.95rem] font-semibold text-slate-900 sm:px-7 sm:py-6 sm:text-base"
                  >
                    <span className="leading-6">{faq.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600/10 text-lg font-light text-indigo-600">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="m-0 px-4 pb-5 text-sm leading-6 text-slate-500 sm:px-7 sm:pb-6 sm:text-[0.95rem] sm:leading-7">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        style={{
          background:
            'linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full sm:h-[420px] sm:w-[420px] lg:h-[500px] lg:w-[500px]"
          style={{
            background: '#a5b4fc',
            filter: 'blur(90px)',
            opacity: 0.3,
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-24 h-64 w-64 rounded-full sm:h-[320px] sm:w-[320px] lg:h-[350px] lg:w-[350px]"
          style={{
            background: '#7dd3fc',
            filter: 'blur(90px)',
            opacity: 0.3,
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-600">
            Start today
          </div>
          <h2
            className="mb-4 text-[clamp(2.1rem,8vw,3.5rem)] font-normal leading-[1.08] text-slate-900"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Ready to launch your{' '}
            <em className="text-indigo-600" style={{ fontStyle: 'italic' }}>
              career journey?
            </em>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-slate-500 sm:mb-10 sm:text-[1.05rem]">
            Join 50,000+ students who&apos;ve already found their dream internships
            through internEase.
          </p>

          <div className="mx-auto flex max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
            <Link
              to="/signup"
              className="w-full rounded-full bg-indigo-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(79,70,229,0.25)] transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto sm:px-8 sm:text-[15px]"
              style={{ textDecoration: 'none' }}
            >
              Create free account
            </Link>
            <Link
              to="/contact"
              className="w-full rounded-full border border-slate-900/15 bg-white/50 px-7 py-3.5 text-center text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-white hover:text-indigo-700 sm:w-auto sm:px-8 sm:text-[15px]"
              style={{ textDecoration: 'none' }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing