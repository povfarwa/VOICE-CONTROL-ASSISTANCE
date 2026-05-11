// ── TopBar ──────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react'
import useOSStore from '../../store/useOSStore.js'
import { formatClock, formatDate, formatPercent, formatUptime } from '../../utils/formatTime.js'

export default function TopBar() {
  const { metrics, voiceStatus, startTime } = useOSStore()
  const [clock, setClock] = useState(formatClock())
  const [date,  setDate]  = useState(formatDate())

  useEffect(() => {
    const id = setInterval(() => {
      setClock(formatClock())
      setDate(formatDate())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const statusColor = {
    listening: '#00ffaa',
    speaking:  '#00e5ff',
    sleeping:  '#a78bfa',
    standby:   'rgba(120,170,220,0.5)',
  }[voiceStatus] || 'rgba(120,170,220,0.5)'

  return (
    <header style={{
      height: 44, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px',
      background: 'rgba(2,8,18,0.92)',
      borderBottom: '1px solid rgba(0,180,255,0.15)',
      backdropFilter: 'blur(20px)',
      position: 'relative', zIndex: 100, flexShrink: 0,
    }}>
      {/* Logo */}
      <span style={{
        fontFamily: 'var(--font-hud)', fontSize: 13, fontWeight: 700,
        color: 'var(--c-cyan2)', letterSpacing: 3,
        textShadow: '0 0 20px var(--c-cyan), 0 0 40px rgba(0,229,255,0.3)',
      }}>
        ◈ NOVA OS
      </span>

      {/* Centre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20,
        fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--c-muted)', letterSpacing: 1 }}>
        <span style={{ color: statusColor, fontSize: 10, letterSpacing: 2 }}>
          ● {voiceStatus.toUpperCase()}
        </span>
        <span style={{ color: 'rgba(0,180,255,0.25)' }}>|</span>
        <span>{date}</span>
        <span style={{ color: 'rgba(0,180,255,0.25)' }}>|</span>
        <span style={{ color: 'var(--c-muted)', fontSize: 10 }}>
          UP {formatUptime(startTime)}
        </span>
      </div>

      {/* Right — metrics + clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <MetricBar label="CPU" value={metrics.cpu} color="linear-gradient(90deg,#00b4ff,#00e5ff)" />
        <MetricBar label="MEM" value={metrics.mem} color="linear-gradient(90deg,#7c3aed,#a78bfa)" />
        <MetricBar label="AI"  value={metrics.ai}  color="linear-gradient(90deg,#f43f8a,#ff6baa)" />
        <span style={{
          fontFamily: 'var(--font-hud)', fontSize: 14,
          color: 'var(--c-cyan)', letterSpacing: 2,
          textShadow: '0 0 14px var(--c-cyan)',
          minWidth: 80, textAlign: 'right',
        }}>
          {clock}
        </span>
      </div>
    </header>
  )
}

function MetricBar({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6,
      fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--c-muted)' }}>
      <span>{label}</span>
      <div style={{ width: 44, height: 3, background: 'rgba(0,180,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value}%`, background: color, borderRadius: 2,
          transition: 'width 1.4s ease',
          boxShadow: '0 0 6px rgba(0,180,255,0.4)',
        }} />
      </div>
      <span style={{ color: 'var(--c-cyan2)', minWidth: 28 }}>{value}%</span>
    </div>
  )
}