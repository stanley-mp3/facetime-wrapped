import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useCountUp } from './hooks/useCountUp'
import { formatDuration, formatNumber, toHours } from './utils/format'

// ── Shared reveal animation ───────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── 1. Cover ──────────────────────────────────────────────────────────────────
function CoverSlide({ data }) {
  return (
    <div className="slide center">
      <Reveal delay={0}>
        <div className="cover-icon">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="60" height="60" rx="14" fill="rgba(255,255,255,0.15)"/>
            <path d="M10 20C10 17.8 11.8 16 14 16H34C36.2 16 38 17.8 38 20V40C38 42.2 36.2 44 34 44H14C11.8 44 10 42.2 10 40V20Z" fill="white"/>
            <path d="M38 24.5L50 18V42L38 35.5V24.5Z" fill="white"/>
          </svg>
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <span className="kicker">{data.year}</span>
      </Reveal>
      <Reveal delay={0.35}>
        <h1 className="display">FaceTime<br />Wrapped</h1>
      </Reveal>
      <Reveal delay={0.7}>
        <p className="tap-hint">Tap anywhere to begin →</p>
      </Reveal>
    </div>
  )
}

// ── 2. Total Time ─────────────────────────────────────────────────────────────
function TotalTimeSlide({ data }) {
  const hours = parseFloat(toHours(data.totalSeconds))
  const countedHours = useCountUp(hours, 1400, 400)
  const countedCalls = useCountUp(data.totalCalls, 1200, 700)

  return (
    <div className="slide">
      <Reveal delay={0}><span className="label">You spent</span></Reveal>
      <Reveal delay={0.3}>
        <div className="hero-num">{countedHours.toFixed(1)}</div>
        <div className="hero-unit">hours on FaceTime</div>
      </Reveal>
      <Reveal delay={0.9}>
        <p className="body-copy">
          Across <strong>{formatNumber(countedCalls)}</strong> calls.
          <br />That's like watching every episode of Friends.
          <br />Five times.
        </p>
      </Reveal>
    </div>
  )
}

// ── 3. Longest Call ───────────────────────────────────────────────────────────
function LongestCallSlide({ data }) {
  return (
    <div className="slide">
      <Reveal delay={0}><span className="label">Your longest call ever</span></Reveal>
      <Reveal delay={0.3}>
        <div className="hero-num duration">{formatDuration(data.longestCall.seconds)}</div>
      </Reveal>
      <Reveal delay={0.65}>
        <p className="with-name">with <strong>{data.longestCall.name}</strong></p>
        <p className="date-label">on {data.longestCall.date}</p>
      </Reveal>
      <Reveal delay={1}>
        <p className="body-copy">Nobody hung up first. Pure dedication.</p>
      </Reveal>
    </div>
  )
}

// ── 4. Top Person ─────────────────────────────────────────────────────────────
function TopPersonSlide({ data }) {
  const { topPerson } = data
  const calls = useCountUp(topPerson.calls, 1000, 500)
  const hours = parseFloat(toHours(topPerson.seconds))
  const countedHours = useCountUp(hours, 1000, 650)

  return (
    <div className="slide center">
      <Reveal delay={0}><span className="label">Your person this year</span></Reveal>
      <Reveal delay={0.25}>
        <div className="person-emoji">{topPerson.emoji}</div>
        <div className="hero-name">{topPerson.name}</div>
      </Reveal>
      <Reveal delay={0.6}>
        <p className="body-copy">
          <strong>{formatNumber(calls)}</strong> calls ·{' '}
          <strong>{countedHours.toFixed(1)}</strong> hours together
        </p>
      </Reveal>
      <Reveal delay={0.9}>
        <p className="body-copy soft">They picked up every time. ❤️</p>
      </Reveal>
    </div>
  )
}

