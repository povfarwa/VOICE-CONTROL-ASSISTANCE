// ── AppsPanel ───────────────────────────────────────────────────────────────
import { motion } from 'framer-motion'
import GlassPanel from '../OS/GlassPanel.jsx'
import useOSStore from '../../store/useOSStore.js'
import { APPS } from '../../config/appRegistry.js'
import { staggerChildren, appIconVariants } from '../../animations/motionVariants.js'

const GRID_APPS = APPS.slice(0, 12)

export default function AppsPanel({ onCommand }) {
  const { openTab, setPanelProp } = useOSStore()

  const launch = (app) => {
    openTab(app.url, app.label, app.emoji)
    setPanelProp('browser', { visible: true })
  }

  return (
    <GlassPanel panelId="apps" title="QUICK LAUNCH" dotColor="var(--c-amber)">
      <motion.div
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8, padding: 12,
          overflowY: 'auto',
        }}
      >
        {GRID_APPS.map(app => (
          <motion.div
            key={app.id}
            variants={appIconVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => launch(app)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 5, padding: '8px 4px',
              borderRadius: 9, cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,180,255,0.08)'
              e.currentTarget.style.borderColor = 'rgba(0,180,255,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'transparent'
            }}
          >
            <span style={{ fontSize: 24, lineHeight: 1 }}>{app.emoji}</span>
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-mono)',
              color: 'var(--c-muted)', textAlign: 'center',
              letterSpacing: 0.3, lineHeight: 1.3,
            }}>{app.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </GlassPanel>
  )
}