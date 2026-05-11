// ── Dock ────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'

const DOCK_ITEMS = [
  { id: 'voice',   emoji: '🎙️', label: 'Voice AI',  action: 'panel' },
  { id: 'browser', emoji: '🌐', label: 'Browser',   action: 'panel' },
  { id: 'metrics', emoji: '📊', label: 'Vitals',    action: 'panel' },
  { id: 'apps',    emoji: '⬡',  label: 'Apps',      action: 'panel' },
  { id: 'sep' },
  { id: 'palette', emoji: '⌘',  label: 'Cmd ⌘K',   action: 'palette' },
  { id: 'sleep',   emoji: '◐',  label: 'Sleep',     action: 'sleep' },
  { id: 'power',   emoji: '⏻',  label: 'Shutdown',  action: 'shutdown' },
]

export default function Dock({ runCommand }) {
  const { togglePanel, togglePalette, panels } = useOSStore()
  const [hovered, setHovered] = useState(null)

  const handleClick = (item) => {
    if (item.action === 'panel')    togglePanel(item.id)
    if (item.action === 'palette')  togglePalette()
    if (item.action === 'sleep')    runCommand('sleep mode')
    if (item.action === 'shutdown') runCommand('shutdown assistant')
  }

  return (
    <nav style={{
      height: 62, display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8, padding: '0 24px',
      background: 'rgba(2,8,18,0.88)',
      borderTop: '1px solid rgba(0,180,255,0.15)',
      backdropFilter: 'blur(20px)',
      position: 'relative', zIndex: 100, flexShrink: 0,
    }}>
      {DOCK_ITEMS.map((item) => {
        if (item.id === 'sep') {
          return <div key="sep" style={{ width: 1, height: 28, background: 'rgba(0,180,255,0.15)', margin: '0 4px' }} />
        }
        const isActive = item.action === 'panel' && panels[item.id]?.visible
        return (
          <motion.div
            key={item.id}
            onHoverStart={() => setHovered(item.id)}
            onHoverEnd={() => setHovered(null)}
            whileHover={{ y: -10, scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
            onClick={() => handleClick(item)}
            style={{ position: 'relative', cursor: 'pointer' }}
          >
            {/* Tooltip */}
            {hovered === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute', bottom: 54, left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(2,8,18,0.96)',
                  border: '1px solid rgba(0,180,255,0.2)',
                  borderRadius: 6, padding: '4px 10px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: 'var(--c-text)', letterSpacing: 1,
                  pointerEvents: 'none',
                }}
              >
                {item.label}
              </motion.div>
            )}

            {/* Icon */}
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              background: isActive
                ? 'rgba(0,180,255,0.14)'
                : 'rgba(0,180,255,0.06)',
              border: `1px solid ${isActive ? 'rgba(0,180,255,0.35)' : 'rgba(0,180,255,0.15)'}`,
              boxShadow: isActive ? '0 0 16px rgba(0,180,255,0.2)' : 'none',
              transition: 'all 0.2s',
            }}>
              {item.emoji}
            </div>

            {/* Active dot */}
            {isActive && (
              <div style={{
                position: 'absolute', bottom: -6, left: '50%',
                transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: '50%',
                background: 'var(--c-cyan2)',
                boxShadow: '0 0 6px var(--c-cyan2)',
              }} />
            )}
          </motion.div>
        )
      })}
    </nav>
  )
}