import * as THREE from 'three'
import { createFox, clamp, lerp, HIP_Y } from './fox'

/* The fox on the page, as a little physics creature.

   Ground: every visible line of text on the page (read straight from the text nodes, so any
   kind of text counts), plus images, buttons and form fields. Each is a solid block: the fox
   stands on top, is stopped by the sides and bonks its head underneath. There is no fake
   floor: with nothing beneath it, it falls.

   Scrolling: the world stays put (page coordinates). If you scroll and leave the fox above the
   screen, it drops back in from the top; if you leave it below, it climbs up and leaps into
   view onto a ledge.

   Brain: plans a route to the cursor over the ledges by simulating every jump and drop against
   the blocks (Dijkstra), follows it, and re-plans when something gets in the way. Close to the
   cursor it pounces and misses. Idle, it climbs onto content to sit and nap.

   Reactions: text dips when landed on hard, bumps up when head-bonked, shakes when crashed into. */

const G = 2400                 // gravity, px/s²
const MAX_UP = 440             // highest jump, px
const MAX_VX = 520             // fastest horizontal launch, px/s
const STEP = 12                // small ledges it simply steps up onto, px
const ROOTS = 'main, footer'
const SOLIDS = 'img, button, input, textarea, select, video, [data-platform]'

const DEFAULT = {
  bodyY: HIP_Y, pitch: 0, roll: 0, sy: 1,
  feet: { fl: [0.02, 0], fr: [0.02, 0], hl: [-0.02, 0], hr: [-0.02, 0] },
  headPitch: 0, headYaw: 0, headTilt: 0, earBack: 0, earL: 0, earR: 0,
  tailLift: 0.35, tailCurl: 0.12, tailWag: 0, tailSide: 0,
  eyes: 'open', mouth: 0, tongue: 0, blush: 0.38, look: 1,
}
const pose = (o = {}) => Object.assign({}, DEFAULT, o, { feet: Object.assign({}, DEFAULT.feet, o.feet || {}) })
const NUM = ['bodyY', 'pitch', 'roll', 'sy', 'headPitch', 'headYaw', 'headTilt', 'earBack', 'earL', 'earR', 'tailLift', 'tailCurl', 'tailWag', 'tailSide', 'mouth', 'tongue', 'blush', 'look']
const ease = (t) => t * t * (3 - 2 * t)
const pulse = (t, period, dur, off = 0) => { const p = (t + off) % period; return p < dur ? Math.sin(Math.PI * p / dur) : 0 }
const subtract = (free, l, r) => free.flatMap(([a, z]) => (r <= a || l >= z ? [[a, z]] : [[a, Math.min(z, l)], [Math.max(a, r), z]].filter(([u, v]) => v - u > 0)))
function gait(ph, off, duty, stride, lift) {
  const p = ((ph - off) % 1 + 1) % 1
  if (p < duty) return [stride / 2 - stride * (p / duty), 0]
  const u = (p - duty) / (1 - duty)
  return [-stride / 2 + stride * ease(u), lift * Math.sin(Math.PI * u)]
}
const GAITS = {
  walk: { duty: 0.62, stride: 0.42, lift: 0.12, offs: { hl: 0, fl: 0.25, hr: 0.5, fr: 0.75 } },
  trot: { duty: 0.44, stride: 0.6, lift: 0.2, offs: { hl: 0, fr: 0, hr: 0.5, fl: 0.5 } },
  run: { duty: 0.32, stride: 0.9, lift: 0.32, offs: { hl: 0, hr: 0.07, fl: 0.46, fr: 0.53 } },
}
const SIT = { bodyY: 0.58, pitch: -0.66, feet: { fl: [0.02, 0], fr: [0.02, 0], hl: [0.46, 0], hr: [0.46, 0] }, tailLift: 0.12, tailCurl: 0.28, tailSide: 0.62 }