// ── 5. Leaderboard ────────────────────────────────────────────────────────────
function LeaderboardSlide({ data }) {
  const maxSeconds = data.topPeople[0]?.seconds ?? 1

  return (
    <div className="slide">
      <Reveal delay={0}><span className="label">Your top 5</span></Reveal>
      <ul className="leaderboard">
        {data.topPeople.map((p, i) => (
          <motion.li
            key={p.name}
            className="lb-row"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="lb-rank">{i + 1}</span>
            <div className="lb-bar-wrap">
              <div className="lb-name">{p.name}</div>
              <div className="lb-track">
                <motion.div
                  className="lb-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.seconds / maxSeconds) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
            <span className="lb-time">{toHours(p.seconds)}h</span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

// ── 6. Busiest Day ────────────────────────────────────────────────────────────
function BusiestDaySlide({ data }) {
  const { weeklyPattern, busiestDay } = data
  const max = weeklyPattern ? Math.max(...weeklyPattern.map(d => d.calls)) : 1
  const busiestShort = busiestDay.label.slice(0, 3)

  return (
    <div className="slide center">
      <Reveal delay={0}><span className="label">You were busiest on</span></Reveal>
      <Reveal delay={0.25}>
        <div className="hero-name">{busiestDay.label}s</div>
      </Reveal>

      {weeklyPattern && (
        <div className="day-chart">
          {weeklyPattern.map((d, i) => {
            const active = d.day === busiestShort
            const barH = Math.max(Math.round((d.calls / max) * 90), 4)
            return (
              <div key={d.day} className="day-col">
                <motion.div
                  className={`day-bar${active ? ' day-bar--active' : ''}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: barH, opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className={`day-label${active ? ' day-label--active' : ''}`}>{d.day}</span>
              </div>
            )
          })}
        </div>
      )}

      <Reveal delay={1.1}>
        <p className="body-copy soft">
          <strong>{busiestDay.calls}</strong> calls on {busiestDay.label}s alone.
        </p>
      </Reveal>
    </div>
  )
}

// ── 7. Unique People ──────────────────────────────────────────────────────────
function UniquePeopleSlide({ data }) {
  const count = useCountUp(data.uniquePeople, 1200, 350)

  return (
    <div className="slide center">
      <Reveal delay={0}><span className="label">You FaceTimed</span></Reveal>
      <Reveal delay={0.3}>
        <div className="hero-num">{Math.round(count)}</div>
        <div className="hero-unit">different people</div>
      </Reveal>
      <Reveal delay={0.85}>
        <p className="body-copy">
          Some were 4-hour heart-to-hearts.<br />
          Some were "wait, is this on?"<br />
          <span className="soft">All of it counts.</span>
        </p>
      </Reveal>
    </div>
  )
}

// ── 8. Streak ─────────────────────────────────────────────────────────────────
function StreakSlide({ data }) {
  const { longestStreak } = data
  const days = useCountUp(longestStreak.days, 1300, 350)

  return (
    <div className="slide center">
      <Reveal delay={0}><div className="flame-emoji">🔥</div></Reveal>
      <Reveal delay={0.25}>
        <div className="hero-num">{Math.round(days)} days</div>
        <div className="hero-unit">in a row</div>
      </Reveal>
      <Reveal delay={0.75}>
        <p className="body-copy">
          You and <strong>{longestStreak.name}</strong> didn't miss a single day.
          <br />Your longest streak ever.
        </p>
      </Reveal>
      <Reveal delay={1.1}>
        <p className="body-copy soft">Keep it alive in {data.year + 1}.</p>
      </Reveal>
    </div>
  )
}

// ── 9. Late Night ─────────────────────────────────────────────────────────────
function LateNightSlide({ data }) {
  const count = useCountUp(data.lateNightCalls, 1100, 350)

  return (
    <div className="slide center">
      <Reveal delay={0}><div className="moon-emoji">🌙</div></Reveal>
      <Reveal delay={0.25}>
        <div className="hero-num">{Math.round(count)}</div>
        <div className="hero-unit">calls after midnight</div>
      </Reveal>
      <Reveal delay={0.8}>
        <p className="body-copy">
          Some conversations can't wait until morning.
          <br /><span className="soft">No judgment.</span>
        </p>
      </Reveal>
    </div>
  )
}

// ── 10. Places ────────────────────────────────────────────────────────────────
function PlacesSlide({ data }) {
  const max = data.places[0]?.calls ?? 1

  return (
    <div className="slide">
      <Reveal delay={0}><span className="label">You called from</span></Reveal>
      <div className="places-cloud">
        {data.places.map((pl, i) => (
          <motion.span
            key={pl.name}
            className="place-chip"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: `${0.95 + (pl.calls / max) * 1.3}rem` }}
          >
            {pl.name}
          </motion.span>
        ))}
      </div>
      <Reveal delay={0.85}>
        <p className="body-copy soft">Home was your studio. The car was your sequel.</p>
      </Reveal>
    </div>
  )
}

// ── 11. Share ────────────────────────────────────────────────────────────────
function ShareSlide({ data, onRestart }) {
  const cardRef = useRef()

  const downloadPng = async () => {
    try {
      const { toPng } = await import('html-to-image')
      const el = cardRef.current
      // Temporarily give the card a solid gradient so the PNG looks good standalone
      const prevStyle = el.getAttribute('style') ?? ''
      el.style.background = 'linear-gradient(135deg, #1a0840 0%, #6b21a8 50%, #be185d 100%)'
      el.style.padding = '28px'
      el.style.border = 'none'
      const png = await toPng(el, { pixelRatio: 3, cacheBust: true })
      el.setAttribute('style', prevStyle)
      const a = document.createElement('a')
      a.href = png
      a.download = `facetime-wrapped-${data.year}.png`
      a.click()
    } catch (e) {
      console.error('PNG export failed:', e)
    }
  }

  const share = async () => {
    const text = [
      `My ${data.year} FaceTime Wrapped 📞`,
      `• ${toHours(data.totalSeconds)} hours on FaceTime`,
      `• ${formatNumber(data.totalCalls)} calls`,
      `• #1: ${data.topPerson.name} ${data.topPerson.emoji}`,
      `• ${data.uniquePeople} different people`,
      `• ${data.longestStreak.days}-day streak 🔥 with ${data.longestStreak.name}`,
    ].join('\n')
    try {
      if (navigator.share) await navigator.share({ title: 'FaceTime Wrapped', text })
      else { await navigator.clipboard.writeText(text); alert('Stats copied to clipboard!') }
    } catch { /* cancelled */ }
  }

  return (
    <div className="slide share-slide">
      <Reveal delay={0}><span className="kicker">That's a wrap! 🎬</span></Reveal>

      <div className="share-card" ref={cardRef}>
        <div className="share-card-header">
          <span className="share-card-year">{data.year}</span>
          <span className="share-card-title">FaceTime Wrapped</span>
        </div>
        <div className="share-grid">
          <ShareCell big={`${toHours(data.totalSeconds)}h`}   small="on FaceTime"  delay={0.15} />
          <ShareCell big={data.topPerson.name}                small="your #1"      delay={0.25} accent />
          <ShareCell big={data.uniquePeople}                  small="people called" delay={0.35} />
          <ShareCell big={`${data.longestStreak.days} 🔥`}   small="day streak"   delay={0.45} />
        </div>
        {data.achievements?.length > 0 && (
          <motion.div
            className="achievement-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {data.achievements.map(a => (
              <div key={a.id} className="badge">
                <span className="badge-emoji">{a.emoji}</span>
                <span className="badge-label">{a.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        className="share-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <button className="btn-share-main" onClick={share}>Share my Wrapped</button>
        <div className="share-secondary">
          <button className="btn-share-alt" onClick={downloadPng}>Save as image</button>
          <button className="btn-share-alt" onClick={onRestart}>Start over</button>
        </div>
      </motion.div>
    </div>
  )
}

function ShareCell({ big, small, accent, delay = 0 }) {
  return (
    <motion.div
      className={`share-cell${accent ? ' accent' : ''}`}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="share-cell-big">{big}</div>
      <div className="share-cell-small">{small}</div>
    </motion.div>
  )
}

// ── Slide registry ────────────────────────────────────────────────────────────
export function buildSlides(data) {
  return [
    { theme: 'cover',   Component: CoverSlide        },
    { theme: 'time',    Component: TotalTimeSlide     },
    { theme: 'longest', Component: LongestCallSlide   },
    { theme: 'person',  Component: TopPersonSlide     },
    { theme: 'board',   Component: LeaderboardSlide   },
    { theme: 'day',     Component: BusiestDaySlide    },
    { theme: 'people',  Component: UniquePeopleSlide  },
    { theme: 'streak',  Component: StreakSlide        },
    { theme: 'late',    Component: LateNightSlide     },
    ...(data.places?.length > 0 ? [{ theme: 'places', Component: PlacesSlide }] : []),
    { theme: 'share',   Component: ShareSlide         },
  ]
}
