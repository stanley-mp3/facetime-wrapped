import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './components/Landing'
import Upload from './components/Upload'
import Story from './components/Story'
import { demoStats } from './data/demo'

// screen: 'landing' | 'upload' | 'story'
export default function App() {
  const [screen, setScreen] = useState('landing')
  const [stats, setStats] = useState(null)

  const startDemo = () => {
    setStats(demoStats)
    setScreen('story')
  }

  const openUpload = () => setScreen('upload')

  const onUploadDone = (parsedStats) => {
    setStats(parsedStats)
    setScreen('story')
  }

  const restart = () => {
    setStats(null)
    setScreen('landing')
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'landing' && (
        <motion.div key="landing" className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Landing onDemo={startDemo} onUpload={openUpload} />
        </motion.div>
      )}

      {screen === 'upload' && (
        <motion.div key="upload" className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Upload onDone={onUploadDone} onBack={() => setScreen('landing')} />
        </motion.div>
      )}

      {screen === 'story' && stats && (
        <motion.div key="story" className="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Story data={stats} onRestart={restart} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
