// ── useDraggable ────────────────────────────────────────────────────────────
// Attaches mouse-drag behaviour to any panel element.
// Usage: const { handleMouseDown } = useDraggable('voice')
// Attach handleMouseDown to the titlebar onMouseDown.

import { useCallback, useRef } from 'react'
import useOSStore from '../store/useOSStore.js'

export default function useDraggable(panelId) {
  const dragging  = useRef(false)
  const offsetRef = useRef({ dx: 0, dy: 0 })
  const { setPanelProp, bringToFront } = useOSStore()

  const handleMouseDown = useCallback((e) => {
    // Only drag on left-button; ignore close/min/max buttons
    if (e.button !== 0) return
    if (e.target.closest('.panel-btn')) return

    dragging.current  = true
    const panel = e.currentTarget.closest('.nova-panel')
    if (!panel) return

    const rect = panel.getBoundingClientRect()
    offsetRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top }
    bringToFront(panelId)

    const onMove = (me) => {
      if (!dragging.current) return
      const nx = Math.max(0, Math.min(window.innerWidth  - rect.width,  me.clientX - offsetRef.current.dx))
      const ny = Math.max(44, Math.min(window.innerHeight - rect.height - 62, me.clientY - offsetRef.current.dy))
      setPanelProp(panelId, { x: nx, y: ny })
    }

    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
    e.preventDefault()
  }, [panelId, bringToFront, setPanelProp])

  return { handleMouseDown }
}