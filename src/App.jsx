import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FaceTimeWrapped from './FaceTimeWrapped'

const flame = (a = 1) => `hsla(32, 94%, 68%, ${a})`

// ---------------------------------------------------------------------------
const POOL = 56
const MIN_PRESENT = 33
const MAX_PRESENT = 52
const CENTER = { x: 50, y: 47 }
const CLEAR_RADIUS = 15

function makeLanterns() {
  const out = []
  let guard = 0
  while (out.length < POOL && guard < POOL * 40) {
    guard++
    const x = 5 + Math.random() * 90
    const y = 12 + Math.random() * 80
    const dx = x - CENTER.x
    const dy = y - CENTER.y
    if (Math.sqrt(dx * dx + dy * dy) < CLEAR_RADIUS) continue
    out.push({
      id: out.length,
      x,
      y,
      size: 4 + Math.random() * 5,
      dur: 5 + Math.random() * 7,
      delay: -Math.random() * 8,
    })
  }
  return out
}

function useRoom() {
  const lanterns = useMemo(makeLanterns, [])
  const [present, setPresent] = useState(() => {
    const set = new Set()
    const ids = lanterns.map((l) => l.id).sort(() => Math.random() - 0.5)
    const start = 40 + Math.floor(Math.random() * 6)
    ids.slice(0, start).forEach((id) => set.add(id))
    return set
  })

  useEffect(() => {
    let timer
    const tick = () => {
      setPresent((prev) => {
        const next = new Set(prev)
        const here = [...next]
        const away = lanterns.map((l) => l.id).filter((id) => !next.has(id))

        const leaving = Math.random() < 0.7 ? 1 + Math.floor(Math.random() * 2) : 0
        const arriving = Math.random() < 0.7 ? 1 + Math.floor(Math.random() * 2) : 0

        for (let i = 0; i < leaving && next.size > MIN_PRESENT; i++) {
          const pick = here[Math.floor(Math.random() * here.length)]
          if (pick != null) next.delete(pick)
        }
        for (let i = 0; i < arriving && next.size < MAX_PRESENT; i++) {
          const pick = away[Math.floor(Math.random() * away.length)]
          if (pick != null) next.add(pick)
        }
        return next
      })
      timer = setTimeout(tick, 1600 + Math.random() * 1800)
    }
    timer = setTimeout(tick, 1800)
    return () => clearTimeout(timer)
  }, [lanterns])

  return { lanterns, present }
}

