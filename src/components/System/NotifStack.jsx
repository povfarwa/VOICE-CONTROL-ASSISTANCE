// ── NotifStack ──────────────────────────────────────────────────────────────
import { AnimatePresence, motion } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'
import { notifVariants } from '../../animations/motionVariants.js'

export default function NotifStack() {
  const { notifications, dismissNotif } = useOSStore()

  return (
    <div style={{
      position: 'fixed', top: 54, right: 18,
      zIndex: 200, display: 'flex',
      flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            variants={notifVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => dismissNotif(n.id)}
            style={{
              background: 'rgba(2,8,20,0.96)',
              border: '1px solid rgba(0,180,255,0.3)',
              borderRadius: 10, padding: '10px 16px',
              backdropFilter: 'blur(20px)',
              minWidth: 240, maxWidth: 320,
              boxShadow: '0 8px 28px rgba(0,0,0,0.4), 0 0 12px rgba(0,180,255,0.1)',
              cursor: 'pointer', pointerEvents: 'all',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-hud)', fontSize: 10,
              color: 'var(--c-cyan2)', letterSpacing: 2, marginBottom: 5,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'var(--c-cyan2)',
                boxShadow: '0 0 6px var(--c-cyan2)',
                display: 'inline-block',
              }} />
              ◈ {n.title.toUpperCase()}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--c-text)', lineHeight: 1.5,
            }}>
              {n.body}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}