import VoicePanel   from '../Voice/VoicePanel.jsx'
import BrowserPanel from '../Browser/BrowserPanel.jsx'
import MetricsPanel from '../System/MetricsPanel.jsx'
import AppsPanel    from '../System/AppsPanel.jsx'

export default function Desktop({ onToggleMic, onCommand }) {
  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <VoicePanel   onToggleMic={onToggleMic} onCommand={onCommand} />
      <BrowserPanel />
      <MetricsPanel />
      <AppsPanel    onCommand={onCommand} />
    </div>
  )
}