// ---------------------------------------------------------------------------
function Lantern({ l, on, flare }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${l.x}%`,
        top: `${l.y}%`,
        width: l.size,
        height: l.size,
        transform: `translate(-50%, -50%) scale(${flare ? 1.6 : 1})`,
        filter: `brightness(${flare ? 2.6 : 1})`,
        opacity: on ? 1 : 0,
        transition: 'opacity 2.8s ease-in-out, transform 0.8s ease-out, filter 0.8s ease-out',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${flame(0.98)} 0%, ${flame(0.55)} 35%, ${flame(0)} 70%)`,
          boxShadow: `0 0 ${l.size * 2.6}px ${flame(0.5)}`,
          animation: `twinkle ${l.dur}s ease-in-out ${l.delay}s infinite`,
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
function YourLantern({ active }) {
  const size = active ? 30 : 20
  return (
    <div
      className="absolute"
      style={{
        left: `${CENTER.x}%`,
        top: `${CENTER.y}%`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      {/* deep ambient warmth — always present, never zero */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: active ? 400 : 300,
          height: active ? 400 : 300,
          transform: 'translate(-50%, -50%)',
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${flame(0.55)} 0%, ${flame(0)} 62%)`,
          animation: 'ambient-warm 13s ease-in-out infinite',
          transition: 'all 2.5s ease-in-out',
        }}
      />
      {/* wide amber halo */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: active ? 340 : 240,
          height: active ? 340 : 240,
          transform: 'translate(-50%, -50%)',
          borderRadius: '9999px',
          background: `radial-gradient(circle, ${flame(active ? 0.28 : 0.18)} 0%, ${flame(0)} 65%)`,
          transition: 'all 2.5s ease-in-out',
        }}
      />
      {/* the flame itself */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '9999px',
          background: `radial-gradient(circle, #fff8ee 0%, ${flame(1)} 40%, ${flame(0)} 72%)`,
          boxShadow: `0 0 ${active ? 52 : 30}px ${flame(active ? 0.9 : 0.68)}`,
          animation: `${active ? 'pulse-session' : 'breathe'} ${active ? 4.5 : 6}s ease-in-out infinite`,
          transition: 'width 2.5s ease, height 2.5s ease, box-shadow 2.5s ease',
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
function WarmthButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-light tracking-[0.25em] transition-all duration-500 hover:scale-[1.04]"
      style={{ color: flame(0.45) }}
      onMouseEnter={(e) => (e.currentTarget.style.color = flame(0.75))}
      onMouseLeave={(e) => (e.currentTarget.style.color = flame(0.45))}
    >
      send warmth into the room
    </button>
  )
}

// ---------------------------------------------------------------------------
const fmt = (s) => {
  const m = Math.floor(s / 60)
  const ss = s % 60
  return `${m}:${ss.toString().padStart(2, '0')}`
}

export default function App() {
  const { lanterns, present } = useRoom()
  const count = present.size

  const [phase, setPhase] = useState('idle')
  const [remaining, setRemaining] = useState(0)
  const [satWith, setSatWith] = useState(0)
  const endRef = useRef(0)

  const [showWrapped, setShowWrapped] = useState(false)

  const [ripples, setRipples] = useState([])
  const [glows, setGlows] = useState([])
  const [flaring, setFlaring] = useState(() => new Set())
  const [whisper, setWhisper] = useState(null)
  const idRef = useRef(0)
  const nextId = () => (idRef.current += 1)

  const addEphemeral = useCallback((setter) => {
    const id = nextId()
    setter((list) => [...list, id])
    setTimeout(() => setter((list) => list.filter((x) => x !== id)), 1900)
  }, [])

  const sayWhisper = useCallback((text) => {
    const id = nextId()
    setWhisper({ id, text })
    setTimeout(() => setWhisper((w) => (w && w.id === id ? null : w)), 2300)
  }, [])

  const sendWarmth = useCallback(() => {
    addEphemeral(setRipples)
    addEphemeral(setGlows)
    const here = [...present].sort(() => Math.random() - 0.5)
    setFlaring(new Set(here.slice(0, 3 + Math.floor(Math.random() * 3))))
    setTimeout(() => setFlaring(new Set()), 720)
    sayWhisper('someone, somewhere, felt that')
  }, [addEphemeral, sayWhisper, present])

  const receiveWarmth = useCallback(() => {
    addEphemeral(setGlows)
    sayWhisper(Math.random() < 0.5 ? "you're being held" : 'warmth reached you')
  }, [addEphemeral, sayWhisper])

  const startSession = useCallback((minutes) => {
    endRef.current = Date.now() + minutes * 60 * 1000
    setRemaining(minutes * 60)
    setPhase('running')
  }, [])

  useEffect(() => {
    if (phase !== 'running') return
    const tick = () => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        setSatWith(present.size)
        setPhase('done')
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [phase, present])

  useEffect(() => {
    let t
    const schedule = (first) => {
      const wait = first ? 6000 + Math.random() * 6000 : 11000 + Math.random() * 23000
      t = setTimeout(() => {
        receiveWarmth()
        schedule(false)
      }, wait)
    }
    schedule(true)
    return () => clearTimeout(t)
  }, [receiveWarmth])

  const active = phase === 'running'

  return (
    <div className="room relative h-full w-full overflow-hidden select-none">
      {lanterns.map((l) => (
        <Lantern key={l.id} l={l} on={present.has(l.id)} flare={flaring.has(l.id)} />
      ))}

      <YourLantern active={active} />

      {glows.map((id) => (
        <div
          key={id}
          className="absolute"
          style={{
            left: `${CENTER.x}%`,
            top: `${CENTER.y}%`,
            width: 300,
            height: 300,
            borderRadius: '9999px',
            background: `radial-gradient(circle, ${flame(0.58)} 0%, ${flame(0.22)} 32%, ${flame(0)} 64%)`,
            animation: 'warm-flare 1.8s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      {ripples.map((id) => (
        <div
          key={id}
          className="absolute"
          style={{
            left: `${CENTER.x}%`,
            top: `${CENTER.y}%`,
            width: 460,
            height: 460,
            borderRadius: '9999px',
            border: `1px solid ${flame(0.5)}`,
            boxShadow: `0 0 32px ${flame(0.24)}, inset 0 0 32px ${flame(0.14)}`,
            animation: 'ripple 1.9s ease-out forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      {whisper && (
        <div
          key={whisper.id}
          className="absolute inset-x-0 text-center"
          style={{ top: '64%', pointerEvents: 'none' }}
        >
          <span
            className="text-sm font-light tracking-[0.25em]"
            style={{ color: flame(0.78), animation: 'whisper 2.3s ease-in-out forwards' }}
          >
            {whisper.text}
          </span>
        </div>
      )}

      {/* your lantern's quiet label */}
      {phase !== 'done' && (
        <div
          className="absolute text-center"
          style={{
            left: `${CENTER.x}%`,
            top: `calc(${CENTER.y}% + ${active ? 42 : 30}px)`,
            transform: 'translateX(-50%)',
            transition: 'top 2.5s ease',
          }}
        >
          <span
            className="text-[11px] tracking-[0.35em] uppercase"
            style={{ color: flame(active ? 0.75 : 0.55) }}
          >
            your lantern
          </span>
        </div>
      )}

      <header className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 pt-[8vh] text-center">
        <h1
          className="text-lg font-light tracking-wide rise"
          style={{ color: flame(0.96) }}
        >
          you're not the only one awake
        </h1>
        <p
          className="text-sm font-light rise-slow"
          style={{ color: flame(0.5) }}
        >
          <span style={{ color: flame(0.88) }}>{count}</span> people are quietly working right now
        </p>
      </header>

      <footer className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-[9vh]">
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-5 rise">
            <button
              onClick={() => setPhase('choosing')}
              className="rounded-full border px-7 py-3 text-sm font-light tracking-wide transition-all duration-700 hover:scale-[1.03]"
              style={{
                color: flame(0.92),
                borderColor: flame(0.35),
                background: flame(0.05),
                boxShadow: `0 0 28px ${flame(0.15)}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = flame(0.65)
                e.currentTarget.style.boxShadow = `0 0 38px ${flame(0.26)}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = flame(0.35)
                e.currentTarget.style.boxShadow = `0 0 28px ${flame(0.15)}`
              }}
            >
              begin a quiet session
            </button>
            <WarmthButton onClick={sendWarmth} />
            <button
              onClick={() => setShowWrapped(true)}
              className="text-xs font-light tracking-[0.2em] transition-all duration-500 hover:scale-[1.04]"
              style={{ color: flame(0.32) }}
              onMouseEnter={(e) => (e.currentTarget.style.color = flame(0.6))}
              onMouseLeave={(e) => (e.currentTarget.style.color = flame(0.32))}
            >
              facetime wrapped ›
            </button>
          </div>
        )}

        {phase === 'choosing' && (
          <div className="flex flex-col items-center gap-5 rise">
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: flame(0.5) }}>
              how long will you sit?
            </span>
            <div className="flex gap-4">
              {[25, 50].map((m) => (
                <button
                  key={m}
                  onClick={() => startSession(m)}
                  className="rounded-full border px-6 py-3 text-sm font-light tracking-wide transition-all duration-500 hover:scale-[1.05]"
                  style={{
                    color: flame(0.92),
                    borderColor: flame(0.35),
                    background: flame(0.05),
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = flame(0.65))}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = flame(0.35))}
                >
                  {m} min
                </button>
              ))}
            </div>
            <button
              onClick={() => setPhase('idle')}
              className="text-xs font-light tracking-wide transition-opacity hover:opacity-100"
              style={{ color: flame(0.3), opacity: 0.7 }}
            >
              not yet
            </button>
          </div>
        )}

        {phase === 'running' && (
          <div className="flex flex-col items-center gap-1 rise">
            <span
              className="text-2xl font-extralight tabular-nums tracking-widest"
              style={{ color: flame(0.6) }}
            >
              {fmt(remaining)}
            </span>
            <span className="text-[11px] tracking-[0.3em] uppercase" style={{ color: flame(0.28) }}>
              quietly working
            </span>
          </div>
        )}

        {phase === 'done' && (
          <div className="flex flex-col items-center gap-6 rise-slow text-center">
            <p className="text-lg font-light tracking-wide" style={{ color: flame(0.92) }}>
              you sat with {satWith} others
            </p>
            <button
              onClick={() => setPhase('idle')}
              className="rounded-full border px-6 py-2.5 text-sm font-light tracking-wide transition-all duration-500 hover:scale-[1.03]"
              style={{ color: flame(0.75), borderColor: flame(0.28), background: flame(0.04) }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = flame(0.55))}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = flame(0.28))}
            >
              stay a while
            </button>
            <WarmthButton onClick={sendWarmth} />
          </div>
        )}
      </footer>

      {showWrapped && <FaceTimeWrapped onClose={() => setShowWrapped(false)} />}
    </div>
  )
}
