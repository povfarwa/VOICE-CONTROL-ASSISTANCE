// ── VoiceFloater ────────────────────────────────────────────────────────────
// Shows interim (real-time) speech recognition text in a floating pill.

import { AnimatePresence, motion } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'
import { floaterVariants } from '../../animations/motionVariants.js'

const WAVE_DELAYS = [0, 0.1, 0.2, 0.15, 0.05]

export default function VoiceFloater() {
  const { interimText, micActive } = useOSStore()
  const show = micActive && !!interimText

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          variants={floaterVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed', bottom: 76, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'rgba(2,8,18,0.94)',
            border: '1px solid rgba(0,180,255,0.32)',
            borderRadius: 30, padding: '9px 22px',
            fontFamily: 'var(--font-mono)', fontSize: 12,
            color: 'var(--c-cyan2)',
            backdropFilter: 'blur(20px)',
            zIndex: 150,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 12px rgba(0,180,255,0.2)',
            whiteSpace: 'nowrap', maxWidth: '80vw',
            overflow: 'hidden', textOverflow: 'ellipsis',
            pointerEvents: 'none',
          }}
        >
          {/* Animated wave bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
            {WAVE_DELAYS.map((delay, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [0.3, 1, 0.3] }}
                transition={{ duration: 0.7, repeat: Infinity, delay, ease: 'easeInOut' }}
                style={{
                  width: 3, borderRadius: 2,
                  background: 'var(--c-cyan2)',
                  boxShadow: '0 0 4px var(--c-cyan)',
                  height: [8, 16, 12, 20, 10][i],
                  transformOrigin: 'center',
                }}
              />
            ))}
          </div>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {interimText}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}