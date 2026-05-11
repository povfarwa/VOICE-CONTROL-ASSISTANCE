// ── Transcript ──────────────────────────────────────────────────────────────
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useOSStore from '../../store/useOSStore.js'
import { messageVariants } from '../../animations/motionVariants.js'

export default function Transcript() {
  const { transcript } = useOSStore()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  return (
    <div style={{
      flex: 1, overflowY: 'auto', padding: '10px 10px 4px',
      display: 'flex', flexDirection: 'column', gap: 6,
      minHeight: 0,
    }}>
      <AnimatePresence initial={false}>
        {transcript.map((msg) => (
          <motion.div
            key={msg.id}
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            style={msgStyle(msg.role)}
          >
            {msg.role !== 'sys' && (
              <div style={{
                fontSize: 9, color: 'var(--c-muted)', letterSpacing: 1,
                marginBottom: 3, fontFamily: 'var(--font-mono)',
              }}>
                {msg.role === 'user' ? 'YOU' : 'NOVA AI'}
              </div>
            )}
            <span style={{ lineHeight: 1.55, fontSize: 12 }}>{msg.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
      <div ref={bottomRef} />
    </div>
  )
}

function msgStyle(role) {
  const base = {
    padding: '7px 10px', borderRadius: 7, fontFamily: 'var(--font-mono)',
    animation: 'none',
  }
  if (role === 'user') return { ...base,
    background: 'rgba(0,180,255,0.07)', borderLeft: '2px solid var(--c-cyan)',
    color: 'var(--c-text)',
  }
  if (role === 'ai') return { ...base,
    background: 'rgba(0,100,60,0.09)', borderLeft: '2px solid var(--c-green)',
    color: 'rgba(180,255,220,0.9)',
  }
  return { ...base,
    textAlign: 'center', fontSize: 10,
    color: 'var(--c-muted)', padding: '2px 4px',
  }
}