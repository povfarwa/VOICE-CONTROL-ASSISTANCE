// ── useVoiceRecognition ────────────────────────────────────────────────────
// Handles Web Speech API continuous listening, wake word detection,
// interim transcript display, and auto-restart logic.
// The recognition NEVER stops unless user explicitly says sleep/shutdown.

import { useEffect, useRef, useCallback } from 'react'
import useOSStore from '../store/useOSStore.js'
import { parseCommand, ACTIONS, stripWakeWord } from '../utils/commandParser.js'
import { simulateTyping } from '../utils/typeSimulator.js'

export default function useVoiceRecognition() {
  const recognitionRef = useRef(null)
  const shouldRunRef   = useRef(false)   // controls auto-restart
  const sleepingRef    = useRef(false)   // shadow of store.sleeping for closure

  const {
    micActive, sleeping, setMicActive, setSleeping, setSpeaking,
    setVoiceStatus, setInterimText, addMessage, pushNotif,
    openTab, togglePanel, setPaletteOpen, settings,
  } = useOSStore()

  // Keep sleepingRef in sync so recognition closure reads latest value
  useEffect(() => { sleepingRef.current = sleeping }, [sleeping])

  // ── Text-to-speech ────────────────────────────────────────────────────
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || sleepingRef.current) return
    window.speechSynthesis.cancel()
    const short = text.length > 140 ? text.slice(0, 140) + '...' : text
    const utt = new SpeechSynthesisUtterance(short)
    utt.rate = 1.05
    utt.pitch = 1.1
    utt.volume = 0.88
    // Prefer a natural English voice
    const voices = window.speechSynthesis.getVoices()
    const preferred =
      voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
      voices.find(v => v.lang.startsWith('en-US')) ||
      voices.find(v => v.lang.startsWith('en'))
    if (preferred) utt.voice = preferred

    setSpeaking(true)
    setVoiceStatus('speaking')
    utt.onend = () => {
      setSpeaking(false)
      setVoiceStatus(shouldRunRef.current ? 'listening' : 'standby')
    }
    utt.onerror = () => {
      setSpeaking(false)
      setVoiceStatus(shouldRunRef.current ? 'listening' : 'standby')
    }
    window.speechSynthesis.speak(utt)
  }, [setSpeaking, setVoiceStatus])

  // ── Action dispatcher ─────────────────────────────────────────────────
  const dispatch = useCallback((action) => {
    switch (action.type) {
      case ACTIONS.OPEN_SITE:
        openTab(action.url, action.label, action.emoji)
        // make browser panel visible
        useOSStore.getState().setPanelProp('browser', { visible: true })
        pushNotif('Browser', `Opening ${action.label}`, 3000)
        break

      case ACTIONS.SEARCH:
        openTab(action.url, action.label, '🔍')
        useOSStore.getState().setPanelProp('browser', { visible: true })
        pushNotif('Search', `Searching: "${action.query}"`, 3000)
        break

      case ACTIONS.TYPE:
        simulateTyping(action.content)
        break

      case ACTIONS.SLEEP:
        shouldRunRef.current = false
        setSleeping(true)
        setMicActive(false)
        setVoiceStatus('sleeping')
        recognitionRef.current?.abort()
        pushNotif('Sleep Mode', 'Say "Hey Nova" or click mic to wake.', 4000)
        break

      case ACTIONS.WAKE:
        setSleeping(false)
        setMicActive(true)
        shouldRunRef.current = true
        setVoiceStatus('listening')
        safeStart()
        pushNotif('NOVA Online', 'Voice assistant is active.', 2500)
        break

      case ACTIONS.SHUTDOWN:
        shouldRunRef.current = false
        setSleeping(true)
        setMicActive(false)
        setVoiceStatus('sleeping')
        recognitionRef.current?.abort()
        pushNotif('Assistant Off', 'Click mic to restart.', 4500)
        break

      case ACTIONS.SHOW_PANEL:
        if (action.panelId === 'palette') {
          setPaletteOpen(true)
        } else {
          useOSStore.getState().setPanelProp(action.panelId, { visible: true })
        }
        break

      case ACTIONS.TIME:
      case ACTIONS.DATE:
      case ACTIONS.GREET:
      case ACTIONS.HELP:
      case ACTIONS.UNKNOWN:
      default:
        break
    }
  }, [openTab, pushNotif, setSleeping, setMicActive, setVoiceStatus, setPaletteOpen])

  // ── Safe start (won't start if already running) ───────────────────────
  const safeStart = useCallback(() => {
    try { recognitionRef.current?.start() } catch (_) { /* already started */ }
  }, [])

  // ── Build recognition instance ────────────────────────────────────────
  const initRecognition = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return null

    const rec = new SR()
    rec.continuous      = true
    rec.interimResults  = true
    rec.lang            = 'en-US'
    rec.maxAlternatives = 1

    rec.onresult = (e) => {
      let interim = ''
      let final   = ''

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }

      // Show interim text in the floater
      if (interim) setInterimText(interim)

      if (!final) return
      setInterimText('')

      const raw  = final.trim()
      const low  = raw.toLowerCase()

      // ── Wake word while sleeping ────────────────────────────────────
      if (sleepingRef.current) {
        if (low.includes('hey nova') || low.includes('nova wake up')) {
          const wakeAction = parseCommand('wake up')
          addMessage('user', raw)
          addMessage('ai', wakeAction.reply)
          speak(wakeAction.reply)
          dispatch(wakeAction)
        }
        return
      }

      // ── Normal command ──────────────────────────────────────────────
      addMessage('user', raw)
      const stripped = stripWakeWord(raw)
      const action   = parseCommand(stripped)

      addMessage('ai', action.reply)
      speak(action.reply)
      dispatch(action)
    }

    rec.onerror = (e) => {
      // 'no-speech' is expected when user is quiet — ignore
      if (e.error === 'no-speech' || e.error === 'aborted') return
      console.warn('Speech error:', e.error)
      if (e.error === 'not-allowed') {
        addMessage('sys', '⚠ Microphone permission denied. Please allow mic access.')
        setMicActive(false)
        setVoiceStatus('standby')
        shouldRunRef.current = false
      }
    }

    // ── Auto-restart so listening never drops ─────────────────────────
    rec.onend = () => {
      if (shouldRunRef.current && !sleepingRef.current) {
        setTimeout(() => {
          try { rec.start() } catch (_) {}
        }, 200)
      }
    }

    return rec
  }, [addMessage, dispatch, setInterimText, setMicActive, setVoiceStatus, speak])

  // ── Toggle mic (called by button click or keyboard shortcut) ─────────
  const toggleMic = useCallback(() => {
    const state = useOSStore.getState()

    if (state.sleeping) {
      // Wake from sleep
      const action = parseCommand('wake up')
      addMessage('ai', action.reply)
      speak(action.reply)
      dispatch(action)
      return
    }

    if (!state.micActive) {
      // Start listening
      if (!recognitionRef.current) {
        recognitionRef.current = initRecognition()
      }
      shouldRunRef.current = true
      setMicActive(true)
      setVoiceStatus('listening')
      safeStart()
      pushNotif('Voice Active', 'NOVA is listening…', 2500)
    } else {
      // Stop listening
      shouldRunRef.current = false
      setMicActive(false)
      setVoiceStatus('standby')
      recognitionRef.current?.abort()
      setInterimText('')
    }
  }, [addMessage, dispatch, initRecognition, pushNotif, safeStart,
      setInterimText, setMicActive, setVoiceStatus, speak])

  // ── Run a command programmatically (from chips / palette) ────────────
  const runCommand = useCallback((text) => {
    addMessage('user', text)
    const action = parseCommand(text)
    addMessage('ai', action.reply)
    speak(action.reply)
    dispatch(action)
  }, [addMessage, dispatch, speak])

  // ── Init on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    recognitionRef.current = initRecognition()
    // Load voices (async in some browsers)
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.addEventListener('voiceschanged', () => {})
    }
    return () => {
      shouldRunRef.current = false
      recognitionRef.current?.abort()
    }
  }, [initRecognition])

  return { toggleMic, runCommand, speak }
}