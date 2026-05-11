// ── MicButton ───────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'

export default function MicButton({ onToggle }) {
  const { micActive, sleeping } = useOSStore()

  const icon    = sleeping ? '💤' : micActive ? '🎙️' : '🎤'
  const label   = sleeping ? 'SLEEPING — click to wake'
                           : micActive ? 'LISTENING — click to stop'
                           : 'STANDBY — click to start'

  const borderColor = sleeping   ? 'rgba(124,58,237,0.5)'
                    : micActive  ? 'rgba(0,229,255,0.7)'
                    : 'rgba(0,180,255,0.3)'

  const glow = sleeping
    ? '0 0 20px rgba(124,58,237,0.35)'
    : micActive
    ? '0 0 20px rgba(0,229,255,0.5), 0 0 50px rgba(0,180,255,0.15)'
    : '0 0 10px rgba(0,180,255,0.15)'

  const bg = sleeping
    ? 'radial-gradient(circle, rgba(124,58,237,0.15), rgba(60,20,120,0.08))'
    : micActive
    ? 'radial-gradient(circle, rgba(0,229,255,0.14), rgba(0,100,200,0.06))'
    : 'radial-gradient(circle, rgba(0,180,255,0.08), rgba(0,60,120,0.04))'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flexShrink: 0 }}>
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={micActive && !sleeping ? {
          boxShadow: [
            '0 0 0 0px rgba(0,229,255,0.5)',
            '0 0 0 18px rgba(0,229,255,0)',
          ],
        } : { boxShadow: glow }}
        transition={micActive && !sleeping
          ? { duration: 1.5, repeat: Infinity, ease: 'easeOut' }
          : { duration: 0.3 }}
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: bg,
          border: `2px solid ${borderColor}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26,
          boxShadow: glow,
          outline: 'none',
          transition: 'background 0.3s, border-color 0.3s',
        }}
        aria-label={label}
        title={label}
      >
        {icon}
      </motion.button>

      {/* Status pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 14px', borderRadius: 20,
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1,
        background: sleeping
          ? 'rgba(124,58,237,0.1)' : micActive
          ? 'rgba(0,255,170,0.08)' : 'rgba(0,180,255,0.06)',
        border: `1px solid ${sleeping
          ? 'rgba(124,58,237,0.3)' : micActive
          ? 'rgba(0,255,170,0.3)' : 'rgba(0,180,255,0.2)'}`,
        color: sleeping ? '#a78bfa' : micActive ? 'var(--c-green)' : 'var(--c-muted)',
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%',
          background: sleeping ? '#a78bfa' : micActive ? 'var(--c-green)' : 'var(--c-muted)',
          animation: sleeping ? 'none' : 'dotPulse 1.4s ease-in-out infinite',
        }} />
        {sleeping ? 'SLEEP MODE' : micActive ? 'LISTENING' : 'STANDBY'}
      </div>

      <p style={{ fontSize: 10, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)',
        textAlign: 'center', maxWidth: 200, lineHeight: 1.5 }}>
        {sleeping ? 'Say "Hey Nova" or click to wake' : micActive
          ? 'Listening for commands…' : 'Click to activate voice control'}
      </p>
    </div>
  )
}