// ── CommandPalette ──────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'
import { paletteVariants } from '../../animations/motionVariants.js'
import { APPS } from '../../config/appRegistry.js'

function buildItems(openTab, setPanelProp, togglePanel, runCommand) {
  return [
    ...APPS.slice(0, 10).map(a => ({
      icon: a.emoji, label: `Open ${a.label}`, hint: 'site',
      action: () => { openTab(a.url, a.label, a.emoji); setPanelProp('browser', { visible: true }) },
    })),
    { icon: '🎙️', label: 'Toggle Microphone', hint: 'voice',   action: () => runCommand('toggle mic') },
    { icon: '💤', label: 'Sleep Mode',         hint: 'system',  action: () => runCommand('sleep mode') },
    { icon: '⏻',  label: 'Shutdown Assistant', hint: 'system',  action: () => runCommand('shutdown assistant') },
    { icon: '📊', label: 'System Metrics',     hint: 'panel',   action: () => togglePanel('metrics') },
    { icon: '⬡',  label: 'Quick Launch',       hint: 'panel',   action: () => togglePanel('apps') },
    { icon: '🌐', label: 'Browser',            hint: 'panel',   action: () => togglePanel('browser') },
    { icon: '🕐', label: 'What time is it?',   hint: 'voice',   action: () => runCommand('what time is it') },
  ]
}

export default function CommandPalette({ onCommand }) {
  const { paletteOpen, setPaletteOpen, openTab, setPanelProp, togglePanel } = useOSStore()
  const [query, setQuery]   = useState('')
  const [selIdx, setSelIdx] = useState(0)
  const inputRef = useRef(null)

  const allItems = buildItems(openTab, setPanelProp, togglePanel, onCommand)
  const filtered = query
    ? allItems.filter(it => it.label.toLowerCase().includes(query.toLowerCase()))
    : allItems

  const close = () => { setPaletteOpen(false); setQuery(''); setSelIdx(0) }

  const exec = (item) => { item.action(); close() }

  useEffect(() => {
    if (paletteOpen) {
      setQuery(''); setSelIdx(0)
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [paletteOpen])

  useEffect(() => { setSelIdx(0) }, [query])

  const onKey = (e) => {
    if (e.key === 'Escape')    { close(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelIdx(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[selIdx]) exec(filtered[selIdx])
  }

  return (
    <AnimatePresence>
      {paletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            style={{
              position: 'fixed', inset: 0, zIndex: 290,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            }}
          />

          {/* Palette */}
          <motion.div
            variants={paletteVariants}
            initial="hidden" animate="visible" exit="exit"
            style={{
              position: 'fixed', top: 80, left: '50%',
              transform: 'translateX(-50%)',
              width: 520, zIndex: 300,
              borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(0,180,255,0.12)',
            }}
          >
            {/* Search input */}
            <div style={{
              background: 'rgba(2,8,22,0.98)',
              borderBottom: '1px solid rgba(0,180,255,0.15)',
              display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
            }}>
              <span style={{ color: 'var(--c-muted)', fontSize: 16 }}>⌘</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search apps, commands, sites…"
                style={{
                  flex: 1, height: 52, background: 'transparent',
                  border: 'none', outline: 'none',
                  fontFamily: 'var(--font-mono)', fontSize: 14,
                  color: 'var(--c-text)', letterSpacing: 0.5,
                  cursor: 'text',
                }}
              />
              <kbd style={{
                padding: '2px 8px', borderRadius: 5, fontSize: 10,
                background: 'rgba(0,180,255,0.08)',
                border: '1px solid rgba(0,180,255,0.2)',
                color: 'var(--c-muted)', fontFamily: 'var(--font-mono)',
              }}>ESC</kbd>
            </div>

            {/* Results */}
            <div style={{
              background: 'rgba(2,8,22,0.98)',
              maxHeight: 340, overflowY: 'auto',
            }}>
              {filtered.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center',
                  color: 'var(--c-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  No results for "{query}"
                </div>
              ) : filtered.map((item, i) => (
                <div
                  key={i}
                  onClick={() => exec(item)}
                  onMouseEnter={() => setSelIdx(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 16px', cursor: 'pointer',
                    background: i === selIdx ? 'rgba(0,180,255,0.1)' : 'transparent',
                    borderBottom: '1px solid rgba(0,180,255,0.04)',
                    transition: 'background 0.12s',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-mono)',
                    fontSize: 13, color: 'var(--c-text)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: 'var(--c-muted)', letterSpacing: 1 }}>{item.hint}</span>
                  {i === selIdx && (
                    <kbd style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9,
                      background: 'rgba(0,180,255,0.1)',
                      border: '1px solid rgba(0,180,255,0.2)',
                      color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>↵</kbd>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              background: 'rgba(2,8,22,0.98)', padding: '8px 16px',
              borderTop: '1px solid rgba(0,180,255,0.1)',
              display: 'flex', gap: 16, alignItems: 'center',
            }}>
              {[['↑↓','navigate'],['↵','select'],['esc','close']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <kbd style={{ padding: '2px 6px', borderRadius: 4, fontSize: 9,
                    background: 'rgba(0,180,255,0.08)',
                    border: '1px solid rgba(0,180,255,0.15)',
                    color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>{k}</kbd>
                  <span style={{ fontSize: 10, color: 'var(--c-muted)',
                    fontFamily: 'var(--font-mono)' }}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}