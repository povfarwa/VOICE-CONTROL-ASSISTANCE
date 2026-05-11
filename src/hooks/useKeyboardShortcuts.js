// ── useKeyboardShortcuts ───────────────────────────────────────────────────
// Registers global keyboard shortcuts.
// Called once in App.jsx.

import { useEffect } from 'react'
import useOSStore from '../store/useOSStore.js'

export default function useKeyboardShortcuts(toggleMic) {
  const { togglePalette, togglePanel, setPaletteOpen } = useOSStore()

  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey

      if (mod && e.key === 'k') { e.preventDefault(); togglePalette(); return }
      if (mod && e.key === 'm') { e.preventDefault(); toggleMic();     return }
      if (mod && e.key === '1') { e.preventDefault(); togglePanel('voice');   return }
      if (mod && e.key === '2') { e.preventDefault(); togglePanel('browser'); return }
      if (mod && e.key === '3') { e.preventDefault(); togglePanel('metrics'); return }
      if (mod && e.key === '4') { e.preventDefault(); togglePanel('apps');    return }
      if (e.key === 'Escape')   { setPaletteOpen(false); return }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleMic, togglePalette, togglePanel, setPaletteOpen])
}