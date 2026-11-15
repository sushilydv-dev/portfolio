const KEY = 'fox-hidden'

// The fox is skipped entirely for reduced motion and very small screens
export const foxAllowed = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth >= 360

export function foxHidden() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setFoxHidden(hidden) {
  try {
    if (hidden) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    // storage blocked: the switch still works for this visit
  }
  window.dispatchEvent(new Event('fox:toggle'))
}