export function start() {
  /* ======================================================================
     Canvas and scene
     ==================================================================== */
  // The fox is drawn on a small canvas that lives *in the page* (page coordinates), not pinned to
  // the window: the browser scrolls it together with the text, so a fast scroll carries it off
  // screen exactly like the content, with no lag. The layer clips it to the page so it never
  // makes the page longer or wider.
  const CW = 260, CH = 320, FEET = 190     // canvas size and where the feet sit, px
  const layer = document.createElement('div')
  layer.className = 'fox-layer'
  layer.setAttribute('aria-hidden', 'true')
  Object.assign(layer.style, { position: 'absolute', left: '0', top: '0', width: '100%', height: '0', overflow: 'hidden', pointerEvents: 'none', zIndex: '30', contain: 'strict' })
  const canvas = document.createElement('canvas')
  Object.assign(canvas.style, { position: 'absolute', left: '0', top: '0', width: CW + 'px', height: CH + 'px', willChange: 'transform' })
  layer.appendChild(canvas)
  document.body.appendChild(layer)
  const fitLayer = () => {
    layer.style.height = '0px'
    layer.style.height = document.documentElement.scrollHeight + 'px'
  }

  const debug = location.search.includes('foxdebug')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power', preserveDrawingBuffer: debug })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05

  const scene = new THREE.Scene()
  let W = innerWidth, H = innerHeight
  const camera = new THREE.OrthographicCamera(-CW / 2, CW / 2, FEET, FEET - CH, -3000, 3000)
  camera.position.z = 1000
  scene.add(new THREE.HemisphereLight(0xfff4e6, 0x8a7a6a, 1.2))
  const key = new THREE.DirectionalLight(0xfff1e0, 2.3); key.position.set(0.5, 0.9, 0.7); scene.add(key)
  const rim = new THREE.DirectionalLight(0xffe0c0, 1.5); rim.position.set(-0.5, 0.6, -0.8); scene.add(rim)
  const fillL = new THREE.DirectionalLight(0xd8e4ff, 0.5); fillL.position.set(-0.7, 0.3, 0.5); scene.add(fillL)

  const fox = createFox({ shells: 10 })
  const place = new THREE.Group()
  place.add(fox.root)
  scene.add(place)

  const shadowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64
    const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
    r.addColorStop(0, 'rgba(0,0,0,0.28)'); r.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = r; g.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }))
  shadow.position.z = -1500
  scene.add(shadow)

  let S = 26, BW = 44, BH = 68, FW = 26     // px per model unit; body width/height; footprint width
  function resize() {
    W = innerWidth; H = innerHeight
    renderer.setSize(CW, CH, false)
    S = W < 768 ? 19 : 26
    BW = 1.7 * S; BH = 2.6 * S; FW = BW * 0.6
    dirty = true
  }

  /* ======================================================================
     World: every visible line of text, plus solid elements (page coordinates)
     ==================================================================== */
  let blocks = [], nodes = [], dirty = true, lastCollect = 0, collectY = 0
  const range = document.createRange()
  const styleCache = new WeakMap()
  const visible = (el) => {
    if (!el) return false
    let v = styleCache.get(el)
    if (v === undefined) {
      const cs = getComputedStyle(el)
      v = cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity > 0.4 && !el.closest('.sr-only, header.sticky, .fox-layer')
      styleCache.set(el, v)
    }
    return v
  }
  // the element that visibly moves when the fox lands on this text (inline text can't be transformed)
  const movable = (el) => {
    while (el && el.parentElement && getComputedStyle(el).display === 'inline') el = el.parentElement
    return el
  }

  function collect() {
    const sx = scrollX, sy = scrollY
    const y0 = -0.6 * H, y1 = 1.6 * H
    const rects = []
    for (const root of document.querySelectorAll(ROOTS)) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.data.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) })
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement
        if (!visible(el)) continue
        range.selectNodeContents(n)
        for (const b of range.getClientRects()) {
          if (b.width < 2 || b.height < 6 || b.bottom < y0 || b.top > y1) continue
          rects.push({ left: b.left, right: b.right, top: b.top, bottom: b.bottom, el })
        }
      }
    }
    // join neighbouring word boxes into lines (a big gap starts a new stretch)
    rects.sort((a, b) => a.top - b.top || a.left - b.left)
    const lines = []
    for (const r of rects) {
      const line = lines.find((l) => Math.abs(l.top - r.top) < 5 && r.left - l.right < 16 && l.left - r.right < 16)
      if (line) { line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right); line.bottom = Math.max(line.bottom, r.bottom) }
      else lines.push({ ...r })
    }
    const out = []
    for (const l of lines) {
      if (l.right - l.left < 18) continue
      out.push({ id: `t${Math.round(l.top + sy)}x${Math.round(l.left + sx)}`, el: movable(l.el), label: (l.el.textContent || '').trim().slice(0, 24), left: l.left + sx, right: l.right + sx, top: l.top + sy, bottom: l.bottom + sy })
    }
    for (const root of document.querySelectorAll(ROOTS)) for (const el of root.querySelectorAll(SOLIDS)) {
      if (!visible(el)) continue
      const b = el.getBoundingClientRect()
      if (b.width < 20 || b.height < 10 || b.bottom < y0 || b.top > y1) continue
      out.push({ id: `e${Math.round(b.top + sy)}x${Math.round(b.left + sx)}`, el, label: el.tagName.toLowerCase(), left: b.left + sx, right: b.right + sx, top: b.top + sy, bottom: b.bottom + sy })
    }
    blocks = out
    nodes = computeNodes()
    dirty = false
    lastCollect = now; collectY = sy
    fitLayer()
    edgeCache.clear()
  }
  // where on top of each block the fox has room to stand (anything just above gets in the way)
  function computeNodes() {
    const out = []
    for (const b of blocks) {
      if (b.right - b.left < FW * 0.8) continue
      let free = [[b.left, b.right]]
      for (const c of blocks) {
        if (c === b || !(c.bottom > b.top - BH + 0.5 && c.top < b.top - 0.5 && c.right > b.left - BW / 2 && c.left < b.right + BW / 2)) continue
        free = subtract(free, c.left - BW / 2 - 1, c.right + BW / 2 + 1)
      }
      free.forEach(([l, r], k) => { if (r - l >= 6) out.push({ id: b.id + '#' + k, block: b, label: b.label, left: l, right: r, top: b.top }) })
    }
    return out
  }
  const near = (x0, y0, x1, y1, pad = 0) => blocks.filter((b) => b.right > x0 - pad && b.left < x1 + pad && b.bottom > y0 - pad && b.top < y1 + pad)
  const onScreen = (n, margin = 0) => n.top > scrollY + 70 + margin && n.top < scrollY + H - 8 - margin && n.right > scrollX && n.left < scrollX + W

  /* ======================================================================
     Collision: a BW × BH body standing on (x, y) — x is the centre, y the feet.
     body.ghost (a node) means "passing through everything except that ledge"
     (used when climbing back into view from below).
     ==================================================================== */
  const footOn = (b, x) => x + FW / 2 > b.left && x - FW / 2 < b.right
  const bodyOverlapsY = (b, y) => y > b.top + 0.5 && y - BH < b.bottom - 0.5
  function supportAt(x, y, list) {
    let best = null
    for (const b of list) if (footOn(b, x) && Math.abs(y - b.top) < 1.5 && (!best || b.top < best.top)) best = b
    return best
  }
  function sweep(body, dt, list, events) {
    let nx = body.x + body.vx * dt
    if (!body.ghost) for (const b of list) {
      if (!bodyOverlapsY(b, body.y)) continue
      const roomAbove = () => !list.some((c) => c !== b && footOn(c, nx) && bodyOverlapsY(c, b.top))
      if (body.vx > 0 && body.x + BW / 2 <= b.left + 0.5 && nx + BW / 2 > b.left) {
        if (body.ground && b.top >= body.y - STEP && roomAbove()) { body.y = b.top; continue }
        nx = b.left - BW / 2 - 0.01; events.wall = b
      } else if (body.vx < 0 && body.x - BW / 2 >= b.right - 0.5 && nx - BW / 2 < b.right) {
        if (body.ground && b.top >= body.y - STEP && roomAbove()) { body.y = b.top; continue }
        nx = b.right + BW / 2 + 0.01; events.wall = b
      }
    }
    if (events.wall) body.vx = 0
    body.x = nx
    if (body.ground) {
      const s = supportAt(body.x, body.y, list)
      if (s) { body.ground = s; return }
      body.ground = null; body.vy = 0
    }
    body.vy = Math.min(body.vy + G * dt, 1800)
    let ny = body.y + body.vy * dt
    if (body.vy > 0) {
      let land = null
      for (const b of list) {
        if (body.ghost && b.id !== body.ghost.block.id) continue
        if (footOn(b, body.x) && body.y <= b.top + 1 && ny >= b.top && (!land || b.top < land.top)) land = b
      }
      if (land) { events.land = land; events.impact = body.vy; ny = land.top; body.vy = 0; body.ground = land; body.ghost = null }
    } else if (!body.ghost) {
      for (const b of list) {
        if (!(body.x + BW / 2 > b.left && body.x - BW / 2 < b.right)) continue
        if (body.y - BH >= b.bottom - 0.5 && ny - BH < b.bottom) { ny = b.bottom + BH + 0.01; events.bonk = b; body.vy = 60 }
      }
    }
    body.y = ny
  }

  /* ======================================================================
     Planning: ledges are nodes; simulated jumps and drops are edges
     ==================================================================== */
  const edgeCache = new Map()
  const failed = new Map()   // jump id → time it failed
  const edgeId = (e) => e.from.id + '>' + e.to.id
  function nodeAt(block, x) {
    let best = null, bestD = Infinity
    for (const n of nodes) if (n.block.id === block.id) { const d = x < n.left ? n.left - x : x > n.right ? x - n.right : 0; if (d < bestD) { bestD = d; best = n } }
    return best
  }
  function simulate(x, y, vx, vy, target) {
    const body = { x, y, vx, vy, ground: null }
    const xs = [x, x + vx * 1.4], list = near(Math.min(...xs) - BW, y - MAX_UP - BH, Math.max(...xs) + BW, y + 1.2 * H, 20)
    for (let i = 0; i < 140; i++) {
      const ev = {}
      sweep(body, 1 / 60, list, ev)
      if (ev.wall || ev.bonk) return null
      if (ev.land) {
        const n = nodeAt(ev.land, body.x)
        if (!n) return null
        return !target || n.id === target.id ? { land: n, x: body.x } : null
      }
    }
    return null     // fell into nothing
  }
  function edgesFrom(A) {
    if (edgeCache.has(A.id)) return edgeCache.get(A.id)
    const out = []
    const y0 = A.top
    // drops: walk off a real edge of the block (only if something catches it)
    for (const dir of [-1, 1]) {
      const atEdge = dir < 0 ? A.left <= A.block.left + 1 : A.right >= A.block.right - 1
      if (!atEdge) continue
      const r = simulate(dir < 0 ? A.block.left - FW * 0.45 : A.block.right + FW * 0.45, y0, dir * 140, 0, null)
      if (r && r.land.id !== A.id) out.push({ type: 'drop', from: A, to: r.land, launchX: dir < 0 ? A.left + 2 : A.right - 2, dir, landX: r.x, cost: 40 + Math.abs(r.land.top - y0) * 0.2 })
    }
    // jumps to ledges in range
    for (const B of nodes) {
      if (B.id === A.id) continue
      const up = y0 - B.top
      if (up > MAX_UP - 40 || -up > 1.2 * H) continue
      const gap = B.left > A.right ? B.left - A.right : A.left > B.right ? A.left - B.right : 0
      if (gap > 440) continue
      let best = null
      const inset = Math.min(22, (B.right - B.left) / 3)
      for (const lx of [clamp((B.left + B.right) / 2, A.left, A.right), A.left + 2, A.right - 2]) {
        for (const lxB of [clamp(lx, B.left + inset, B.right - inset), (B.left + B.right) / 2, B.left + inset, B.right - inset]) {
          for (const extra of [45, 110]) {
            const h = Math.max(0, up) + extra
            if (h > MAX_UP) continue
            const vy = -Math.sqrt(2 * G * h)
            const t = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * G * (B.top - y0)))) / G
            if (!(t > 0)) continue
            const vx = (lxB - lx) / t
            if (Math.abs(vx) > MAX_VX) continue
            const r = simulate(lx, y0, vx, vy, B)
            if (!r) continue
            const cost = 60 + Math.hypot(lxB - lx, up) * 0.6 + extra * 0.2
            if (!best || cost < best.cost) best = { type: 'jump', from: A, to: B, launchX: lx, vx, vy, landX: r.x, cost }
          }
          if (best) break
        }
        if (best) break
      }
      if (best) out.push(best)
    }
    // climbs: scale the side of a column of text to the ledge on top of it
    for (const B of nodes) {
      const up = y0 - B.top
      if (up < 50 || up > 0.9 * H) continue
      for (const side of [-1, 1]) {
        if (side < 0 ? B.left > B.block.left + 1 : B.right < B.block.right - 1) continue   // no room at that end of the ledge
        const cx = side < 0 ? B.block.left - BW / 2 - 2 : B.block.right + BW / 2 + 2
        if (cx < 22 || cx > document.documentElement.scrollWidth - 22) continue
        const lx = clamp(cx, A.left + 2, A.right - 2)
        if (Math.abs(lx - cx) > BW) continue
        const x0 = Math.min(lx, cx) - BW / 2, x1 = Math.max(lx, cx) + BW / 2
        if (blocks.some((c) => c.right > x0 && c.left < x1 && c.bottom > B.top - BH && c.top < y0 - 0.5)) continue   // something in the way
        const inset = Math.min(22, (B.right - B.left) / 3)
        out.push({ type: 'climb', from: A, to: B, launchX: lx, climbX: cx, side, landX: side < 0 ? B.left + inset : B.right - inset, cost: 120 + up * 1.1 })
      }
    }
    edgeCache.set(A.id, out)
    return out
  }
  // cheapest route from the current ledge to a goal ledge, or as close as it can get
  function plan(start, startX, goal, goalX) {
    const dist = new Map([[start.id, 0]]), prev = new Map(), atX = new Map([[start.id, startX]]), byId = new Map([[start.id, start]]), open = [start], done = new Set()
    while (open.length) {
      open.sort((a, b) => dist.get(a.id) - dist.get(b.id))
      const n = open.shift()
      if (done.has(n.id)) continue
      done.add(n.id)
      if (n.id === goal.id || done.size > 90) break
      for (const e of edgesFrom(n)) {
        if (now - (failed.get(edgeId(e)) ?? -99) < 6) continue
        if (e.to.top < scrollY + 70 + BH * 0.5 || e.to.top > scrollY + H - 4) continue   // stay where you can see it
        const c = dist.get(n.id) + Math.abs(atX.get(n.id) - e.launchX) * 0.5 + e.cost
        if (!dist.has(e.to.id) || c < dist.get(e.to.id)) { dist.set(e.to.id, c); prev.set(e.to.id, e); atX.set(e.to.id, e.landX); byId.set(e.to.id, e.to); open.push(e.to) }
      }
    }
    let end = goal
    if (!dist.has(goal.id)) {
      let bestD = Infinity
      for (const n of byId.values()) { const d = Math.hypot(clamp(goalX, n.left, n.right) - goalX, (n.top - goal.top) * 1.3); if (d < bestD) { bestD = d; end = n } }
    }
    const path = []
    for (let id = end.id; prev.has(id); id = prev.get(id).from.id) path.unshift(prev.get(id))
    return { path, end }
  }

  /* ======================================================================
     Reactions on the page
     ==================================================================== */
  function nudge(el, kind, strength = 1) {
    if (!el || !el.animate) return
    const k = clamp(strength, 0.3, 1.6)
    const frames = {
      dip: [{ transform: 'translateY(0)' }, { transform: `translateY(${3 * k}px)` }, { transform: 'translateY(0)' }],
      bump: [{ transform: 'translateY(0)' }, { transform: `translateY(${-5 * k}px)` }, { transform: 'translateY(1px)' }, { transform: 'translateY(0)' }],
      shake: [0, -4, 3, -2, 1, 0].map((v) => ({ transform: `translateX(${v * k}px)` })),
    }[kind]
    try { el.animate(frames, { duration: kind === 'shake' ? 380 : 320, easing: 'cubic-bezier(.3,1.6,.5,1)', composite: 'add' }) } catch { /* older browsers */ }
  }

  /* ======================================================================
     Input
     ==================================================================== */
  const touch = matchMedia('(hover: none)').matches
  const cursor = { x: W * 0.6, y: H * 0.4, in: false, moved: -99 }
  let now = 0, lastScroll = -9
  const onMove = (e) => { cursor.x = e.clientX; cursor.y = e.clientY; cursor.in = true; cursor.moved = now }
  const onLeave = () => { cursor.in = false }
  const onScroll = () => { lastScroll = now }
  const markDirty = () => { dirty = true }
  addEventListener('pointermove', onMove, { passive: true })
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', resize)
  addEventListener('popstate', markDirty)
  document.documentElement.addEventListener('pointerleave', onLeave)
  let celebrateUntil = 0
  const onCelebrate = () => { celebrateUntil = now + 3.5 }
  addEventListener('fox:celebrate', onCelebrate)
  const mo = new MutationObserver(markDirty)
  mo.observe(document.body, { childList: true, subtree: true, characterData: true })
  resize()

  /* ======================================================================
     State
     ==================================================================== */
  const fx = { x: scrollX + W * 0.6, y: scrollY - 120, vx: 0, vy: 0, ground: null, ghost: null, facing: -1, yaw: -0.9 }
  let state = 'fall', stateT = 0, phase = 0, cooldown = 0, offscreenFor = 0, restSince = 0
  let stuckSince = 0, route = null, planT = -9, goalKey = '', pendingJump = null, curEdge = null, climbing = null
  let roam = { x: 0, y: 0, until: -1 }
  let shown = pose()
  const RESTING = ['sit', 'sleep', 'stand']
  const setState = (s) => { if (state !== s) { if (!RESTING.includes(s) || !RESTING.includes(state)) restSince = now; state = s; stateT = 0 } }

  function goalPoint() {
    const still = now - cursor.moved
    if (!touch && cursor.in && still < 8) return { x: cursor.x + scrollX, y: cursor.y + scrollY, chase: true }
    if (now > roam.until) {   // idle: climb up onto something on screen
      const vis = nodes.filter((n) => onScreen(n, 40) && n.right - n.left > 60)
      const pick = vis[Math.floor(Math.random() * vis.length)]
      if (pick) roam = { x: lerp(pick.left + 10, pick.right - 10, Math.random()), y: pick.top - 20, until: now + 8 + Math.random() * 8 }
    }
    return { x: roam.x, y: roam.y, chase: false }
  }
  // the ledge just below a point; if there's none, the nearest ledge to it
  function ledgeFor(x, y) {
    let best = null
    for (const n of nodes) if (x >= n.left - 20 && x <= n.right + 20 && n.top >= y - 30 && n.top - y < 400 && (!best || n.top < best.top)) best = n
    if (best) return best
    let bestD = Infinity
    for (const n of nodes) { const d = Math.hypot(clamp(x, n.left, n.right) - x, n.top - y); if (d < bestD) { bestD = d; best = n } }
    return best
  }

  function think() {
    const g = goalPoint()
    const goal = ledgeFor(g.x, g.y)
    const cur = nodeAt(fx.ground, fx.x)
    if (!goal || !cur) return
    const aimX = clamp(g.x, goal.left, goal.right)
    const k = goal.id + ':' + Math.round(aimX / 60)
    if (k !== goalKey || now - planT > 1.5 || !route) {
      goalKey = k; planT = now
      route = plan(cur, fx.x, goal, aimX)
    }
    if (!route.path.length) {
      const end = route.end, tx = end.id === goal.id ? aimX : clamp(g.x, end.left, end.right)
      const dx = tx - fx.x
      const close = g.chase && Math.abs(g.x - fx.x) < 130 && ((end.id === goal.id && g.y < fx.y - 20 && fx.y - g.y < 240) || (g.y > fx.y + 20 && g.y - fx.y < 260))
      if (close && cooldown <= 0 && now - cursor.moved < 2.5) {
        const h = g.y > fx.y ? 28 : clamp(fx.y - g.y + 30, 60, 240), ta = Math.sqrt(2 * h / G) * (g.y > fx.y ? 2.2 : 1)
        fx.vy = -Math.sqrt(2 * G * h); fx.vx = clamp((g.x - fx.x) / ta, -420, 420); fx.ground = null
        fx.facing = Math.sign(fx.vx) || fx.facing
        setState('pounce'); return
      }
      if (Math.abs(dx) > 30) { stuckSince = now; fx.vx = Math.sign(dx) * (Math.abs(dx) > 260 ? 330 : Math.abs(dx) > 90 ? 190 : 95); fx.facing = Math.sign(dx); setState('move'); return }
      fx.vx = 0
      // the closest it can walk to isn't the cursor: leap toward the cursor and see what it lands on
      // (if it's nothing, it falls out of view and drops back in near the cursor)
      const far = Math.hypot(g.x - fx.x, g.y - fx.y) > 120
      if (g.chase && far && end.id !== goal.id && now - stuckSince > 0.35 && cooldown <= 0 && now - cursor.moved < 4) {
        const ty = Math.min(g.y + 20, goal.top), h = clamp(fx.y - ty + 70, 90, MAX_UP)
        const vy = -Math.sqrt(2 * G * h)
        const t = (-vy + Math.sqrt(Math.max(0, vy * vy + 2 * G * (ty - fx.y)))) / G
        pendingJump = { vx: clamp((clamp(g.x, goal.left, goal.right) - fx.x) / Math.max(t, 0.25), -MAX_VX, MAX_VX), vy }
        fx.facing = Math.sign(pendingJump.vx) || fx.facing
        cooldown = 1; stuckSince = now; route = null
        setState('crouch'); return
      }
      if (g.chase) setState(now - cursor.moved > 3 ? 'sit' : 'stand')
      else setState(now - restSince > 25 ? 'sleep' : 'sit')
      return
    }
    const e = route.path[0]
    if (cur.id !== e.from.id) { route = null; return }
    if (e.type === 'drop') { fx.vx = e.dir * 170; fx.facing = e.dir; setState('move'); curEdge = e; return }
    const dx = e.launchX - fx.x
    if (e.type === 'climb' && Math.abs(dx) <= 8) { fx.vx = 0; fx.ground = null; climbing = e; curEdge = e; fx.facing = -e.side; setState('climb'); return }
    if (Math.abs(dx) > 8) { fx.vx = Math.sign(dx) * (Math.abs(dx) > 200 ? 300 : 170); fx.facing = Math.sign(dx); setState('move'); return }
    fx.x = e.launchX; fx.vx = 0; pendingJump = e; curEdge = e
    fx.facing = Math.sign(e.vx) || fx.facing
    setState('crouch')
  }

  /* ---- coming back into view ---- */
  function nearestVisible(x, lowerHalf) {
    let best = null, bestD = Infinity
    for (const n of nodes) {
      if (!onScreen(n, 20) || n.right - n.left < FW) continue
      if (lowerHalf && n.top < scrollY + H * 0.35) continue
      const d = Math.abs(clamp(x, n.left, n.right) - x) + (lowerHalf ? (scrollY + H - n.top) * 0.4 : Math.abs(n.top - (cursor.in ? cursor.y + scrollY : scrollY + H / 2)) * 0.5)
      if (d < bestD) { bestD = d; best = n }
    }
    return best
  }
  function dropInFromTop() {
    const px = (cursor.in ? cursor.x : W / 2) + scrollX
    const n = nearestVisible(px, false)
    fx.x = n ? clamp(px, n.left + Math.min(20, (n.right - n.left) / 3), n.right - Math.min(20, (n.right - n.left) / 3)) : px
    fx.y = scrollY - 20; fx.vx = 0; fx.vy = 120; fx.ground = null
    fx.ghost = n   // falls past the navbar and anything in front, onto that ledge (none: just falls)
    route = null; setState('fall')
  }
  function climbInFromBelow() {
    const px = (cursor.in ? cursor.x : fx.x - scrollX) + scrollX
    const n = nearestVisible(px, true)
    if (!n) return dropInFromTop()
    const tx = clamp(px, n.left + Math.min(20, (n.right - n.left) / 3), n.right - Math.min(20, (n.right - n.left) / 3))
    const x0 = clamp(tx - Math.sign(tx - scrollX - W / 2 || 1) * 70, scrollX + 30, scrollX + W - 30)
    const y0 = scrollY + H + BH * 0.6
    const h = y0 - n.top + 70
    const vy = -Math.sqrt(2 * G * h)
    const t = (-vy + Math.sqrt(vy * vy - 2 * G * (y0 - n.top))) / G
    fx.x = x0; fx.y = y0; fx.vx = (tx - x0) / t; fx.vy = vy; fx.ground = null; fx.ghost = n
    fx.facing = Math.sign(fx.vx) || 1
    route = null; setState('leap')
  }

  /* ======================================================================
     Poses
     ==================================================================== */
  function targetPose(dt) {
    const t = now, still = now - cursor.moved
    const lookY = clamp((fx.y - scrollY - 60 - cursor.y) / 320, -1, 1)
    let p
    switch (state) {
      case 'move': {
        const sp = Math.abs(fx.vx), name = sp > 260 ? 'run' : sp > 140 ? 'trot' : 'walk', gt = GAITS[name]
        phase += (sp * dt) / (S * gt.stride / gt.duty)
        const feet = {}; for (const kk in gt.offs) feet[kk] = gait(phase, gt.offs[kk], gt.duty, gt.stride, gt.lift)
        const flex = Math.sin(Math.PI * 2 * phase + 1.3)
        p = pose({ feet, bodyY: HIP_Y - (name === 'run' ? 0.05 : 0.02) + Math.cos(Math.PI * 4 * phase) * (name === 'walk' ? 0.015 : 0.03),
          pitch: name === 'run' ? flex * 0.12 : 0, earBack: name === 'run' ? 0.5 : name === 'trot' ? 0.15 : 0,
          tailLift: name === 'run' ? 0.05 : 0.3, tailWag: Math.sin(Math.PI * 2 * phase) * 0.15, mouth: name === 'run' ? 0.5 : 0, tongue: name === 'run' ? 1 : 0, look: 0.5 })
        break
      }
      case 'crouch': p = pose({ bodyY: HIP_Y - 0.24, pitch: -0.14, feet: { hl: [0.1, 0], hr: [0.1, 0] }, headPitch: -0.25, eyes: 'wide', earBack: -0.25 }); break
      case 'pounce': {
        const kk = clamp(0.5 + fx.vy / 1400, 0, 1)
        p = pose({ pitch: lerp(-0.6, 1.0, kk), feet: { fl: [0.35, 0.05], fr: [0.33, 0.06], hl: [-0.3, 0.1], hr: [-0.3, 0.1] }, headPitch: lerp(-0.25, 0.35, kk), earBack: -0.3, eyes: 'wide', tailLift: lerp(0.2, 1.2, kk), look: 0.3 })
        break
      }
      case 'climb': {   // scrabbling up the side of the text, nose up
        phase += dt * 2.6
        const a = Math.sin(Math.PI * 2 * phase), b = Math.sin(Math.PI * 2 * phase + Math.PI)
        p = pose({ bodyY: HIP_Y - 0.1, pitch: -1.05, feet: { fl: [0.28, 0.3 + 0.18 * Math.max(0, a)], fr: [0.28, 0.3 + 0.18 * Math.max(0, b)], hl: [-0.05, 0.12 * Math.max(0, b)], hr: [-0.05, 0.12 * Math.max(0, a)] },
          headPitch: -0.2, earBack: 0.3, tailLift: -0.2, tailWag: a * 0.2, eyes: 'open', look: 0.2 })
        break
      }
      case 'leap': {   // springing up from below the screen: stretched up, front paws reaching
        p = pose({ pitch: fx.vy < 0 ? -0.55 : -0.1, feet: { fl: [0.3, 0.45], fr: [0.28, 0.42], hl: [-0.22, 0.05], hr: [-0.22, 0.05] }, headPitch: -0.3, earBack: 0.35, eyes: 'wide', mouth: 0.3, tailLift: 0.9, look: 0.2 })
        break
      }
      case 'fall': {
        const up = fx.vy < 0
        p = pose({ pitch: up ? -0.25 : 0.12, feet: up ? { fl: [0.18, 0.32], fr: [0.18, 0.3], hl: [-0.16, 0.26], hr: [-0.16, 0.24] } : { fl: [0.12, 0.08], fr: [0.1, 0.06], hl: [-0.08, 0.06], hr: [-0.1, 0.08] },
          earBack: up ? 0.3 : -0.45, tailLift: up ? 0.8 : 1.0, eyes: fx.vy > 900 ? 'wide' : 'open', mouth: fx.vy > 900 ? 0.35 : 0 })
        break
      }
      case 'land': case 'landHard': {
        const hard = state === 'landHard', l = clamp(stateT / (hard ? 0.5 : 0.25), 0, 1), sq = Math.sin(Math.PI * l) * (1 - l)
        p = pose({ bodyY: HIP_Y - sq * (hard ? 0.35 : 0.22), sy: 1 - sq * 0.12, eyes: hard ? 'closed' : 'open', earBack: hard ? 0.5 : 0 })
        if (stateT > (hard ? 0.7 : 0.25)) setState('stand')
        break
      }
      case 'bonk': case 'crash': {
        p = pose({ pitch: state === 'crash' ? -0.25 : 0.1, headTilt: Math.sin(stateT * 18) * 0.15 * (1 - clamp(stateT / 0.8, 0, 1)), eyes: stateT < 0.5 ? 'closed' : 'open',
          earBack: 0.7, mouth: stateT < 0.4 ? 0.25 : 0, blush: 0.7, tailLift: -0.1 })
        if (fx.ground && stateT > 0.8) setState('stand')
        break
      }
      case 'miss': {
        const surprised = stateT < 0.55
        p = pose(Object.assign({}, stateT > 0.3 ? SIT : {}, { eyes: surprised ? 'wide' : 'happy', mouth: surprised ? 0.35 : 0, earBack: surprised ? -0.3 : 0.5, blush: surprised ? 0.38 : 0.8,
          headTilt: surprised ? 0 : 0.25, tailWag: surprised ? 0 : Math.sin(t * 14) * 0.4, look: 0.4 }))
        if (stateT > 1.5) setState('stand')
        break
      }
      case 'sit': p = pose(Object.assign({}, SIT, { sy: 1 + Math.sin(t * 2.1) * 0.012, headTilt: pulse(t, 7.5, 1.6, 3) * 0.26, earL: pulse(t, 4.3, 0.22) * 0.5, earR: pulse(t, 6, 0.22, 2) * 0.5, eyes: still > 12 ? 'half' : 'open' })); break
      case 'sleep': p = pose({ bodyY: 0.4 + Math.sin(t * 1.5) * 0.01, pitch: 0.04, sy: 1 + Math.sin(t * 1.5) * 0.02, feet: { fl: [0.5, -0.05], fr: [0.5, -0.05], hl: [0.5, -0.05], hr: [0.5, -0.05] },
        headPitch: 0.62, headYaw: 0.55, headTilt: 0.15, eyes: 'closed', earBack: 0.55, tailLift: -0.55, tailCurl: 0.38, tailSide: 1.0, look: 0 }); break
      default: p = pose({ sy: 1 + Math.sin(t * 2.1) * 0.01, tailWag: Math.sin(t * 1.2) * 0.12, earL: pulse(t, 5.1, 0.22) * 0.5 })
    }
    if (now < celebrateUntil && fx.ground) p = pose({ roll: Math.sin(t * 8.5) * 0.05, eyes: 'happy', mouth: 0.5, tongue: 1, blush: 0.8, earBack: 0.25, tailLift: 0.8, tailCurl: 0.2, tailWag: Math.sin(t * 16) * 0.6, look: 0.3 })
    if (p.eyes === 'open' && ((t % 3.7) < 0.13 || ((t + 1.1) % 11) < 0.12)) p.eyes = 'closed'
    p.lookY = state === 'sleep' ? 0 : lookY
    return p
  }

  /* ======================================================================
     Loop
     ==================================================================== */
  let last = performance.now(), raf = 0, frame = 0
  function tick(ms) {
    raf = requestAnimationFrame(tick)
    const dt = Math.min(0.033, (ms - last) / 1000); last = ms; now += dt; stateT += dt; cooldown -= dt
    if (state === 'sleep' && (frame++ % 4)) return
    if (dirty || now - lastCollect > 1.2 || Math.abs(scrollY - collectY) > 0.3 * H) collect()

    // out of view: wait for scrolling to settle, then come back from the side it was left on
    const screenFeet = fx.y - scrollY
    const above = screenFeet < -10, below = screenFeet - BH > H + 10
    offscreenFor = (above || below) && !fx.ghost && !(above && curEdge && !fx.ground) ? offscreenFor + dt : 0
    if (offscreenFor > 0.2 && now - lastScroll > 0.18) {
      offscreenFor = 0
      collect()   // the page around the new scroll position
      if (below && (fx.ground || climbing || now - lastScroll < 2)) climbInFromBelow()   // left behind further down the page: climb up into view
      else dropInFromTop()                         // left above, or fell out of the page: drop back in
    }
    if (fx.ghost && fx.y - scrollY > H + BH * 2) { fx.ghost = null; dropInFromTop() }   // missed the climb: fall back in

    if (state === 'crouch' && stateT > 0.13 && pendingJump) {
      fx.vx = pendingJump.vx; fx.vy = pendingJump.vy; fx.ground = null; pendingJump = null; setState('fall')
    }
    const busy = ['crouch', 'land', 'landHard', 'miss', 'bonk', 'crash'].includes(state) || now < celebrateUntil
    if (fx.ground && !busy && !(above || below)) think()
    if (state === 'sleep' && now - cursor.moved < 0.3) setState('stand')

    // physics (none while it's out of view: it waits where it was left, so it scrolls away with the page)
    const sf = fx.y - scrollY
    const frozen = (sf < -10 || sf - BH > H + 10) && !fx.ghost && !climbing
    if (frozen) return
    const list = fx.ghost ? blocks : near(fx.x - 420, fx.y - 600, fx.x + 420, fx.y + 1.2 * H)
    const ev = {}
    const wasGround = fx.ground, speed = Math.abs(fx.vx)
    if (climbing && state !== 'climb') climbing = null
    if (climbing) {   // hug the wall and go up; at the top, hop over onto the ledge
      fx.x = lerp(fx.x, climbing.climbX, 1 - Math.pow(0.0001, dt)); fx.vx = 0; fx.vy = 0
      fx.y -= 230 * dt
      if (fx.y <= climbing.to.top + 6) {
        fx.x = climbing.climbX; fx.y = climbing.to.top; fx.vy = -420
        fx.vx = (climbing.landX - fx.x) / (2 * 420 / G); fx.ghost = climbing.to; climbing = null
        setState('leap')
      }
    } else sweep(fx, dt, list, ev)
    fx.x = clamp(fx.x, scrollX + 20, scrollX + W - 20)
    if (ev.wall) {
      if (speed > 240 || !wasGround) {
        nudge(ev.wall.el, 'shake', speed / 300)
        if (curEdge) { failed.set(edgeId(curEdge), now); curEdge = null }
        fx.vx = -fx.facing * 110; fx.vy = -260; fx.ground = null; route = null
        setState('crash')
      } else {
        const h = fx.y - ev.wall.top + 34
        if (wasGround && h > 0 && h < MAX_UP) { fx.vy = -Math.sqrt(2 * G * h); fx.vx = fx.facing * 210; fx.ground = null; setState('fall') }
        route = null
      }
    }
    if (ev.bonk) { nudge(ev.bonk.el, 'bump', 1); if (curEdge) { failed.set(edgeId(curEdge), now); curEdge = null } route = null; cooldown = Math.max(cooldown, 1.2); setState('bonk') }
    if (ev.land) {
      if (ev.land.el && ev.impact > 500) nudge(ev.land.el, 'dip', ev.impact / 900)
      fx.vx = 0
      if (state === 'pounce') { setState('miss'); cooldown = 2.2 }
      else if (state === 'crash' || state === 'bonk') { /* keep the ouch */ }
      else setState(ev.impact > 1100 ? 'landHard' : 'land')
      if (curEdge && nodeAt(ev.land, fx.x)?.id !== curEdge.to.id) route = null
      else if (route && route.path[0] === curEdge) route.path.shift()
      curEdge = null
    }
    if (!fx.ground && !['pounce', 'crash', 'bonk', 'leap', 'climb'].includes(state)) setState('fall')

    // pose
    const tgt = targetPose(dt)
    const k = 1 - Math.pow(0.002, dt)
    for (const key of NUM) shown[key] = lerp(shown[key], tgt[key], k)
    for (const leg of ['fl', 'fr', 'hl', 'hr']) for (const i of [0, 1]) shown.feet[leg][i] = lerp(shown.feet[leg][i], tgt.feet[leg][i], state === 'move' ? 1 : Math.min(1, k * 3))
    shown.eyes = tgt.eyes
    if (Math.abs(fx.vx) > 6) fx.facing = Math.sign(fx.vx)
    const moving = state === 'move' || !fx.ground
    fx.yaw = lerp(fx.yaw, fx.facing * (moving ? 1.25 : 0.55), 1 - Math.pow(0.0005, dt))
    shown.headYaw = lerp(shown.headYaw, moving ? 0 : -fx.yaw * 0.7 + tgt.headYaw, k)
    fox.apply(shown, now, { x: 0, y: tgt.lookY })

    canvas.style.transform = `translate3d(${(fx.x - CW / 2).toFixed(1)}px, ${(fx.y - FEET).toFixed(1)}px, 0)`
    place.position.set(0, 0, 0)
    place.rotation.set(0.22, fx.yaw, 0)
    place.scale.setScalar(S)
    // shadow on whatever is underneath (none when there's nothing below)
    let below2 = Infinity
    for (const b of list) if (footOn(b, fx.x) && b.top >= fx.y - 1 && b.top < below2) below2 = b.top
    const lift = clamp((below2 - fx.y) / 220, 0, 1)
    shadow.visible = below2 !== Infinity && !fx.ghost && below2 - fx.y < CH - FEET - 10
    shadow.position.set(0, -(below2 - fx.y) - 2, -1500)
    shadow.scale.set(S * 3.4 * (1 - lift * 0.5), S * 0.7 * (1 - lift * 0.5), 1)
    shadow.material.opacity = 1 - lift * 0.8
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(tick)

  // ?foxdebug: step frames by hand and read the state (for checking without a visible tab)
  if (debug) window.__foxDebug = {
    run(seconds, cx, cy) {
      if (cx != null) { cursor.x = cx; cursor.y = cy; cursor.in = true; cursor.moved = now }
      for (let i = 0; i < seconds * 60; i++) tick(last + 1000 / 60)
      cancelAnimationFrame(raf)
      return { state, x: Math.round(fx.x - scrollX), y: Math.round(fx.y - scrollY), on: fx.ground ? fx.ground.label : null, route: route ? route.path.map((e) => e.type + '→' + e.to.label.slice(0, 12)) : null }
    },
    scrolled() { lastScroll = now },
    nodes: () => nodes.map((n) => `${n.label.slice(0, 12)} [${Math.round(n.left)}-${Math.round(n.right)}] t${Math.round(n.top - scrollY)}`),
    shot: () => canvas.toDataURL('image/png'),
  }

  return {
    destroy() {
      cancelAnimationFrame(raf); mo.disconnect()
      removeEventListener('resize', resize); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll)
      removeEventListener('popstate', markDirty); removeEventListener('fox:celebrate', onCelebrate)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      fox.dispose(); shadowTex.dispose(); shadow.geometry.dispose(); shadow.material.dispose()
      renderer.dispose(); layer.remove()
    },
  }
}
