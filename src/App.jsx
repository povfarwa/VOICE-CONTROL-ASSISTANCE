// ── App.jsx ─────────────────────────────────────────────────────────────────
// Root component. Initialises all hooks and renders the full OS.

import { useEffect } from 'react'
import useOSStore            from './store/useOSStore.js'
import useVoiceRecognition   from './hooks/useVoiceRecognition.js'
import useMetrics            from './hooks/useMetrics.js'
import useKeyboardShortcuts  from './hooks/useKeyboardShortcuts.js'

import BootScreen   from './components/OS/BootScreen.jsx'
import OSShell      from './components/OS/OSShell.jsx'
import CustomCursor from './components/FX/CustomCursor.jsx'
import ParticleCanvas from './components/FX/ParticleCanvas.jsx'
import ThreeScene   from './components/FX/ThreeScene.jsx'

export default function App() {
  const { booted, pushNotif, settings } = useOSStore()

  // ── Core hooks ────────────────────────────────────────────────────────
  const { toggleMic, runCommand } = useVoiceRecognition()
  useMetrics()
  useKeyboardShortcuts(toggleMic)

  // ── Startup notifications ─────────────────────────────────────────────
  useEffect(() => {
    if (!booted) return
    const t1 = setTimeout(() => pushNotif('NOVA OS', 'System initialized. Say "Hey Nova" or click the mic.', 4000), 400)
    const t2 = setTimeout(() => pushNotif('Voice AI', 'Try: "open YouTube" or "search React hooks"', 5500), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [booted, pushNotif])

  return (
    <>
      {/* ── Boot overlay ── */}
      <BootScreen />

      {/* ── Background FX (behind everything) ── */}
      {settings.threeEnabled    && <ThreeScene />}
      {settings.particlesEnabled && <ParticleCanvas />}

      {/* ── Static overlays ── */}
      <div className="scanlines"   aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {/* ── Custom cursor ── */}
      <CustomCursor />

      {/* ── OS UI (only rendered after boot) ── */}
      {booted && <OSShell toggleMic={toggleMic} runCommand={runCommand} />}
    </>
  )
}