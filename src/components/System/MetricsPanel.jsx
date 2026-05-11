// ── MetricsPanel ────────────────────────────────────────────────────────────
import GlassPanel from '../OS/GlassPanel.jsx'
import useOSStore from '../../store/useOSStore.js'
import { formatUptime, formatPercent } from '../../utils/formatTime.js'

const BARS = [
  { key: 'cpu', label: 'CPU LOAD', color: 'linear-gradient(90deg,#00b4ff,#00e5ff)', min: 0, max: 100 },
  { key: 'mem', label: 'MEMORY',   color: 'linear-gradient(90deg,#7c3aed,#a78bfa)', min: 0, max: 100 },
  { key: 'net', label: 'NETWORK',  color: 'linear-gradient(90deg,#00ffaa,#00e5ff)', min: 0, max: 100 },
  { key: 'ai',  label: 'AI CORES', color: 'linear-gradient(90deg,#f43f8a,#ff6baa)', min: 0, max: 100 },
]

export default function MetricsPanel() {
  const { metrics, startTime } = useOSStore()

  return (
    <GlassPanel panelId="metrics" title="SYSTEM VITALS" dotColor="#7c3aed">
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {BARS.map(bar => (
          <div key={bar.key} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1,
            }}>
              <span style={{ color: 'var(--c-muted)' }}>{bar.label}</span>
              <span style={{ color: 'var(--c-cyan2)' }}>{formatPercent(metrics[bar.key] || 0)}</span>
            </div>
            <div style={{
              height: 4, background: 'rgba(0,180,255,0.08)',
              borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${metrics[bar.key] || 0}%`,
                background: bar.color, borderRadius: 2,
                transition: 'width 1.4s ease',
                boxShadow: '0 0 8px rgba(0,180,255,0.25)',
              }} />
            </div>
          </div>
        ))}

        {/* Uptime */}
        <div style={{
          paddingTop: 8, borderTop: '1px solid rgba(0,180,255,0.1)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1,
        }}>
          <span style={{ color: 'var(--c-muted)' }}>UPTIME</span>
          <span style={{ color: 'var(--c-green)',
            textShadow: '0 0 8px var(--c-green)' }}>
            {formatUptime(startTime)}
          </span>
        </div>

        {/* Status */}
        <div style={{
          display: 'flex', gap: 6, flexWrap: 'wrap',
        }}>
          {['CORE 0','CORE 1','NEURAL','VOICE'].map((c, i) => (
            <div key={c} style={{
              padding: '2px 8px', borderRadius: 4,
              background: 'rgba(0,255,170,0.06)',
              border: '1px solid rgba(0,255,170,0.2)',
              fontFamily: 'var(--font-mono)', fontSize: 9,
              color: 'var(--c-green)', letterSpacing: 1,
            }}>
              {c} ●
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  )
}