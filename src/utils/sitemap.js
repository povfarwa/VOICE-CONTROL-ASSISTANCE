export const SITE_MAP = {
  youtube:      { url: 'https://youtube.com',         label: 'YouTube',       emoji: '▶️' },
  google:       { url: 'https://google.com',          label: 'Google',        emoji: '🔍' },
  github:       { url: 'https://github.com',          label: 'GitHub',        emoji: '🐙' },
  twitter:      { url: 'https://twitter.com',         label: 'Twitter / X',   emoji: '🐦' },
  x:            { url: 'https://twitter.com',         label: 'Twitter / X',   emoji: '🐦' },
  spotify:      { url: 'https://open.spotify.com',    label: 'Spotify',       emoji: '🎵' },
  gmail:        { url: 'https://mail.google.com',     label: 'Gmail',         emoji: '📧' },
  email:        { url: 'https://mail.google.com',     label: 'Gmail',         emoji: '📧' },
  mail:         { url: 'https://mail.google.com',     label: 'Gmail',         emoji: '📧' },
  reddit:       { url: 'https://reddit.com',          label: 'Reddit',        emoji: '🤖' },
  wikipedia:    { url: 'https://wikipedia.org',       label: 'Wikipedia',     emoji: '📚' },
  wiki:         { url: 'https://wikipedia.org',       label: 'Wikipedia',     emoji: '📚' },
  maps:         { url: 'https://maps.google.com',     label: 'Google Maps',   emoji: '🗺️' },
  map:          { url: 'https://maps.google.com',     label: 'Google Maps',   emoji: '🗺️' },
  calculator:   { url: 'https://calculator.net',      label: 'Calculator',    emoji: '🔢' },
  calc:         { url: 'https://calculator.net',      label: 'Calculator',    emoji: '🔢' },
  notes:        { url: 'https://notion.so',           label: 'Notion',        emoji: '📝' },
  notion:       { url: 'https://notion.so',           label: 'Notion',        emoji: '📝' },
  claude:       { url: 'https://claude.ai',           label: 'Claude AI',     emoji: '🧠' },
  ai:           { url: 'https://claude.ai',           label: 'Claude AI',     emoji: '🧠' },
  netflix:      { url: 'https://netflix.com',         label: 'Netflix',       emoji: '🎬' },
  amazon:       { url: 'https://amazon.com',          label: 'Amazon',        emoji: '📦' },
  figma:        { url: 'https://figma.com',           label: 'Figma',         emoji: '🎨' },
  anthropic:    { url: 'https://anthropic.com',       label: 'Anthropic',     emoji: '⚡' },
  music:        { url: 'https://open.spotify.com',    label: 'Spotify',       emoji: '🎵' },
  stackoverflow:{ url: 'https://stackoverflow.com',   label: 'Stack Overflow',emoji: '💬' },
  stack:        { url: 'https://stackoverflow.com',   label: 'Stack Overflow',emoji: '💬' },
  vercel:       { url: 'https://vercel.com',          label: 'Vercel',        emoji: '▲'  },
  discord:      { url: 'https://discord.com',         label: 'Discord',       emoji: '💬' },
  slack:        { url: 'https://slack.com',           label: 'Slack',         emoji: '💼' },
  twitch:       { url: 'https://twitch.tv',           label: 'Twitch',        emoji: '🎮' },
  linear:       { url: 'https://linear.app',          label: 'Linear',        emoji: '📋' },
}

export function resolveSite(name) {
  if (!name) return null
  return SITE_MAP[name.toLowerCase().trim()] || null
}

export function buildSearchUrl(query) {
  return `https://google.com/search?q=${encodeURIComponent(query)}`
}