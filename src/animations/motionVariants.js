// ── Framer Motion Variants ────────────────────────────────────────────────
// Reusable animation variant sets for consistent motion throughout the OS.

export const panelVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.96,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

export const notifVariants = {
  hidden:  { opacity: 0, x: 60, scale: 0.9 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring', stiffness: 350, damping: 28 },
  },
  exit:    {
    opacity: 0, x: 60, scale: 0.9,
    transition: { duration: 0.25 },
  },
}

export const paletteVariants = {
  hidden:  { opacity: 0, y: -20, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
  exit:    { opacity: 0, y: -10, scale: 0.97, transition: { duration: 0.2 } },
}

export const bootVariants = {
  visible: { opacity: 1 },
  exit:    {
    opacity: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 },
  },
}

export const dockItemVariants = {
  initial: { y: 0, scale: 1 },
  hover:   {
    y: -10,
    scale: 1.18,
    transition: { type: 'spring', stiffness: 500, damping: 20 },
  },
  tap:     { scale: 0.92 },
}

export const messageVariants = {
  hidden:  { opacity: 0, y: 8, x: -4 },
  visible: {
    opacity: 1, y: 0, x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
}

export const floaterVariants = {
  hidden:  { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 26 },
  },
  exit:    { opacity: 0, y: 6, scale: 0.97, transition: { duration: 0.2 } },
}

export const staggerChildren = {
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const appIconVariants = {
  hidden:  { opacity: 0, scale: 0.7, y: 10 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  },
  hover:   {
    y: -4, scale: 1.08,
    transition: { type: 'spring', stiffness: 500, damping: 20 },
  },
  tap:     { scale: 0.94 },
}

export const micButtonVariants = {
  idle:      { scale: 1 },
  listening: {
    scale: [1, 1.04, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
  sleeping:  { scale: 0.95, opacity: 0.7 },
}

export const waveBarVariants = (delay = 0) => ({
  animate: {
    scaleY: [0.3, 1, 0.3],
    transition: { duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' },
  },
})