import { useEffect } from 'react'
import { foxAllowed, foxHidden } from './foxSettings'

// Loads the 3D fox only after the page has loaded and gone idle, so it never slows the site.
// Skipped for reduced motion and very small screens; the footer switch turns it on and off.
function FoxMascot() {
  useEffect(() => {
    if (!foxAllowed()) return
    let instance = null
    let cancelled = false
    const load = () => {
      if (cancelled || instance || foxHidden()) return
      import('@/features/mascot/start').then((m) => {
        if (!cancelled && !instance && !foxHidden()) instance = m.start()
      })
    }
    const whenIdle = () => (window.requestIdleCallback ? window.requestIdleCallback(load, { timeout: 4000 }) : setTimeout(load, 1500))
    if (document.readyState === 'complete') whenIdle()
    else addEventListener('load', whenIdle, { once: true })

    const onToggle = () => {
      if (foxHidden()) {
        instance?.destroy()
        instance = null
      } else load()
    }
    addEventListener('fox:toggle', onToggle)
    return () => {
      cancelled = true
      removeEventListener('fox:toggle', onToggle)
      removeEventListener('load', whenIdle)
      instance?.destroy()
    }
  }, [])

  return null
}

export default FoxMascot
