// ── GlassPanel ──────────────────────────────────────────────────────────────
// Reusable draggable panel with glassmorphism styling.
// Wraps every floating window in the OS.

import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'
import { panelVariants } from '../../animations/motionVariants.js'

export default function GlassPanel({
  panelId,
  title,
  dotColor = 'var(--c-cyan2)',
  children,
  style = {},
  headerRight = null,
}) {
  const { panels, setPanelProp, bringToFront, togglePanel } = useOSStore()
  const panel   = panels[panelId]
  const dragRef = useRef({ dragging: false, dx: 0, dy: 0 })

  if (!panel) return null

  // ── Drag ──────────────────────────────────────────────────────────────
  const onTitleMouseDown = (e) => {
    if (e.button !== 0) return
    if (e.target.closest('[data-panel-btn]')) return
    dragRef.current.dragging = true
    dragRef.current.dx = e.clientX - panel.x
    dragRef.current.dy = e.clientY - panel.y
    bringToFront(panelId)

    const onMove = (me) => {
      if (!dragRef.current.dragging) return
      const nx = Math.max(0,   Math.min(window.innerWidth  - panel.w, me.clientX - dragRef.current.dx))
      const ny = Math.max(44,  Math.min(window.innerHeight - panel.h - 62, me.clientY - dragRef.current.dy))
      setPanelProp(panelId, { x: nx, y: ny })
    }
    const onUp = () => {
      dragRef.current.dragging = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    e.preventDefault()
  }

  return (
    <AnimatePresence>
      {panel.visible && (
        <motion.div
          className="nova-panel"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseDown={() => bringToFront(panelId)}
          style={{
            position: 'absolute',
            left: panel.x,
            top:  panel.y,
            width:  panel.w,
            height: panel.h,
            zIndex: panel.z || 10,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(8,20,40,0.72)',
            border: '1px solid rgba(0,180,255,0.15)',
            borderRadius: 12,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(0,180,255,0.1)',
            overflow: 'hidden',
            ...style,
          }}
        >
          {/* Title bar */}
          <div
            onMouseDown={onTitleMouseDown}
            style={{
              height: 36, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '0 14px',
              borderBottom: '1px solid rgba(0,180,255,0.12)',
              cursor: 'grab', flexShrink: 0,
              userSelect: 'none',
            }}
          >
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-hud)', fontSize: 10, fontWeight: 500,
              color: 'var(--c-cyan)', letterSpacing: 2 }}>
              <PulseDot color={dotColor} />
              {title}
            </div>

            {/* Right slot + traffic lights */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {headerRight}
              <TrafficLights onClose={() => togglePanel(panelId)} />
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PulseDot({ color }) {
  return (
    <div style={{
      width: 6, height: 6, borderRadius: '50%',
      background: color,
      boxShadow: `0 0 8px ${color}`,
      animation: 'dotPulse 2s ease-in-out infinite',
    }} />
  )
}

function TrafficLights({ onClose }) {
  return (
    <div style={{ display: 'flex', gap: 6 }} data-panel-btn="1">
      {[['#ff5f57', onClose], ['#ffbd2e', null], ['#28c940', null]].map(([bg, fn], i) => (
        <div
          key={i}
          data-panel-btn="1"
          onClick={fn}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            background: bg, cursor: fn ? 'pointer' : 'default',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.2)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
      ))}
    </div>
  )
}