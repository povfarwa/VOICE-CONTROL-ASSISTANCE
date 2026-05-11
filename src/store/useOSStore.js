import { create } from 'zustand'

// ── NOVA OS Global State ───────────────────────────────────────────────────
// Single source of truth for the entire OS.
// All components read from and write to this store.

const useOSStore = create((set, get) => ({
  // ── Voice / Mic State ──────────────────────────────────────────────────
  micActive:  false,
  sleeping:   false,
  speaking:   false,
  voiceStatus: 'standby',   // 'listening' | 'sleeping' | 'speaking' | 'standby'
  transcript: [
    { role: 'sys', text: '— session started —', id: 0 },
    { role: 'ai',  text: 'Online. Say "Hey Nova" or click the mic. I can open websites, run commands, and type for you.', id: 1 },
  ],
  interimText: '',

  setMicActive:   (v) => set({ micActive: v }),
  setSleeping:    (v) => set({ sleeping: v }),
  setSpeaking:    (v) => set({ speaking: v }),
  setVoiceStatus: (v) => set({ voiceStatus: v }),
  setInterimText: (v) => set({ interimText: v }),

  addMessage: (role, text) => set((s) => ({
    transcript: [...s.transcript, { role, text, id: Date.now() }]
  })),

  clearTranscript: () => set({ transcript: [] }),

  // ── Panel Visibility & Positions ──────────────────────────────────────
  panels: {
    voice:   { visible: true,  x: 30,  y: 60, w: 380, h: 520, minimized: false },
    browser: { visible: true,  x: 450, y: 60, w: 460, h: 440, minimized: false },
    metrics: { visible: true,  x: 30,  y: 90, w: 210, h: 220, minimized: false },
    apps:    { visible: true,  x: 450, y: 90, w: 310, h: 230, minimized: false },
  },

  setPanelProp: (panelId, props) => set((s) => ({
    panels: {
      ...s.panels,
      [panelId]: { ...s.panels[panelId], ...props }
    }
  })),

  togglePanel: (panelId) => set((s) => ({
    panels: {
      ...s.panels,
      [panelId]: { ...s.panels[panelId], visible: !s.panels[panelId].visible }
    }
  })),

  bringToFront: (panelId) => {
    // Increment a zIndex counter so clicked panel rises above others
    set((s) => {
      const maxZ = Math.max(...Object.values(s.panels).map(p => p.z || 10))
      return {
        panels: {
          ...s.panels,
          [panelId]: { ...s.panels[panelId], z: maxZ + 1 }
        }
      }
    })
  },

  // ── Browser / Tabs ────────────────────────────────────────────────────
  tabs: [
    { id: 'home', label: '⬡ Home', url: 'nova://home', favicon: '⬡' }
  ],
  activeTabId: 'home',
  tabCounter: 1,

  openTab: (url, label, favicon = '🌐') => set((s) => {
    const id = 'tab-' + (s.tabCounter + 1)
    return {
      tabs: [...s.tabs, { id, label, url, favicon }],
      activeTabId: id,
      tabCounter: s.tabCounter + 1,
    }
  }),

  closeTab: (tabId) => set((s) => {
    const remaining = s.tabs.filter(t => t.id !== tabId)
    if (remaining.length === 0) {
      return { tabs: [{ id: 'home', label: '⬡ Home', url: 'nova://home', favicon: '⬡' }], activeTabId: 'home' }
    }
    const newActive = s.activeTabId === tabId
      ? remaining[remaining.length - 1].id
      : s.activeTabId
    return { tabs: remaining, activeTabId: newActive }
  }),

  setActiveTab: (tabId) => set({ activeTabId: tabId }),

  updateTab: (tabId, props) => set((s) => ({
    tabs: s.tabs.map(t => t.id === tabId ? { ...t, ...props } : t)
  })),

  // ── Notifications ─────────────────────────────────────────────────────
  notifications: [],
  notifCounter: 0,

  pushNotif: (title, body, duration = 3500) => {
    const id = Date.now()
    set((s) => ({
      notifications: [...s.notifications, { id, title, body, duration }],
      notifCounter: s.notifCounter + 1,
    }))
    setTimeout(() => {
      get().dismissNotif(id)
    }, duration)
    return id
  },

  dismissNotif: (id) => set((s) => ({
    notifications: s.notifications.filter(n => n.id !== id)
  })),

  // ── Command Palette ────────────────────────────────────────────────────
  paletteOpen: false,
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),
  setPaletteOpen: (v) => set({ paletteOpen: v }),

  // ── System Metrics (simulated) ────────────────────────────────────────
  metrics: { cpu: 42, mem: 61, net: 28, ai: 88, uptime: 0 },
  setMetrics: (m) => set({ metrics: m }),

  // ── Settings / Theme ──────────────────────────────────────────────────
  settings: {
    voiceEnabled: true,
    soundEnabled: true,
    particlesEnabled: true,
    threeEnabled: true,
    scanlines: true,
    gridOverlay: true,
    accentColor: '#00b4ff',
  },
  updateSetting: (key, val) => set((s) => ({
    settings: { ...s.settings, [key]: val }
  })),

  // ── Boot ──────────────────────────────────────────────────────────────
  booted: false,
  setBooted: (v) => set({ booted: v }),

  // ── Start time (for uptime) ───────────────────────────────────────────
  startTime: Date.now(),
}))

export default useOSStore