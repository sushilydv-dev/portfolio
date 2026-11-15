import { readFileSync } from 'node:fs'
import { buildModel } from './embed.js'

// Server side (Vercel function, Vite dev server): reads the model files from assistant/model/.
export function loadModelFromDisk(dir = new URL('./model/', import.meta.url)) {
  const vocab = JSON.parse(readFileSync(new URL('vocab.json', dir), 'utf8'))
  const { dim } = JSON.parse(readFileSync(new URL('meta.json', dir), 'utf8'))
  const bytes = readFileSync(new URL('vectors.bin', dir))
  return buildModel({ vocab, dim, bytes })
}
