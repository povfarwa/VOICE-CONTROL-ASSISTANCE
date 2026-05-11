// ── Waveform ────────────────────────────────────────────────────────────────
// Animated bar waveform — intensifies when mic is active or AI is speaking.

import { useEffect, useRef } from 'react'
import useOSStore from '../../store/useOSStore.js'

export default function Waveform() {
  const canvasRef = useRef(null)
  const frameRef  = useRef(0)
  const rafRef    = useRef(null)
  const { micActive, speaking } = useOSStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const BARS = 42

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      frameRef.current++
      const f = frameRef.current

      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < BARS; i++) {
        const t = i / BARS

        let amp
        if (micActive) {
          amp = 6 + Math.random() * 30 + Math.sin(f * 0.09 + i * 0.45) * 14
        } else if (speaking) {
          amp = 4 + Math.sin(f * 0.14 + i * 0.6) * 18 + Math.random() * 8
        } else {
          amp = 2 + Math.sin(f * 0.04 + i * 0.3) * 3
        }

        amp = Math.max(2, amp)
        const x   = (W / BARS) * i
        const barW = W / BARS - 1
        const mid  = H / 2

        const grad = ctx.createLinearGradient(0, mid - amp, 0, mid + amp)
        if (micActive) {
          grad.addColorStop(0,   'rgba(0,229,255,0.9)')
          grad.addColorStop(0.5, 'rgba(0,180,255,0.4)')
          grad.addColorStop(1,   'rgba(0,229,255,0.9)')
        } else if (speaking) {
          grad.addColorStop(0,   'rgba(0,255,170,0.9)')
          grad.addColorStop(0.5, 'rgba(0,200,130,0.4)')
          grad.addColorStop(1,   'rgba(0,255,170,0.9)')
        } else {
          grad.addColorStop(0,   'rgba(0,180,255,0.3)')
          grad.addColorStop(0.5, 'rgba(0,100,180,0.1)')
          grad.addColorStop(1,   'rgba(0,180,255,0.3)')
        }

        ctx.fillStyle = grad
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(x, mid - amp, barW, amp * 2, 2)
        } else {
          ctx.rect(x, mid - amp, barW, amp * 2)
        }
        ctx.fill()
      }
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [micActive, speaking])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%', height: 68, borderRadius: 8,
        background: 'rgba(0,14,30,0.65)',
        border: '1px solid rgba(0,180,255,0.12)',
        flexShrink: 0,
      }}
    />
  )
}