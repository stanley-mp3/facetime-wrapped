import { motion } from 'framer-motion'

const YEAR = 2025

export default function Landing({ onDemo, onUpload }) {
  return (
    <div className="landing">
      {/* Animated background blobs */}
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />

      <motion.div
        className="landing-inner"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="ft-icon"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="60" height="60" rx="14" fill="#34C759"/>
            <path d="M10 20C10 17.8 11.8 16 14 16H34C36.2 16 38 17.8 38 20V40C38 42.2 36.2 44 34 44H14C11.8 44 10 42.2 10 40V20Z" fill="white"/>
            <path d="M38 24.5L50 18V42L38 35.5V24.5Z" fill="white"/>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <div className="landing-year">{YEAR}</div>
          <h1 className="landing-title">FaceTime<br />Wrapped</h1>
          <p className="landing-sub">Your year in calls, revealed.</p>
        </motion.div>

        <motion.div
          className="landing-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <button className="btn-demo" onClick={onDemo}>
            See My Wrapped
          </button>
          <button className="btn-upload" onClick={onUpload}>
            Upload real data
          </button>
        </motion.div>

        <motion.p
          className="landing-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Demo uses sample data. Real data stays 100% on your device.
        </motion.p>
      </motion.div>
    </div>
  )
}
