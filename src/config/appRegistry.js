export const APPS = [
  { id: 'youtube',      label: 'YouTube',      emoji: '▶️', url: 'https://youtube.com',        category: 'media'       },
  { id: 'google',       label: 'Google',       emoji: '🔍', url: 'https://google.com',         category: 'search'      },
  { id: 'github',       label: 'GitHub',       emoji: '🐙', url: 'https://github.com',         category: 'dev'         },
  { id: 'twitter',      label: 'Twitter / X',  emoji: '🐦', url: 'https://twitter.com',        category: 'social'      },
  { id: 'spotify',      label: 'Spotify',      emoji: '🎵', url: 'https://open.spotify.com',   category: 'media'       },
  { id: 'gmail',        label: 'Gmail',        emoji: '📧', url: 'https://mail.google.com',    category: 'comms'       },
  { id: 'reddit',       label: 'Reddit',       emoji: '🤖', url: 'https://reddit.com',         category: 'social'      },
  { id: 'wikipedia',    label: 'Wikipedia',    emoji: '📚', url: 'https://wikipedia.org',      category: 'info'        },
  { id: 'maps',         label: 'Google Maps',  emoji: '🗺️', url: 'https://maps.google.com',    category: 'utility'     },
  { id: 'calculator',   label: 'Calculator',   emoji: '🔢', url: 'https://calculator.net',     category: 'utility'     },
  { id: 'notes',        label: 'Notion',       emoji: '📝', url: 'https://notion.so',          category: 'productivity'},
  { id: 'claude',       label: 'Claude AI',    emoji: '🧠', url: 'https://claude.ai',          category: 'ai'          },
  { id: 'netflix',      label: 'Netflix',      emoji: '🎬', url: 'https://netflix.com',        category: 'media'       },
  { id: 'amazon',       label: 'Amazon',       emoji: '📦', url: 'https://amazon.com',         category: 'shopping'    },
  { id: 'figma',        label: 'Figma',        emoji: '🎨', url: 'https://figma.com',          category: 'design'      },
  { id: 'anthropic',    label: 'Anthropic',    emoji: '⚡', url: 'https://anthropic.com',      category: 'ai'          },
]

export const DOCK_APPS = APPS.slice(0, 8)

export const URL_MAP = Object.fromEntries(
  APPS.map(a => [a.id, { url: a.url, label: a.label, emoji: a.emoji }])
)

export const VOICE_ALIASES = {
  'x':          'twitter',
  'music':      'spotify',
  'play music': 'spotify',
  'mail':       'gmail',
  'email':      'gmail',
  'map':        'maps',
  'calc':       'calculator',
  'wiki':       'wikipedia',
  'yt':         'youtube',
  'gh':         'github',
  'ai':         'claude',
}