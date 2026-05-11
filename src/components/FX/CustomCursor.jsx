// ── CustomCursor ────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const pos     = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })
  const rafRef  = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top  = e.clientY + 'px'
      }
    }
    const onDown = () => {
      dotRef.current  && (dotRef.current.style.transform  = 'translate(-50%,-50%) scale(0.5)')
      ringRef.current && (ringRef.current.style.transform = 'translate(-50%,-50%) scale(1.8)')
    }
    const onUp = () => {
      dotRef.current  && (dotRef.current.style.transform  = 'translate(-50%,-50%) scale(1)')
      ringRef.current && (ringRef.current.style.transform = 'translate(-50%,-50%) scale(1)')
    }

    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1
      ring.current.y += (pos.current.y - ring.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top  = ring.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 99999,
          width: 10, height: 10, borderRadius: '50%',
          background: '#00e5ff',
          transform: 'translate(-50%,-50%)',
          transition: 'transform 0.08s',
          boxShadow: '0 0 12px #00e5ff, 0 0 28px rgba(0,229,255,0.5)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 99998,
          width: 36, height: 36, borderRadius: '50%',
          border: '1px solid rgba(0,180,255,0.55)',
          transform: 'translate(-50%,-50%)',
          transition: 'transform 0.25s cubic-bezier(0.23,1,0.32,1)',
        }}
      />
    </>
  )
}