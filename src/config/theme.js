// ── NOVA OS Design Tokens ──────────────────────────────────────────────────
// Central source of truth for all colors, spacing, shadows, and animations.
// Import this wherever you need design values in JS (Three.js, GSAP, Canvas).

export const colors = {
  bg:      '#020408',
  bg2:     '#050c14',
  cyan:    '#00b4ff',
  cyan2:   '#00e5ff',
  violet:  '#7c3aed',
  pink:    '#f43f8a',
  green:   '#00ffaa',
  amber:   '#ffaa00',
  red:     '#ff4560',
  text:    'rgba(200,230,255,0.9)',
  muted:   'rgba(120,170,220,0.5)',
  glass:   'rgba(8,20,40,0.72)',
  border:  'rgba(0,180,255,0.15)',
  border2: 'rgba(0,180,255,0.32)',
}

export const glows = {
  cyan:   '0 0 20px rgba(0,180,255,0.45), 0 0 60px rgba(0,180,255,0.12)',
  sm:     '0 0 10px rgba(0,180,255,0.3)',
  violet: '0 0 20px rgba(124,58,237,0.4)',
  green:  '0 0 20px rgba(0,255,170,0.4)',
  pink:   '0 0 20px rgba(244,63,138,0.4)',
}

export const fonts = {
  hud:  "'Orbitron', monospace",
  ui:   "'Rajdhani', sans-serif",
  mono: "'JetBrains Mono', monospace",
}

export const durations = {
  fast:   0.15,
  normal: 0.3,
  slow:   0.6,
  boot:   2.0,
}

export const easings = {
  spring:  [0.34, 1.56, 0.64, 1],
  smooth:  [0.4, 0, 0.2, 1],
  snappy:  [0.23, 1, 0.32, 1],
  linear:  [0, 0, 1, 1],
}

export const particleConfig = {
  count: 120,
  connectDistance: 100,
  speed: 0.3,
  sizeMin: 0.3,
  sizeMax: 1.8,
  colors: [
    'rgba(0,180,255,',
    'rgba(0,229,255,',
    'rgba(124,58,237,',
    'rgba(0,255,170,',
  ],
}

export const threeConfig = {
  fov: 75,
  near: 0.1,
  far: 1000,
  cameraZ: 5,
  starCount: 2000,
  geometryCount: 6,
}