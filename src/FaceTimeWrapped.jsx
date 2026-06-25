import { useState, useEffect, useCallback, useRef } from 'react'

const DATA = {
  year: 2024,
  totalCalls: 156,
  totalHours: 312,
  totalDays: 13,
  percentile: 92,
  favoritePerson: { name: 'Sarah', calls: 47, hours: 89 },
  longestCall: { person: 'Mum', date: 'Christmas Day', totalMins: 263 },
  uniqueContacts: 23,
  topContacts: [
    { name: 'Sarah', calls: 47, initials: 'S', color: '#ff6b9d' },
    { name: 'Mum',   calls: 31, initials: 'M', color: '#ffa07a' },
    { name: 'Jake',  calls: 28, initials: 'J', color: '#48c9b0' },
    { name: 'Aisha', calls: 19, initials: 'A', color: '#a29bfe' },
    { name: 'Tom',   calls: 14, initials: 'T', color: '#74b9ff' },
  ],
  places: [
    { name: 'Home',             icon: '🏠' },
    { name: 'Costa Coffee',     icon: '☕' },
    { name: 'Hyde Park',        icon: '🌿' },
    { name: 'Heathrow Airport', icon: '✈️' },
    { name: 'Hotel Milan',      icon: '🏨' },
  ],
  streak: { person: 'Mum', days: 34, period: 'Dec — Jan' },
  lateNightCalls: 23,
  lateNightPerson: 'Sarah',
}

// Pre-computed star positions so they're stable across renders
const STARS = Array.from({ length: 28 }, (_, i) => ({
  left:     (((i * 37.3 + 13.7) % 100)).toFixed(1) + '%',
  top:      (((i * 67.1 +  7.3) %  50)).toFixed(1) + '%',
  opacity:  +(0.15 + ((i * 13) % 50) / 100).toFixed(2),
  duration: +(2 + (i % 3)),
  delay:    +(((i * 7) % 300) / 100).toFixed(2),
}))

// ---------------------------------------------------------------------------
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return count
}

// ---------------------------------------------------------------------------
function ProgressBar({ current, total }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      display: 'flex', gap: 4, padding: '12px 16px', zIndex: 20,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 9999,
          background: i <= current ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.2)',
          transition: 'background 0.3s ease',
        }} />
      ))}
    </div>
  )
}

function SlideShell({ bg, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px 32px 48px',
      textAlign: 'center',
    }}>
      {children}
    </div>
  )
}

