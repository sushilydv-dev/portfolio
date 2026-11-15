import * as THREE from 'three'

/* The fox kit: model, fur, skeleton and pose solver.
   Model space: stands on y = 0, faces +z, about 3.3 units tall (ear tips).
   Ported from roadmap/mascot-preview/fox-3d-preview.html. */

const C = {
  orange: new THREE.Color('#e9762b'), orangeDeep: new THREE.Color('#c85a1c'), white: new THREE.Color('#fbf6ee'),
  cream: new THREE.Color('#f3e2cf'), dark: new THREE.Color('#3a2820'), nose: new THREE.Color('#1c1412'),
  blush: new THREE.Color('#ff9a8f'), mouth: new THREE.Color('#5a1f22'), tongue: new THREE.Color('#ef7b86'),
}
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
const mix3 = (a, b, t, out) => out.copy(a).lerp(b, t)
const glossy = (color, rough = 0.25) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 1, clearcoatRoughness: 0.12 })
function paint(geo, fn) {
  const p = geo.attributes.position, cols = new Float32Array(p.count * 3), c = new THREE.Color(), v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v, c); cols.set([c.r, c.g, c.b], i * 3) }
  geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
  return geo
}
const ball = (rx, ry, rz, w = 40, h = 28) => { const g = new THREE.SphereGeometry(1, w, h); g.scale(rx, ry, rz); return g }

export const HIP_Y = 1.1
export const L1 = 0.52
export const L2 = 0.5

