// ── BrowserPanel ────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion } from 'framer-motion'
import GlassPanel from '../OS/GlassPanel.jsx'
import useOSStore from '../../store/useOSStore.js'

export default function BrowserPanel() {
  const { tabs, activeTabId, setActiveTab, closeTab, openTab, updateTab } = useOSStore()
  const [urlInput, setUrlInput] = useState('')

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0]

  // Sync input when tab changes
  const handleTabClick = (id) => {
    setActiveTab(id)
    const t = tabs.find(t => t.id === id)
    if (t) setUrlInput(t.url === 'nova://home' ? '' : t.url)
  }

  const navigate = (url) => {
    let full = url.trim()
    if (!full) return
    if (!/^https?:\/\//i.test(full) && !full.startsWith('nova://')) {
      full = full.includes('.') ? 'https://' + full : `https://google.com/search?q=${encodeURIComponent(full)}`
    }
    const label = full.replace(/^https?:\/\//, '').split('/')[0]
    updateTab(activeTabId, { url: full, label })
    setUrlInput(full)
  }

  return (
    <GlassPanel panelId="browser" title="INTERNAL BROWSER" dotColor="#7c3aed">
      {/* Tab bar */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', padding: '8px 10px 0',
        gap: 4, borderBottom: '1px solid rgba(0,180,255,0.12)',
        overflowX: 'auto', flexShrink: 0,
      }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: '6px 6px 0 0',
              fontSize: 11, fontFamily: 'var(--font-mono)',
              background: tab.id === activeTabId
                ? 'rgba(0,180,255,0.1)' : 'rgba(0,180,255,0.03)',
              border: '1px solid',
              borderColor: tab.id === activeTabId
                ? 'rgba(0,180,255,0.3)' : 'rgba(0,180,255,0.1)',
              borderBottom: 'none',
              color: tab.id === activeTabId ? 'var(--c-cyan2)' : 'var(--c-muted)',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: 12 }}>{tab.favicon}</span>
            <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tab.label}
            </span>
            {tabs.length > 1 && (
              <span
                onClick={e => { e.stopPropagation(); closeTab(tab.id) }}
                style={{ marginLeft: 4, opacity: 0.5, fontSize: 12, cursor: 'pointer',
                  lineHeight: 1, padding: '0 2px' }}
              >×</span>
            )}
          </div>
        ))}
        {/* New tab */}
        <button
          onClick={() => { openTab('nova://home', 'New Tab', '⬡'); setUrlInput('') }}
          style={{
            padding: '4px 10px', background: 'transparent', border: 'none',
            color: 'var(--c-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1,
          }}
        >+</button>
      </div>

      {/* URL bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 12px', borderBottom: '1px solid rgba(0,180,255,0.1)',
        flexShrink: 0,
      }}>
        {['←','→','↺'].map((sym, i) => (
          <button key={i} style={{
            width: 26, height: 26, borderRadius: 5, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,180,255,0.06)',
            border: '1px solid rgba(0,180,255,0.12)',
            color: 'var(--c-muted)', cursor: 'pointer', fontSize: 14,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.color = 'var(--c-cyan2)'; e.target.style.borderColor = 'rgba(0,180,255,0.3)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--c-muted)'; e.target.style.borderColor = 'rgba(0,180,255,0.12)' }}
          >{sym}</button>
        ))}
        <input
          id="nova-url-bar"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate(urlInput)}
          placeholder="Enter URL or search… (or say a voice command)"
          style={{
            flex: 1, padding: '6px 10px', borderRadius: 6, fontSize: 11,
            background: 'rgba(0,14,30,0.8)',
            border: '1px solid rgba(0,180,255,0.15)',
            color: 'var(--c-text)', fontFamily: 'var(--font-mono)',
            outline: 'none', cursor: 'text',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(0,180,255,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(0,180,255,0.15)'}
        />
        <button
          onClick={() => navigate(urlInput)}
          style={{
            width: 28, height: 28, borderRadius: 6, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,180,255,0.1)',
            border: '1px solid rgba(0,180,255,0.3)',
            color: 'var(--c-cyan2)', cursor: 'pointer', fontSize: 14,
          }}
        >→</button>
      </div>

      {/* Content */}
      <BrowserContent tab={activeTab} />
    </GlassPanel>
  )
}

function BrowserContent({ tab }) {
  if (!tab) return null

  if (tab.url === 'nova://home') {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14,
        background: 'rgba(0,6,16,0.8)',
      }}>
        <div style={{
          fontFamily: 'var(--font-hud)', fontSize: 26, color: 'var(--c-cyan2)',
          textShadow: '0 0 20px var(--c-cyan), 0 0 50px rgba(0,229,255,0.3)',
          letterSpacing: 4,
        }}>◈ NOVA OS</div>
        <div style={{ fontSize: 13, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)' }}>
          AI-Powered Browser · Voice Controlled
        </div>
        <div style={{ fontSize: 11, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)',
          textAlign: 'center', maxWidth: 280, lineHeight: 1.7 }}>
          Say <span style={{ color: 'var(--c-cyan2)' }}>"open YouTube"</span> or{' '}
          <span style={{ color: 'var(--c-cyan2)' }}>"search React tutorials"</span> to navigate
        </div>
        <QuickLinks />
      </div>
    )
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16,
      background: 'rgba(0,6,16,0.8)',
    }}>
      <div style={{ fontSize: 36 }}>{tab.favicon || '🌐'}</div>
      <div style={{ fontFamily: 'var(--font-hud)', fontSize: 18,
        color: 'var(--c-cyan2)', letterSpacing: 2 }}>{tab.label}</div>
      <div style={{ fontSize: 11, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)',
        maxWidth: 300, textAlign: 'center', lineHeight: 1.6 }}>
        {tab.url}
      </div>
      <div style={{ fontSize: 11, color: 'var(--c-muted)', fontFamily: 'var(--font-mono)',
        maxWidth: 300, textAlign: 'center', lineHeight: 1.7, padding: '0 20px' }}>
        This is a simulated browser environment. Click below to open the real site.
      </div>
      <a
        href={tab.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: '8px 20px', borderRadius: 7, textDecoration: 'none',
          background: 'rgba(0,180,255,0.1)',
          border: '1px solid rgba(0,180,255,0.3)',
          color: 'var(--c-cyan2)', fontFamily: 'var(--font-mono)', fontSize: 12,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,180,255,0.2)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(0,180,255,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,180,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        ↗ Open in Real Browser
      </a>
    </div>
  )
}

const QUICK = [
  { emoji: '🔍', label: 'Google',  url: 'https://google.com' },
  { emoji: '🐙', label: 'GitHub',  url: 'https://github.com' },
  { emoji: '▶️', label: 'YouTube', url: 'https://youtube.com' },
  { emoji: '🧠', label: 'Claude',  url: 'https://claude.ai'  },
]

function QuickLinks() {
  const { openTab } = useOSStore()
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {QUICK.map(q => (
        <motion.button
          key={q.url}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => openTab(q.url, q.label, q.emoji)}
          style={{
            padding: '6px 14px', borderRadius: 7, cursor: 'pointer',
            background: 'rgba(0,180,255,0.07)',
            border: '1px solid rgba(0,180,255,0.2)',
            color: 'var(--c-text)', fontFamily: 'var(--font-mono)',
            fontSize: 11, display: 'flex', alignItems: 'center', gap: 6,
            outline: 'none',
          }}
        >
          <span>{q.emoji}</span> {q.label}
        </motion.button>
      ))}
    </div>
  )
}