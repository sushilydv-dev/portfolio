import { createAssistant } from '../assistant/assistant.js'
import { loadModelFromDisk } from '../assistant/node.js'

// POST /api/chat  { question }  →  { id, answer, links }
// A Vercel serverless function (Node runtime). The 2 MB model lives on the server, so visitors
// download nothing. The Vite dev server mounts this same handler (see vite.config.js).
// Written against plain Node req/res so it runs the same on Vercel and locally.

let assistant = null                    // loaded once per warm instance
const hits = new Map()                   // ip → recent request times, for a light rate limit
const LIMIT = 30, WINDOW = 60_000         // 30 questions a minute per visitor

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

async function readBody(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 4096) throw new Error('too large')
  }
  return JSON.parse(raw || '{}')
}

function limited(req) {
  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? '').split(',')[0].trim()
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return send(res, 405, { error: 'Use POST' })
  }
  if (limited(req)) return send(res, 429, { error: 'Too many questions, try again in a minute.' })

  let question
  try {
    question = (await readBody(req)).question
  } catch {
    return send(res, 400, { error: 'Send JSON: { "question": "..." }' })
  }
  if (typeof question !== 'string' || !question.trim()) return send(res, 400, { error: 'Missing question' })

  assistant ??= createAssistant(loadModelFromDisk())
  const { id, answer, links } = assistant.reply(question)
  return send(res, 200, { id, answer, links })
}
