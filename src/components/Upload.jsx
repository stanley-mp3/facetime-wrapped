import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseCallHistory } from '../data/parser'
import { processRecords } from '../data/processor'

const YEAR = 2025

const STEPS = [
  { n: 1, text: <>On your <strong>Mac</strong>, open Finder and press <kbd>⌘ Shift G</kbd></> },
  { n: 2, text: <>Paste: <code>~/Library/Application Support/CallHistoryDB</code></> },
  { n: 3, text: <>Drag <strong>CallHistory.storedata</strong> into the box below</> },
]

export default function Upload({ onDone, onBack }) {
  const [phase, setPhase] = useState('idle') // idle | loading | error
  const [errMsg, setErrMsg] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handle = async (file) => {
    if (!file) return
    setPhase('loading')
    try {
      const records = await parseCallHistory(file, YEAR)
      if (records.length === 0) {
        setErrMsg(`No FaceTime calls found for ${YEAR}. Make sure this is CallHistory.storedata from your Mac.`)
        setPhase('error')
        return
      }
      const stats = processRecords(records, YEAR)
      if (!stats) {
        setErrMsg('Could not compute stats from your data.')
        setPhase('error')
        return
      }
      onDone(stats)
    } catch (e) {
      console.error(e)
      setErrMsg('Could not read file. Make sure it\'s a valid CallHistory.storedata.')
      setPhase('error')
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handle(e.dataTransfer.files[0])
  }

  return (
    <div className="upload-screen">
      <div className="blob blob-a" style={{ opacity: 0.3 }} />
      <div className="blob blob-b" style={{ opacity: 0.2 }} />

      <motion.div
        className="upload-inner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2 className="upload-title">Use your real data</h2>
        <p className="upload-sub">
          FaceTime history lives in a local file on your Mac.<br />
          Nothing leaves your device — the file is read entirely in your browser.
        </p>

        <div className="steps-list">
          {STEPS.map(s => (
            <div className="upload-step" key={s.n}>
              <span className="step-num">{s.n}</span>
              <span className="step-text">{s.text}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="drop"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                style={{ display: 'none' }}
                onChange={e => handle(e.target.files[0])}
              />
              <div className="drop-icon">📂</div>
              <p className="drop-label">Drop <strong>CallHistory.storedata</strong> here</p>
              <p className="drop-hint">or tap to browse files</p>
            </motion.div>
          )}

          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="parse-loading"
            >
              <div className="spinner" />
              <p>Reading your calls…</p>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="parse-error"
            >
              <div className="error-icon">⚠️</div>
              <p>{errMsg}</p>
              <button className="retry-btn" onClick={() => setPhase('idle')}>Try again</button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="privacy-note">🔒 Your file never leaves your browser.</p>
      </motion.div>
    </div>
  )
}
