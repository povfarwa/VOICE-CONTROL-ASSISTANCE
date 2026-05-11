// ── BootScreen ──────────────────────────────────────────────────────────────
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'

const LINES = [
  'INITIALIZING NEURAL CORE…',
  'LOADING VOICE RECOGNITION ENGINE…',
  'MOUNTING PARTICLE SUBSYSTEM…',
  'CALIBRATING HOLOGRAPHIC RENDERER…',
  'BOOTING NOVA OS v2.4.1…',
]

export default function BootScreen() {
  const { booted, setBooted } = useOSStore()

  useEffect(() => {
    const id = setTimeout(() => setBooted(true), 3000)
    return () => clearTimeout(id)
  }, [setBooted])

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 28,
          }}
        >
          {/* Logo */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontFamily: 'var(--font-hud)', fontSize: 40, fontWeight: 900,
              color: 'var(--c-cyan2)', letterSpacing: 10,
              textShadow: '0 0 30px var(--c-cyan), 0 0 80px rgba(0,229,255,0.3)',
            }}
          >
            NOVA OS
          </motion.div>

          {/* Progress bar */}
          <div style={{ width: 280 }}>
            <div style={{
              height: 2, background: 'rgba(0,180,255,0.12)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.6, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg, var(--c-cyan), var(--c-cyan2))',
                  boxShadow: '0 0 12px var(--c-cyan)',
                }}
              />
            </div>
          </div>

          {/* Boot log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minHeight: 100 }}>
            {LINES.map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.42, duration: 0.35 }}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--c-muted)', letterSpacing: 1.5,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ delay: i * 0.42, duration: 0.6 }}
                  style={{ color: 'var(--c-green)' }}
                >✓</motion.span>
                {line}
              </motion.div>
            ))}
          </div>

          {/* Version */}
          <div style={{
            position: 'absolute', bottom: 30,
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(0,180,255,0.2)', letterSpacing: 2,
          }}>
            NOVA AI ENGINE v2.4.1 · BUILD 2025
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}