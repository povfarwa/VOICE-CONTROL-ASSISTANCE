// ── ParticleCanvas ──────────────────────────────────────────────────────────
// Raw canvas particle system — no external library needed.
// Particles drift, connect with lines, and repel from the cursor.

import { useEffect, useRef } from 'react'
import { particleConfig, colors } from '../../config/theme.js'

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouse     = useRef({ x: -999, y: -999 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W, H, particles = [], raf

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    // Build particles
    function mkParticle() {
      const colorBase = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)]
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * particleConfig.speed,
        vy: (Math.random() - 0.5) * particleConfig.speed,
        r:  Math.random() * (particleConfig.sizeMax - particleConfig.sizeMin) + particleConfig.sizeMin,
        color: colorBase,
        phase: Math.random() * Math.PI * 2,
      }
    }
    for (let i = 0; i < particleConfig.count; i++) particles.push(mkParticle())

    let frame = 0
    function draw() {
      raf = requestAnimationFrame(draw)
      frame++
      ctx.clearRect(0, 0, W, H)

      // Radial vignette
      const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7)
      g.addColorStop(0, 'rgba(0,20,50,0.25)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, W, H)

      // Update + draw particles
      particles.forEach((p, i) => {
        // Subtle cursor repulsion
        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 90) {
          p.vx += (dx / dist) * 0.08
          p.vy += (dy / dist) * 0.08
        }

        // Speed cap
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd > 1.2) { p.vx *= 0.97; p.vy *= 0.97 }

        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        const alpha = 0.25 + 0.4 * Math.sin(frame * 0.012 + p.phase)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + alpha + ')'
        ctx.fill()

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q  = particles[j]
          const ex = p.x - q.x, ey = p.y - q.y
          const ed = Math.sqrt(ex * ex + ey * ey)
          if (ed < particleConfig.connectDistance) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0,180,255,${0.06 * (1 - ed / particleConfig.connectDistance)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      })
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0, display: 'block',
        pointerEvents: 'none',
      }}
    />
  )
}