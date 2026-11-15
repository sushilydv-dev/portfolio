import { readFileSync } from 'node:fs'

// Turns a sentence into a 64-number "meaning" vector with potion-base-2M (a static embedding
// model): split the text into word pieces exactly like the model's BERT tokenizer, look up each
// piece's vector, average them and scale to length 1. Similar meanings give similar vectors.

const MAX_WORD = 100

// Same text clean-up as BERT: drop control characters, lower-case, strip accents, and split
// on spaces and punctuation (each punctuation mark becomes its own word)
const isPunct = (ch) => {
  const c = ch.codePointAt(0)
  if ((c >= 33 && c <= 47) || (c >= 58 && c <= 64) || (c >= 91 && c <= 96) || (c >= 123 && c <= 126)) return true
  return /\p{P}/u.test(ch)
}
function basicTokens(text) {
  const clean = text
    .replace(/[\p{Cc}\uFFFD]/gu, (ch) => (/\s/.test(ch) ? ch : ''))
    .replace(/\s/g, ' ')
    .replace(/[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/g, ' $& ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
  const out = []
  for (const word of clean.split(' ')) {
    if (!word) continue
    let cur = ''
    for (const ch of word) {
      if (isPunct(ch)) {
        if (cur) out.push(cur)
        out.push(ch)
        cur = ''
      } else cur += ch
    }
    if (cur) out.push(cur)
  }
  return out
}

export function loadModel(dir) {
  const vocab = JSON.parse(readFileSync(new URL('vocab.json', dir), 'utf8'))
  const { dim } = JSON.parse(readFileSync(new URL('meta.json', dir), 'utf8'))
  const raw = readFileSync(new URL('vectors.bin', dir))
  const ids = new Map(vocab.map((t, i) => [t, i]))
  const stride = 4 + dim

  // WordPiece: greedily take the longest piece in the vocabulary, continuing with "##" pieces.
  // A word that can't be fully split is unknown and skipped (as the model itself does).
  function pieces(word) {
    if (word.length > MAX_WORD) return []
    const out = []
    let start = 0
    while (start < word.length) {
      let end = word.length, found = -1
      while (start < end) {
        const sub = (start > 0 ? '##' : '') + word.slice(start, end)
        const id = ids.get(sub)
        if (id !== undefined) { found = id; break }
        end--
      }
      if (found < 0) return []
      out.push(found)
      start = end
    }
    return out
  }

  function embed(text) {
    const v = new Float32Array(dim)
    let n = 0
    for (const word of basicTokens(text)) {
      for (const id of pieces(word)) {
        const at = id * stride
        const scale = raw.readFloatLE(at)
        for (let c = 0; c < dim; c++) v[c] += raw.readInt8(at + 4 + c) * scale
        n++
      }
    }
    let len = 0
    for (let c = 0; c < dim; c++) len += v[c] * v[c]
    len = Math.sqrt(len)
    if (n === 0 || len === 0) return null
    for (let c = 0; c < dim; c++) v[c] /= len
    return v
  }

  return { embed, dim }
}

export const cosine = (a, b) => {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}
