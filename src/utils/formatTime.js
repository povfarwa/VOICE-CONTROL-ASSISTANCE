export function formatClock(date = new Date()) {
  return date.toTimeString().slice(0, 8)
}

export function formatDate(date = new Date()) {
  return date.toDateString().toUpperCase()
}

export function formatUptime(startTime) {
  const total = Math.floor((Date.now() - startTime) / 1000)
  const h = String(Math.floor(total / 3600)).padStart(2, '0')
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0')
  const s = String(total % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function formatPercent(value) {
  return `${Math.round(value)}%`
}