// ── CommandChips ────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'

const CHIPS = [
  { label: '▶ YouTube', cmd: 'open youtube' },
  { label: '◎ GitHub',  cmd: 'open github'  },
  { label: '⬡ Google',  cmd: 'open google'  },
  { label: '🔢 Calc',   cmd: 'open calculator' },
  { label: '🎵 Spotify', cmd: 'open spotify' },
  { label: '◐ Sleep',   cmd: 'sleep mode'   },
]

export default function CommandChips({ onCommand }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, flexShrink: 0 }}>
      {CHIPS.map((chip) => (
        <motion.button
          key={chip.cmd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => onCommand(chip.cmd)}
          style={{
            padding: '4px 11px', borderRadius: 20,
            fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 0.5,
            background: 'rgba(0,180,255,0.06)',
            border: '1px solid rgba(0,180,255,0.15)',
            color: 'var(--c-muted)', cursor: 'pointer',
            transition: 'all 0.2s', outline: 'none',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(0,180,255,0.14)'
            e.target.style.borderColor = 'rgba(0,180,255,0.35)'
            e.target.style.color = 'var(--c-cyan2)'
            e.target.style.boxShadow = '0 0 10px rgba(0,180,255,0.2)'
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(0,180,255,0.06)'
            e.target.style.borderColor = 'rgba(0,180,255,0.15)'
            e.target.style.color = 'var(--c-muted)'
            e.target.style.boxShadow = 'none'
          }}
        >
          {chip.label}
        </motion.button>
      ))}
    </div>
  )
}