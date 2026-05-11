// ── VoicePanel ──────────────────────────────────────────────────────────────
import GlassPanel  from '../OS/GlassPanel.jsx'
import Waveform    from './Waveform.jsx'
import MicButton   from './MicButton.jsx'
import Transcript  from './Transcript.jsx'
import CommandChips from './CommandChips.jsx'

export default function VoicePanel({ onToggleMic, onCommand }) {
  return (
    <GlassPanel
      panelId="voice"
      title="NOVA VOICE AI"
      dotColor="var(--c-cyan2)"
    >
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        gap: 10, padding: 14, overflow: 'hidden', minHeight: 0,
      }}>
        <Waveform />
        <MicButton onToggle={onToggleMic} />

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,180,255,0.1)' }} />
          <span style={{ fontSize: 9, color: 'var(--c-muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>TRANSCRIPT</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,180,255,0.1)' }} />
        </div>

        <Transcript />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,180,255,0.1)' }} />
          <span style={{ fontSize: 9, color: 'var(--c-muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>QUICK COMMANDS</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(0,180,255,0.1)' }} />
        </div>

        <CommandChips onCommand={onCommand} />
      </div>
    </GlassPanel>
  )
}