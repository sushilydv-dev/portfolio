import { useSyncExternalStore } from 'react'

// Tiny client-side router: the current pathname, re-rendered on back/forward and on navigate().
const subscribe = (onChange) => {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

export function usePath() {
  const path = useSyncExternalStore(subscribe, () => window.location.pathname)
  return path.replace(/\/+$/, '') || '/'
}

// Swaps the URL and re-renders. A hash (/#work) is scrolled to by App.
function go(to) {
  window.history.pushState(null, '', to)
  window.scrollTo(0, 0)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// PageTransition registers itself here so moving to a different page plays the curtain first.
let transition = null
export const setPageTransition = (fn) => {
  transition = fn
}

const clean = (p) => p.replace(/\/+$/, '') || '/'

// Goes to another page of the site without a reload. Changing page (not just #section on the
// same page) plays the page transition, which calls go() once the old page is covered.
export function navigate(to) {
  const target = new URL(to, window.location.href)
  const samePage = clean(target.pathname) === clean(window.location.pathname)
  if (samePage || !transition) return go(to)
  transition(clean(target.pathname), () => go(to))
}

// Link to a home-page section: a plain #hash on the home page, /#hash from any other page.
// Page links (/about) pass through unchanged.
export const sectionHref = (hash, path) => (!hash.startsWith('#') || path === '/' ? hash : `/${hash}`)
