import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { buildSlides } from '../slides'

const SLIDE_MS = 6500

export default function Story({ data, onRestart }) {
  const slides = useMemo(() => buildSlides(data), [data])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Key changes each time we (re)enter a slide to restart the timer fill
  const [fillKey, setFillKey] = useState(0)

  const current = slides[index]
  const atEnd = index === slides.length - 1

  const goTo = useCallback((i) => {
    setIndex(Math.max(0, Math.min(i, slides.length - 1)))
    setFillKey(k => k + 1)
  }, [slides.length])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  // Auto-advance (except final slide)
  useEffect(() => {
    if (paused || atEnd) return
    const t = setTimeout(next, SLIDE_MS)
    return () => clearTimeout(t)
  }, [index, paused, atEnd, next])

  // Keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const handlePointerDown = (e) => {
    // Don't steal events from buttons
    if (e.target.closest('button')) return
    setPaused(true)
  }
  const handlePointerUp = (e) => {
    if (e.target.closest('button')) return
    setPaused(false)
  }
  const handleClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    const x = e.clientX
    const w = window.innerWidth
    if (x < w * 0.3) prev()
    else next()
  }

  return (
    <div className={`stage theme-${current.theme}`}>
      {/* Background decorative blobs (theme-specific colours via CSS vars) */}
      <div className="slide-blob blob-1" />
      <div className="slide-blob blob-2" />

      {/* Progress bars */}
      <div className="progress-row" onClick={e => e.stopPropagation()}>
        {slides.map((_, i) => (
          <div
            key={i}
            className="progress-track"
            onClick={() => goTo(i)}
            role="button"
            aria-label={`Go to slide ${i + 1}`}
          >
            {i < index && <div className="progress-fill full" />}
            {i === index && (
              <div
                key={fillKey}
                className="progress-fill active"
                style={{
                  animationDuration: `${SLIDE_MS}ms`,
                  animationPlayState: paused || atEnd ? 'paused' : 'running',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Tap / click layer */}
      <div
        className="tap-layer"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="slide-wrapper"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <current.Component data={data} onRestart={onRestart} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
