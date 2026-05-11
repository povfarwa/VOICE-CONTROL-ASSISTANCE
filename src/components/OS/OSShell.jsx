import TopBar         from './TopBar.jsx'
import Desktop        from './Desktop.jsx'
import Dock           from './Dock.jsx'
import NotifStack     from '../System/NotifStack.jsx'
import CommandPalette from '../System/CommandPalette.jsx'
import VoiceFloater   from '../Voice/VoiceFloater.jsx'

export default function OSShell({ toggleMic, runCommand }) {
  return (
    <>
      <NotifStack />
      <CommandPalette onCommand={runCommand} />
      <VoiceFloater />

      <div style={{
        position: 'fixed', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
      }}>
        <TopBar />
        <Desktop onToggleMic={toggleMic} onCommand={runCommand} />
        <Dock runCommand={runCommand} />
      </div>
    </>
  )
}