const T = {
  label: { color: 'rgba(255,255,255,0.45)', fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase' },
  hero:  { fontSize: 100, fontWeight: 800, color: 'white', lineHeight: 1, letterSpacing: '-0.04em' },
  sub:   { fontSize: 26, fontWeight: 300, color: 'white' },
  body:  { fontSize: 15, color: 'rgba(255,255,255,0.45)' },
  italic:{ fontSize: 14, color: 'rgba(255,255,255,0.28)', fontStyle: 'italic' },
}

const ani = (name, delay = 0, extra = '') =>
  `${name} 0.65s ease both ${delay}s${extra ? ', ' + extra : ''}`

// ---------------------------------------------------------------------------
// Slide 1 — Intro
function IntroSlide() {
  return (
    <SlideShell bg="linear-gradient(160deg, #030e04 0%, #091809 100%)">
      <div style={{ animation: ani('scale-in', 0), marginBottom: 28 }}>
        <div style={{
          width: 100, height: 100, borderRadius: 26,
          background: 'linear-gradient(145deg, #34d95a, #18b045)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 80px rgba(48,209,88,0.45), 0 0 30px rgba(48,209,88,0.25)',
        }}>
          <svg width="54" height="38" viewBox="0 0 54 38" fill="white">
            <rect x="1" y="5" width="34" height="28" rx="5" />
            <path d="M37 13 L53 5 L53 33 L37 25 Z" />
          </svg>
        </div>
      </div>

      <div style={{ animation: ani('slide-up', 0.35) }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
          FaceTime Wrapped
        </h1>
        <p style={{ fontSize: 22, color: '#30d158', fontWeight: 300, marginTop: 6 }}>{DATA.year}</p>
      </div>

      <p style={{ ...T.label, marginTop: 36, animation: ani('slide-up', 0.75) }}>
        tap to begin
      </p>
    </SlideShell>
  )
}

// Slide 2 — Total Calls
function TotalCallsSlide() {
  const count = useCountUp(DATA.totalCalls)
  return (
    <SlideShell bg="linear-gradient(160deg, #030818 0%, #0d1f3d 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05) }}>this year</p>
      <span style={{
        ...T.hero,
        color: 'white',
        textShadow: '0 0 70px rgba(90,200,250,0.4)',
        margin: '16px 0 8px',
        animation: ani('slide-up', 0.15),
      }}>
        {count}
      </span>
      <p style={{ ...T.sub, color: '#5ac8fa', animation: ani('slide-up', 0.35) }}>
        FaceTime calls
      </p>
      <p style={{ ...T.body, marginTop: 12, animation: ani('slide-up', 0.5) }}>
        you called more than {DATA.percentile}% of your contacts
      </p>
    </SlideShell>
  )
}

// Slide 3 — Total Time
function TotalTimeSlide() {
  const count = useCountUp(DATA.totalHours)
  return (
    <SlideShell bg="linear-gradient(160deg, #090520 0%, #1a1040 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05) }}>you spent</p>
      <span style={{
        ...T.hero,
        textShadow: '0 0 70px rgba(191,90,242,0.45)',
        margin: '16px 0 8px',
        animation: ani('slide-up', 0.15),
      }}>
        {count}<span style={{ fontSize: 52 }}>h</span>
      </span>
      <p style={{ ...T.sub, color: '#bf5af2', animation: ani('slide-up', 0.35) }}>
        on FaceTime
      </p>
      <p style={{ ...T.body, marginTop: 12, animation: ani('slide-up', 0.5) }}>
        that's {DATA.totalDays} full days of conversation
      </p>
    </SlideShell>
  )
}

// Slide 4 — Longest Call
function LongestCallSlide() {
  const elapsed = useCountUp(DATA.longestCall.totalMins, 2600)
  const hrs = Math.floor(elapsed / 60)
  const mins = elapsed % 60
  return (
    <SlideShell bg="linear-gradient(160deg, #030e06 0%, #0a2215 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05) }}>your longest FaceTime</p>
      <span style={{
        ...T.hero,
        fontSize: 74,
        textShadow: '0 0 70px rgba(48,209,88,0.4)',
        margin: '16px 0 8px',
        fontVariantNumeric: 'tabular-nums',
        animation: ani('slide-up', 0.15),
      }}>
        {hrs}h {String(mins).padStart(2, '0')}m
      </span>
      <p style={{ ...T.sub, color: '#30d158', animation: ani('slide-up', 0.4) }}>
        with {DATA.longestCall.person}
      </p>
      <p style={{ ...T.body, marginTop: 10, animation: ani('slide-up', 0.55) }}>
        on {DATA.longestCall.date}
      </p>
    </SlideShell>
  )
}

// Slide 5 — Favourite Person
function FavoritePersonSlide() {
  return (
    <SlideShell bg="linear-gradient(160deg, #120509 0%, #300e20 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05) }}>your #1 FaceTime person</p>

      <div style={{ animation: ani('scale-in', 0.25), margin: '24px 0 16px' }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'linear-gradient(145deg, #ff6b9d, #cc2d5e)',
          boxShadow: '0 0 70px rgba(255,107,157,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 42, fontWeight: 700, color: 'white', margin: '0 auto 12px',
        }}>
          {DATA.favoritePerson.name[0]}
        </div>
        <span style={{
          fontSize: 64, fontWeight: 800, color: 'white',
          letterSpacing: '-0.03em', display: 'block',
          textShadow: '0 0 60px rgba(255,107,157,0.5)',
        }}>
          {DATA.favoritePerson.name}
        </span>
      </div>

      <p style={{ fontSize: 20, color: '#ff6b9d', fontWeight: 300, animation: ani('slide-up', 0.6) }}>
        {DATA.favoritePerson.calls} calls &bull; {DATA.favoritePerson.hours} hours
      </p>
      <p style={{ ...T.italic, marginTop: 14, animation: ani('slide-up', 0.75) }}>
        "some things are worth every minute"
      </p>
    </SlideShell>
  )
}

// Slide 6 — Unique Contacts
function UniqueContactsSlide() {
  const count = useCountUp(DATA.uniqueContacts)
  return (
    <SlideShell bg="linear-gradient(160deg, #040810 0%, #0d1a40 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05) }}>you FaceTimed</p>
      <span style={{
        ...T.hero,
        textShadow: '0 0 70px rgba(10,132,255,0.4)',
        margin: '16px 0 4px',
        animation: ani('slide-up', 0.15),
      }}>
        {count}
      </span>
      <p style={{ ...T.sub, color: '#0a84ff', animation: ani('slide-up', 0.35) }}>
        different people
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
        {DATA.topContacts.map((c, i) => (
          <div key={c.name} style={{
            width: 46, height: 46, borderRadius: '50%',
            background: c.color,
            boxShadow: `0 0 22px ${c.color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: 'white',
            animation: ani('scale-in', 0.55 + i * 0.1),
          }}>
            {c.initials}
          </div>
        ))}
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: 'rgba(255,255,255,0.45)',
          animation: ani('scale-in', 1.05),
        }}>
          +18
        </div>
      </div>
    </SlideShell>
  )
}

// Slide 7 — Podium (Top 3)
const PODIUM = [
  { ...{ name: 'Mum',   calls: 31, initials: 'M', color: '#ffa07a' }, rank: 2, h: 110 },
  { ...{ name: 'Sarah', calls: 47, initials: 'S', color: '#ff6b9d' }, rank: 1, h: 155 },
  { ...{ name: 'Jake',  calls: 28, initials: 'J', color: '#48c9b0' }, rank: 3, h: 85  },
]
const MEDALS = ['🥈', '🥇', '🥉']

function Top3Slide() {
  return (
    <SlideShell bg="linear-gradient(160deg, #080515 0%, #1a0f40 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05), marginBottom: 28 }}>
        your top callers
      </p>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
        {PODIUM.map((p, i) => (
          <div key={p.name} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            animation: ani('slide-up', 0.2 + i * 0.15),
          }}>
            <div style={{
              width: p.rank === 1 ? 54 : 42, height: p.rank === 1 ? 54 : 42,
              borderRadius: '50%', background: p.color,
              boxShadow: `0 0 28px ${p.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: p.rank === 1 ? 22 : 17, fontWeight: 700, color: 'white',
            }}>
              {p.initials}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
              {p.name}
            </span>
            <div style={{
              width: 78, height: p.h,
              borderRadius: '8px 8px 0 0',
              background: `linear-gradient(180deg, ${p.color}33, ${p.color}11)`,
              border: `1px solid ${p.color}33`,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', paddingTop: 10, gap: 4,
            }}>
              <span style={{ fontSize: 22 }}>{MEDALS[i]}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                {p.calls} calls
              </span>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

// Slide 8 — Places
function PlacesSlide() {
  const count = useCountUp(DATA.places.length, 1000)
  return (
    <SlideShell bg="linear-gradient(160deg, #030d0d 0%, #0a2022 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05) }}>you called from</p>
      <span style={{
        ...T.hero,
        textShadow: '0 0 70px rgba(90,200,250,0.4)',
        margin: '16px 0 4px',
        animation: ani('slide-up', 0.15),
      }}>
        {count}
      </span>
      <p style={{ ...T.sub, color: '#5ac8fa', animation: ani('slide-up', 0.35) }}>
        different places
      </p>

      <div style={{ width: '100%', maxWidth: 280, marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DATA.places.map((pl, i) => (
          <div key={pl.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.09)',
            animation: ani('slide-right', 0.45 + i * 0.1),
          }}>
            <span style={{ fontSize: 24 }}>{pl.icon}</span>
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.82)' }}>{pl.name}</span>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

// Slide 9 — Streak
function StreakSlide() {
  const count = useCountUp(DATA.streak.days, 2200)
  return (
    <SlideShell bg="linear-gradient(160deg, #120500 0%, #2d1200 100%)">
      <div style={{ fontSize: 68, animation: ani('scale-in', 0.05) + ', flame-flicker 2s ease-in-out infinite 0.7s' }}>
        🔥
      </div>
      <p style={{ ...T.label, marginTop: 16, animation: ani('slide-up', 0.25) }}>
        your longest streak
      </p>
      <span style={{
        ...T.hero,
        textShadow: '0 0 70px rgba(255,159,10,0.5)',
        margin: '14px 0 6px',
        animation: ani('slide-up', 0.35),
      }}>
        {count}
      </span>
      <p style={{ ...T.sub, color: '#ff9f0a', animation: ani('slide-up', 0.5) }}>
        days in a row
      </p>
      <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.75)', marginTop: 14, animation: ani('slide-up', 0.65) }}>
        You &amp; {DATA.streak.person}
      </p>
      <p style={{ ...T.body, marginTop: 4, animation: ani('slide-up', 0.75) }}>
        {DATA.streak.period}
      </p>
      <p style={{ ...T.italic, marginTop: 18, animation: ani('slide-up', 0.9) }}>
        "that's real connection"
      </p>
    </SlideShell>
  )
}

// Slide 10 — Night Owl
function NightOwlSlide() {
  const count = useCountUp(DATA.lateNightCalls)
  return (
    <SlideShell bg="linear-gradient(160deg, #030410 0%, #08102a 100%)">
      {STARS.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 2, height: 2, borderRadius: '50%',
          background: 'white',
          left: s.left, top: s.top,
          opacity: s.opacity,
          animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{ fontSize: 68, animation: ani('scale-in', 0.05), marginBottom: 16 }}>🌙</div>
        <p style={{ ...T.label, animation: ani('slide-up', 0.25) }}>night owl calls</p>
        <span style={{
          ...T.hero,
          textShadow: '0 0 70px rgba(90,200,250,0.4)',
          margin: '14px 0 6px',
          animation: ani('slide-up', 0.35),
        }}>
          {count}
        </span>
        <p style={{ ...T.sub, color: '#5ac8fa', animation: ani('slide-up', 0.5) }}>
          calls after midnight
        </p>
        <p style={{ ...T.italic, marginTop: 20, animation: ani('slide-up', 0.7) }}>
          "the night belongs to you and {DATA.lateNightPerson}"
        </p>
      </div>
    </SlideShell>
  )
}

// Slide 11 — Share
function ShareSlide({ onReplay }) {
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async (e) => {
    e.stopPropagation()
    const text =
      `📱 My FaceTime ${DATA.year} Wrapped\n\n` +
      `📞 ${DATA.totalCalls} calls this year\n` +
      `⏱ ${DATA.totalHours}h on FaceTime\n` +
      `❤️ #1: ${DATA.favoritePerson.name} (${DATA.favoritePerson.calls} calls)\n` +
      `🔥 ${DATA.streak.days}-day streak with ${DATA.streak.person}\n` +
      `👥 ${DATA.uniqueContacts} people connected\n` +
      `📍 ${DATA.places.length} different places\n\n` +
      `#FaceTimeWrapped`
    if (navigator.share) {
      try { await navigator.share({ text }) } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [])

  const SUMMARY = [
    { label: 'Total calls', value: DATA.totalCalls,           color: '#5ac8fa' },
    { label: 'Hours',       value: `${DATA.totalHours}h`,     color: '#bf5af2' },
    { label: '#1 person',   value: DATA.favoritePerson.name,  color: '#ff6b9d' },
    { label: 'Day streak',  value: DATA.streak.days,          color: '#ff9f0a' },
    { label: 'People',      value: DATA.uniqueContacts,       color: '#0a84ff' },
    { label: 'Places',      value: DATA.places.length,        color: '#30d158' },
  ]

  return (
    <SlideShell bg="linear-gradient(160deg, #080808 0%, #141414 100%)">
      <p style={{ ...T.label, animation: ani('slide-up', 0.05), marginBottom: 20 }}>
        your year in review
      </p>

      {/* Share card */}
      <div style={{
        width: '100%', maxWidth: 300,
        borderRadius: 20,
        background: 'linear-gradient(145deg, #1c1c1c, #111)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: 22,
        animation: ani('scale-in', 0.2),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(145deg, #34d95a, #18b045)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="14" viewBox="0 0 54 38" fill="white">
              <rect x="1" y="5" width="34" height="28" rx="5" />
              <path d="M37 13 L53 5 L53 33 L37 25 Z" />
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: 'white', fontWeight: 700, fontSize: 15, margin: 0 }}>FaceTime Wrapped</p>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, margin: 0 }}>{DATA.year}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {SUMMARY.map((s) => (
            <div key={s.label} style={{
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
            }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: '2px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center', fontSize: 11,
          color: 'rgba(255,255,255,0.18)',
          letterSpacing: '0.06em', marginTop: 14, marginBottom: 0,
        }}>
          #FaceTimeWrapped
        </p>
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        style={{
          marginTop: 20,
          padding: '13px 36px', borderRadius: 50,
          background: copied ? '#30d158' : 'white',
          color: copied ? 'white' : '#000',
          fontSize: 15, fontWeight: 600,
          border: 'none', cursor: 'pointer',
          transition: 'background 0.3s, color 0.3s',
          animation: ani('slide-up', 0.5),
        }}
      >
        {copied ? '✓ Copied to clipboard!' : '↑  Share your Wrapped'}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onReplay() }}
        style={{
          marginTop: 14,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.28)', fontSize: 13,
          animation: ani('slide-up', 0.65),
        }}
      >
        watch again
      </button>
    </SlideShell>
  )
}

// ---------------------------------------------------------------------------
const SLIDES = [
  IntroSlide, TotalCallsSlide, TotalTimeSlide, LongestCallSlide,
  FavoritePersonSlide, UniqueContactsSlide, Top3Slide,
  PlacesSlide, StreakSlide, NightOwlSlide, ShareSlide,
]

export default function FaceTimeWrapped() {
  const [slide, setSlide] = useState(0)
  const touchX = useRef(null)

  const advance = useCallback((e) => {
    if (e.target.closest('button')) return
    setSlide((s) => Math.min(s + 1, SLIDES.length - 1))
  }, [])

  const onTouchStart = useCallback((e) => {
    touchX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback((e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    setSlide((s) => dx < 0
      ? Math.min(s + 1, SLIDES.length - 1)
      : Math.max(s - 1, 0))
  }, [])

  const replay = useCallback(() => setSlide(0), [])

  const SlideComponent = SLIDES[slide]

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        userSelect: 'none',
        cursor: 'pointer',
      }}
      onClick={advance}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ProgressBar current={slide} total={SLIDES.length} />

      {/* Slide — key causes full remount on each slide change, resetting animations */}
      <div key={slide} style={{ position: 'absolute', inset: 0, animation: 'wrapped-slide-in 0.38s cubic-bezier(0.25,0.46,0.45,0.94) both' }}>
        <SlideComponent onReplay={replay} />
      </div>
    </div>
  )
}
