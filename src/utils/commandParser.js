import { resolveSite, buildSearchUrl } from './sitemap.js'

export const ACTIONS = {
  OPEN_SITE:  'OPEN_SITE',
  SEARCH:     'SEARCH',
  TYPE:       'TYPE',
  SLEEP:      'SLEEP',
  WAKE:       'WAKE',
  SHUTDOWN:   'SHUTDOWN',
  SHOW_PANEL: 'SHOW_PANEL',
  TIME:       'TIME',
  DATE:       'DATE',
  GREET:      'GREET',
  HELP:       'HELP',
  UNKNOWN:    'UNKNOWN',
}

const AI_REPLIES = {
  greet: [
    'Hello! All systems nominal. How can I assist?',
    'Hey there! NOVA AI is at your service.',
    'Greetings! Neural core is fully operational.',
    'Hi! Ready to execute commands.',
  ],
  unknown: [
    'I didn\'t catch that. Try "open YouTube" or "search AI tools".',
    'Command not recognized. Say "help" to see what I can do.',
    'Processing failed. Please rephrase your command.',
    'Neural parse error. Try a simpler command.',
  ],
  help: 'I can: open websites ("open YouTube"), search the web ("search React tutorials"), type for you ("type hello world"), show system panels, tell you the time, and manage my sleep state. Say "sleep mode" to pause me.',
}

export function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function stripWakeWord(text) {
  return text
    .replace(/^hey\s+nova[,.]?\s*/i, '')
    .replace(/^nova[,.]?\s*/i, '')
    .trim()
}

export function parseCommand(rawText) {
  const text = stripWakeWord(rawText).toLowerCase().trim()

  // Sleep / Shutdown / Wake
  if (/sleep\s*mode|go to sleep|pause listening/i.test(text))
    return { type: ACTIONS.SLEEP, reply: 'Sleep mode activated. Say "Hey Nova" to wake me.' }

  if (/shutdown|shut down|disable listening|turn off|power off/i.test(text))
    return { type: ACTIONS.SHUTDOWN, reply: 'Shutting down voice assistant.' }

  if (/wake up|wake me|resume listening/i.test(text))
    return { type: ACTIONS.WAKE, reply: 'Good to be back. NOVA is fully online.' }

  // Open site
  const openMatch = text.match(/(?:open|go to|launch|show me|navigate to|load)\s+(\w[\w\s]*)/i)
  if (openMatch) {
    const siteName = openMatch[1].trim().split(/\s+/)[0]
    const site = resolveSite(siteName)
    if (site) {
      return {
        type:  ACTIONS.OPEN_SITE,
        url:   site.url,
        label: site.label,
        emoji: site.emoji,
        reply: `Opening ${site.label} now.`,
      }
    }
    const panelMap = {
      browser: 'browser', voice: 'voice',
      metrics: 'metrics', system: 'metrics',
      vitals:  'metrics', apps:   'apps',
    }
    if (panelMap[siteName]) {
      return {
        type: ACTIONS.SHOW_PANEL,
        panelId: panelMap[siteName],
        reply: `Opening ${siteName} panel.`,
      }
    }
  }

  // Search
  const searchMatch = text.match(/(?:search|find|look up|google|search for)\s+(.+)/i)
  if (searchMatch) {
    const query = searchMatch[1].trim()
    return {
      type:  ACTIONS.SEARCH,
      url:   buildSearchUrl(query),
      label: `Search: ${query.slice(0, 22)}${query.length > 22 ? '…' : ''}`,
      query,
      reply: `Searching Google for "${query}".`,
    }
  }

  // Type
  const typeMatch = text.match(/(?:type|write|enter|input)\s+(.+)/i)
  if (typeMatch) {
    const content = typeMatch[1].trim()
    return { type: ACTIONS.TYPE, content, reply: `Typing: "${content}"` }
  }

  // Time
  if (/what(?:'s| is) the time|current time|tell me the time/i.test(text)) {
    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    return { type: ACTIONS.TIME, reply: `The current time is ${t}.` }
  }

  // Date
  if (/what(?:'s| is) (?:today|the date)|today(?:'s| is) date|what day/i.test(text)) {
    const d = new Date().toDateString()
    return { type: ACTIONS.DATE, reply: `Today is ${d}.` }
  }

  // Panels
  if (/show browser|open browser/i.test(text))
    return { type: ACTIONS.SHOW_PANEL, panelId: 'browser', reply: 'Browser panel opened.' }
  if (/show metrics|system stats|cpu|ram/i.test(text))
    return { type: ACTIONS.SHOW_PANEL, panelId: 'metrics', reply: 'System vitals panel opened.' }
  if (/command palette|show palette/i.test(text))
    return { type: ACTIONS.SHOW_PANEL, panelId: 'palette', reply: 'Command palette opened.' }

  // Greet
  if (/^(hi|hello|hey|howdy|yo|greetings|sup)\b/i.test(text))
    return { type: ACTIONS.GREET, reply: getRandom(AI_REPLIES.greet) }

  // Help
  if (/help|what can you do|commands|features/i.test(text))
    return { type: ACTIONS.HELP, reply: AI_REPLIES.help }

  // Unknown
  return { type: ACTIONS.UNKNOWN, reply: getRandom(AI_REPLIES.unknown) }
}