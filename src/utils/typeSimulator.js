let typingInterval = null

export function simulateTyping(text, targetEl = null, speed = 55) {
  stopTyping()

  const el = targetEl || getFocusedInput() || document.getElementById('nova-url-bar')
  if (!el) return

  el.focus()
  el.value = ''

  let i = 0
  typingInterval = setInterval(() => {
    if (i < text.length) {
      el.value += text[i]
      el.dispatchEvent(new Event('input',  { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
      i++
    } else {
      stopTyping()
    }
  }, speed + Math.random() * 20)
}

export function stopTyping() {
  if (typingInterval) {
    clearInterval(typingInterval)
    typingInterval = null
  }
}

function getFocusedInput() {
  const el = document.activeElement
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return el
  return null
}