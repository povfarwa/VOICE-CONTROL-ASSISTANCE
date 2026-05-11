export const SHORTCUTS = [
  { keys: ['Meta+k', 'Control+k'], label: 'Command Palette', action: 'TOGGLE_PALETTE'  },
  { keys: ['Meta+m', 'Control+m'], label: 'Microphone',      action: 'TOGGLE_MIC'      },
  { keys: ['Escape'],              label: 'Close',            action: 'ESCAPE'          },
  { keys: ['Meta+1', 'Control+1'], label: 'Voice Panel',     action: 'TOGGLE_VOICE'    },
  { keys: ['Meta+2', 'Control+2'], label: 'Browser Panel',   action: 'TOGGLE_BROWSER'  },
  { keys: ['Meta+3', 'Control+3'], label: 'Metrics Panel',   action: 'TOGGLE_METRICS'  },
  { keys: ['Meta+4', 'Control+4'], label: 'Apps Panel',      action: 'TOGGLE_APPS'     },
]

export function eventToKey(e) {
  const parts = []
  if (e.metaKey)  parts.push('Meta')
  if (e.ctrlKey)  parts.push('Control')
  if (e.altKey)   parts.push('Alt')
  if (e.shiftKey) parts.push('Shift')
  if (e.key && !['Meta','Control','Alt','Shift'].includes(e.key)) {
    parts.push(e.key.length === 1 ? e.key.toLowerCase() : e.key)
  }
  return parts.join('+')
}

export function findShortcut(e) {
  const key = eventToKey(e)
  return SHORTCUTS.find(s => s.keys.includes(key))
}