export function createFox({ shells = 10 } = {}) {
  /* ---- Shell fur ---- */
  const noiseTex = (() => {
    const n = 128, data = new Uint8Array(n * n * 4)
    for (let i = 0; i < n * n; i++) { const v = Math.pow(Math.random(), 0.55) * 255; data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v; data[i * 4 + 3] = 255 }
    const t = new THREE.DataTexture(data, n, n)
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = t.minFilter = THREE.NearestFilter; t.needsUpdate = true
    return t
  })()
  const wind = new THREE.Vector3()
  const disposables = [noiseTex]
  function furMaterial(shell, len, density) {
    const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92, metalness: 0 })
    m.defines = { USE_UV: '' }
    const u = { uShell: { value: shell }, uLen: { value: len }, uDens: { value: density }, uNoise: { value: noiseTex }, uWind: { value: wind } }
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u)
      sh.vertexShader = 'uniform float uShell; uniform float uLen; uniform vec3 uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        transformed += normal * uLen * uShell;
        transformed.y -= uLen * uShell * uShell * 0.55;
        transformed += uWind * uShell * uShell * uLen;`)
      sh.fragmentShader = 'uniform float uShell; uniform float uDens; uniform sampler2D uNoise;\n' + sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
        float strand = texture2D(uNoise, vUv * uDens).r;
        if (uShell > 0.0 && strand < uShell * 0.98 + 0.02) discard;
        diffuseColor.rgb *= mix(0.62, 1.06, uShell);`)
    }
    m.customProgramCacheKey = () => 'fur'
    disposables.push(m)
    return m
  }
  function furry(geo, len, density) {
    disposables.push(geo)
    const g = new THREE.Group()
    g.add(new THREE.Mesh(geo, furMaterial(0, len, density)))
    for (let i = 1; i <= shells; i++) g.add(new THREE.Mesh(geo, furMaterial(i / shells, len, density)))
    return g
  }

  /* ---- Rig ---- */
  const root = new THREE.Group()
  const body = new THREE.Group()
  body.position.set(0, HIP_Y, -0.55)
  root.add(body)

  {
    const geo = ball(0.7, 0.66, 1.0, 48, 36)
    paint(geo, (v, c) => {
      const under = sstep(-0.2, -0.55, v.y) * 0.85
      const chest = sstep(0.45, 0.85, v.z) * sstep(-0.6, 0.15, v.y)
      mix3(C.orange, C.white, Math.max(under, chest), c)
      if (v.y > 0.4) c.lerp(C.orangeDeep, 0.18 * sstep(0.4, 0.66, v.y))
    })
    const torso = furry(geo, 0.1, 30)
    torso.position.set(0, 0.05, 0.55)
    body.add(torso)
    const ruff = furry(paint(ball(0.48, 0.52, 0.4), (v, c) => c.copy(C.white)), 0.2, 26)
    ruff.position.set(0, 0.12, 1.32)
    body.add(ruff)
  }

  function makeLeg(front, x) {
    const upper = new THREE.Group(), lower = new THREE.Group(), paw = new THREE.Group()
    const uGeo = paint(new THREE.CapsuleGeometry(front ? 0.15 : 0.17, L1 - 0.12, 6, 16), (v, c) => (front ? mix3(C.orange, C.dark, sstep(0.0, -0.22, v.y), c) : c.copy(C.orange)))
    const u = furry(uGeo, 0.05, 40); u.position.y = -L1 / 2
    upper.add(u)
    if (!front) {
      const th = furry(paint(ball(0.3, 0.38, 0.44), (v, c) => mix3(C.orange, C.orangeDeep, sstep(0.2, -0.4, v.y) * 0.3, c)), 0.09, 30)
      th.position.set(x > 0 ? 0.04 : -0.04, -0.1, 0.04)
      upper.add(th)
    }
    const l = furry(paint(new THREE.CapsuleGeometry(0.12, L2 - 0.1, 6, 14), (v, c) => c.copy(C.dark)), 0.035, 44)
    l.position.y = -L2 / 2
    lower.add(l)
    const pawMat = new THREE.MeshStandardMaterial({ color: C.dark, roughness: 0.85 })
    disposables.push(pawMat)
    const pawMesh = new THREE.Mesh(ball(0.17, 0.1, 0.23, 24, 16), pawMat)
    pawMesh.position.set(0, 0, 0.06)
    paw.add(pawMesh)
    lower.position.y = -L1
    paw.position.y = -L2
    upper.add(lower); lower.add(paw)
    return { upper, lower, paw, front, bend: front ? 1 : -1 }
  }
  const legs = { fl: makeLeg(true, -1), fr: makeLeg(true, 1), hl: makeLeg(false, -1), hr: makeLeg(false, 1) }
  legs.fl.upper.position.set(-0.27, -0.12, 1.12); legs.fr.upper.position.set(0.27, -0.12, 1.12)
  body.add(legs.fl.upper, legs.fr.upper)
  legs.hl.upper.position.set(-0.31, HIP_Y, -0.5); legs.hr.upper.position.set(0.31, HIP_Y, -0.5)
  root.add(legs.hl.upper, legs.hr.upper)

  const tailJoints = []
  {
    const segLen = 0.34
    const base = new THREE.Group(); base.position.set(0, 0.22, -0.38); body.add(base)
    let parent = base
    for (let i = 0; i < 5; i++) {
      const j = new THREE.Group()
      if (i > 0) j.position.z = -segLen
      const r = [0.17, 0.25, 0.29, 0.27, 0.19][i]
      const m = furry(paint(ball(r, r, segLen * 1.25, 32, 22), (v, c) => mix3(C.orange, C.white, i === 4 ? sstep(0.06, -0.12, v.z) : 0, c)), 0.17 - i * 0.004, 24)
      m.position.z = -segLen / 2
      j.add(m); parent.add(j); tailJoints.push(j); parent = j
    }
    const tip = furry(paint(ball(0.11, 0.11, 0.17, 20, 14), (v, c) => c.copy(C.white)), 0.12, 26)
    tip.position.z = -0.42
    tailJoints[4].add(tip)
  }

  const neck = new THREE.Group(); neck.position.set(0, 0.3, 1.18); body.add(neck)
  const head = new THREE.Group(); head.position.set(0, 0.55, 0.22); head.scale.setScalar(0.92); neck.add(head)
  const face = {}
  {
    const geo = new THREE.SphereGeometry(1, 80, 60)
    const p = geo.attributes.position, v = new THREE.Vector3()
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i)
      const cheek = sstep(0.1, -0.35, v.y) * sstep(0.3, 0.85, Math.abs(v.x)) * sstep(-0.5, 0.2, v.z)
      v.x *= 1 + 0.28 * cheek; v.y -= 0.08 * cheek; v.z *= 0.92
      p.setXYZ(i, v.x, v.y, v.z)
    }
    geo.computeVertexNormals()
    paint(geo, (vv, c) => {
      const ax = Math.abs(vv.x)
      const mask = sstep(0.1, -0.08, vv.y - (-0.28 + 0.62 * ax * ax + 0.1 * ax)) * sstep(-0.05, 0.38, vv.z)
      mix3(C.orange, C.white, mask, c)
      if (vv.y > 0.55) c.lerp(C.orangeDeep, 0.25 * sstep(0.55, 1, vv.y))
    })
    const skull = furry(geo, 0.065, 46)
    skull.scale.set(1.05, 0.94, 0.98)
    head.add(skull)
    const muzzle = furry(paint(ball(1, 1, 1), (vv, c) => mix3(C.white, C.orange, sstep(0.3, 0.85, vv.y) * sstep(-0.2, 0.6, vv.z) * 0.85, c)), 0.025, 70)
    muzzle.scale.set(0.42, 0.32, 0.52); muzzle.position.set(0, -0.3, 0.7)
    head.add(muzzle)
    const nose = new THREE.Mesh(ball(0.15, 0.1, 0.11, 24, 16), glossy(C.nose, 0.3))
    nose.position.set(0, -0.2, 1.2)
    head.add(nose)

    const mouthMat = new THREE.MeshStandardMaterial({ color: C.nose, roughness: 0.6 })
    face.mouthW = new THREE.Group()
    for (const pts of [[[0, -0.29, 1.214], [0, -0.4, 1.205]], [[0, -0.4, 1.205], [-0.065, -0.452, 1.172], [-0.15, -0.41, 1.168]], [[0, -0.4, 1.205], [0.065, -0.452, 1.172], [0.15, -0.41, 1.168]]])
      face.mouthW.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 10, 0.016, 6, false), mouthMat))
    head.add(face.mouthW)
    face.mouthOpen = new THREE.Group()
    face.mouthOpen.position.set(0, -0.47, 1.1)
    face.mouthOpen.add(new THREE.Mesh(ball(0.15, 0.12, 0.08, 20, 14), new THREE.MeshStandardMaterial({ color: C.mouth, roughness: 0.7 })))
    face.tongue = new THREE.Mesh(ball(0.09, 0.04, 0.1, 20, 14), new THREE.MeshStandardMaterial({ color: C.tongue, roughness: 0.5 }))
    face.tongue.position.set(0, -0.05, 0.06)
    face.mouthOpen.add(face.tongue)
    head.add(face.mouthOpen)
    face.blush = []
    for (const s of [-1, 1]) {
      const b = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), new THREE.MeshBasicMaterial({ color: C.blush, transparent: true, opacity: 0.38, depthWrite: false }))
      const at = new THREE.Vector3(s * 0.62, -0.2, 0.74)
      b.position.copy(at); b.lookAt(at.clone().multiplyScalar(2)); b.position.multiplyScalar(1.06)
      head.add(b); face.blush.push(b)
    }
  }

  const irisTex = (() => {
    const s = 128, cv = document.createElement('canvas'); cv.width = cv.height = s
    const g = cv.getContext('2d')
    const r = g.createRadialGradient(s / 2, s * 0.6, 2, s / 2, s / 2, s / 2)
    r.addColorStop(0, '#2a140a'); r.addColorStop(0.42, '#140904'); r.addColorStop(0.5, '#7a3f16'); r.addColorStop(0.78, '#b4692a'); r.addColorStop(0.95, '#3a1d0b'); r.addColorStop(1, '#120805')
    g.fillStyle = r; g.fillRect(0, 0, s, s)
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace
    disposables.push(t)
    return t
  })()
  const eyes = []
  {
    const arcMat = new THREE.MeshStandardMaterial({ color: C.nose, roughness: 0.6 })
    const arc = (pts) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 12, 0.026, 6, false), arcMat)
    for (const s of [-1, 1]) {
      const dir = new THREE.Vector3(s * 0.42, 0.08, 0.9).normalize()
      const at = dir.clone().multiply(new THREE.Vector3(1.05, 0.94, 0.9))
      const eye = new THREE.Group()
      eye.position.copy(at); eye.lookAt(at.clone().add(dir))
      const open = new THREE.Group()
      const bl = new THREE.Mesh(new THREE.SphereGeometry(0.21, 32, 24), glossy(new THREE.Color('#120b08'), 0.12))
      bl.scale.set(0.86, 1, 0.55); open.add(bl)
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), new THREE.MeshStandardMaterial({ map: irisTex, roughness: 0.25 }))
      iris.scale.set(0.86, 1, 1); iris.position.z = 0.117; open.add(iris)
      const hl = (r, x, y, o = 1) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: o })); m.position.set(x, y, 0.121); open.add(m) }
      hl(0.06, s * 0.04, 0.07); hl(0.028, -s * 0.05, -0.06, 0.85)
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.215, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: C.orange, roughness: 0.9 }))
      lid.rotation.x = Math.PI / 2 - 0.05; lid.scale.set(0.9, 0.58, 1.02)
      open.add(lid)
      const closed = arc([[-0.15, 0.02, 0.1], [0, -0.06, 0.12], [0.15, 0.02, 0.1]])
      const happy = arc([[-0.15, -0.04, 0.1], [0, 0.07, 0.12], [0.15, -0.04, 0.1]])
      eye.add(open, closed, happy)
      eye.userData = { open, closed, happy, lid }
      head.add(eye); eyes.push(eye)
    }
  }

  const ears = []
  for (const s of [-1, 1]) {
    const ear = new THREE.Group()
    ear.position.set(s * 0.56, 0.72, -0.08)
    const outer = furry(paint(new THREE.ConeGeometry(0.4, 0.95, 32, 6), (v, c) => mix3(C.orange, C.dark, sstep(0.05, 0.3, v.y), c)), 0.03, 60)
    outer.scale.set(1, 1, 0.46); outer.position.y = 0.4
    ear.add(outer)
    const inner = furry(paint(new THREE.ConeGeometry(0.25, 0.66, 24, 5), (v, c) => mix3(C.cream, C.white, sstep(-0.3, 0.1, v.y), c)), 0.11, 32)
    inner.scale.set(1, 1, 0.26); inner.position.set(0, 0.34, 0.07)
    ear.add(inner)
    ear.userData.s = s
    head.add(ear); ears.push(ear)
  }

  /* ---- Pose solver ---- */
  const tmp = new THREE.Vector3(), target = new THREE.Vector3()
  function solveLeg(leg, f, parentPitch) {
    leg.upper.getWorldPosition(tmp); root.worldToLocal(tmp)
    target.set(tmp.x, 0.1 + f[1], tmp.z + f[0])
    const dz = target.z - tmp.z, dy = target.y - tmp.y
    const d = clamp(Math.hypot(dz, dy), 0.12, L1 + L2 - 0.005)
    const base = Math.atan2(dz, -dy)
    const a = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1))
    const b = Math.acos(clamp((L2 * L2 + d * d - L1 * L1) / (2 * L2 * d), -1, 1))
    const upperW = -(base + leg.bend * a), lowerW = -(base - leg.bend * b)
    leg.upper.rotation.x = upperW - parentPitch
    leg.lower.rotation.x = lowerW - upperW
    leg.paw.rotation.x = -lowerW * 0.85
  }

  /* p: pose numbers (see moves.js); look: {x, y} in -1..1 where the fox should glance */
  function apply(p, t, look) {
    body.position.y = p.bodyY
    body.rotation.set(p.pitch, 0, p.roll)
    body.scale.set(1, p.sy, 1)
    legs.hl.upper.position.y = p.bodyY
    legs.hr.upper.position.y = p.bodyY
    neck.rotation.x = -p.pitch * 0.85 + p.headPitch - look.y * 0.35 * p.look
    neck.rotation.y = clamp(p.headYaw + look.x * 0.7 * p.look, -1.1, 1.1)
    neck.rotation.z = p.headTilt + Math.sin(t * 0.7) * 0.03
    for (const ear of ears) {
      const s = ear.userData.s, own = s < 0 ? p.earL : p.earR
      ear.rotation.set(-0.12 - p.earBack * 0.9 - own * 0.5, 0, -s * (0.32 + p.earBack * 0.35))
    }
    tailJoints.forEach((j, i) => {
      const w = p.tailWag * (0.4 + i * 0.25)
      j.rotation.x = i === 0 ? p.tailLift : p.tailCurl * (i < 3 ? -0.5 : 1)
      j.rotation.y = (i === 0 ? 0 : p.tailSide * 0.42) + w * Math.cos(i * 0.6)
    })
    root.updateMatrixWorld(true)
    for (const k of ['fl', 'fr', 'hl', 'hr']) solveLeg(legs[k], p.feet[k], legs[k].front ? p.pitch : 0)
    for (const e of eyes) {
      const u = e.userData
      u.open.visible = p.eyes === 'open' || p.eyes === 'wide' || p.eyes === 'half'
      u.closed.visible = p.eyes === 'closed'
      u.happy.visible = p.eyes === 'happy'
      u.lid.visible = p.eyes === 'half'
      e.scale.setScalar(p.eyes === 'wide' ? 1.14 : 1)
    }
    face.mouthW.visible = p.mouth < 0.08
    face.mouthOpen.visible = p.mouth >= 0.08
    face.mouthOpen.scale.set(0.8 + p.mouth * 0.4, 0.3 + p.mouth * 1.1, 1)
    face.tongue.visible = p.tongue > 0.5
    face.tongue.position.y = -0.05 - p.mouth * 0.05
    for (const b of face.blush) b.material.opacity = p.blush
    wind.set(Math.sin(t * 1.7) * 0.15, 0, Math.cos(t * 1.3) * 0.1)
  }

  function dispose() {
    root.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose() })
    disposables.forEach((d) => d.dispose && d.dispose())
  }

  return { root, apply, dispose }
}
