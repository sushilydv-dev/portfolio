import { cosine, loadModel } from './embed.js'
import { fallback, knowledge } from './knowledge.js'

// The site assistant: picks the written answer whose example questions are closest in meaning
// to what the visitor asked (potion-base-2M vectors), helped by keywords. Shared by the Vercel
// function (api/chat.js) and the Vite dev server.

const MAX_LEN = 300
const KEYWORD_WEIGHT = 0.16    // added per matching keyword (up to two)
const MIN_SCORE = 0.62         // below this, the assistant admits it doesn't know

const words = (text) => text.toLowerCase().normalize('NFD').replace(/\p{Mn}/gu, '').match(/[\p{L}\p{N}]+/gu) ?? []

export function createAssistant(modelDir = new URL('./model/', import.meta.url)) {
  const model = loadModel(modelDir)
  const entries = knowledge.map((k) => ({
    ...k,
    keywords: new Set(k.keywords.map((w) => w.toLowerCase())),
    vectors: k.ask.map((q) => model.embed(q)).filter(Boolean),
  }))

  function rank(question) {
    const v = model.embed(question)
    const qWords = new Set(words(question))
    return entries
      .map((e) => {
        const meaning = v ? Math.max(...e.vectors.map((u) => cosine(v, u))) : 0
        let hits = 0
        for (const w of qWords) if (e.keywords.has(w)) hits++
        return { entry: e, meaning, hits, score: meaning + KEYWORD_WEIGHT * Math.min(hits, 2) }
      })
      .sort((a, b) => b.score - a.score)
  }

  function reply(question) {
    const q = String(question ?? '').slice(0, MAX_LEN).trim()
    if (!q) return { ...pick(fallback), score: 0 }
    const [best] = rank(q)
    if (!best || best.score < MIN_SCORE) return { ...pick(fallback), score: best?.score ?? 0 }
    return { ...pick(best.entry), score: best.score }
  }

  return { reply, rank }
}

const pick = ({ id, answer, links = [] }) => ({ id, answer, links })
