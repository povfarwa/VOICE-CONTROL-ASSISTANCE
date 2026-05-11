// ── useMetrics ─────────────────────────────────────────────────────────────
// Simulates live CPU / Memory / Network / AI-core metrics with smooth
// randomised drift. Updates every 2 s, writes to Zustand store.

import { useEffect, useRef } from 'react'
import useOSStore from '../store/useOSStore.js'

function drift(current, min, max, step) {
  const next = current + (Math.random() - 0.5) * step
  return Math.max(min, Math.min(max, next))
}

export default function useMetrics() {
  const { setMetrics, startTime, micActive } = useOSStore()
  const ref = useRef({ cpu: 42, mem: 61, net: 28, ai: 88 })

  useEffect(() => {
    const tick = () => {
      const m = ref.current
      m.cpu = drift(m.cpu, 10, 94, 9)
      m.mem = drift(m.mem, 28, 88, 3)
      m.net = drift(m.net, 4,  80, 12)
      // AI cores spike when mic is active
      const aiTarget = micActive ? 92 : 70
      m.ai = m.ai + (aiTarget - m.ai) * 0.15 + (Math.random() - 0.5) * 5
      m.ai = Math.max(40, Math.min(99, m.ai))

      setMetrics({
        cpu:    Math.round(m.cpu),
        mem:    Math.round(m.mem),
        net:    Math.round(m.net),
        ai:     Math.round(m.ai),
        uptime: Date.now() - startTime,
      })
    }

    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [micActive, setMetrics, startTime])
}