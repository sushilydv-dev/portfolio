// One-off: converts MinishLab/potion-base-2M (MIT licence, https://huggingface.co/MinishLab/potion-base-2M)
// into the compact files the assistant loads at runtime.
//
//   node scripts/build-assistant-model.mjs <folder with model.safetensors + tokenizer.json>
//
// Writes assistant/model/vocab.json (the tokens, in id order) and assistant/model/vectors.bin:
// for each token, a float32 scale followed by its 64 numbers as int8 (value = int8 * scale).
// That is ~2 MB instead of 7.5 MB, with no meaningful loss for matching questions.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const src = process.argv[2]
if (!src) throw new Error('Pass the folder that holds model.safetensors and tokenizer.json')

const buf = readFileSync(join(src, 'model.safetensors'))
const headerLen = Number(buf.readBigUInt64LE(0))
const header = JSON.parse(buf.subarray(8, 8 + headerLen).toString())
const { dtype, shape, data_offsets: [start, end] } = header.embeddings
if (dtype !== 'F32') throw new Error(`Unexpected dtype ${dtype}`)
const [rows, dim] = shape
const data = new Float32Array(buf.buffer.slice(buf.byteOffset + 8 + headerLen + start, buf.byteOffset + 8 + headerLen + end))

const tokenizer = JSON.parse(readFileSync(join(src, 'tokenizer.json'), 'utf8'))
const vocab = new Array(rows)
for (const [token, id] of Object.entries(tokenizer.model.vocab)) vocab[id] = token
if (vocab.some((t) => t === undefined)) throw new Error('Vocabulary has gaps')

const out = Buffer.alloc(rows * (4 + dim))
for (let r = 0; r < rows; r++) {
  let max = 0
  for (let c = 0; c < dim; c++) max = Math.max(max, Math.abs(data[r * dim + c]))
  const scale = max / 127 || 1
  const at = r * (4 + dim)
  out.writeFloatLE(scale, at)
  for (let c = 0; c < dim; c++) out.writeInt8(Math.round(data[r * dim + c] / scale), at + 4 + c)
}

const dir = new URL('../assistant/model/', import.meta.url)
mkdirSync(dir, { recursive: true })
writeFileSync(new URL('vocab.json', dir), JSON.stringify(vocab))
writeFileSync(new URL('vectors.bin', dir), out)
writeFileSync(new URL('meta.json', dir), JSON.stringify({ source: 'MinishLab/potion-base-2M', licence: 'MIT', rows, dim }))
console.log(`Wrote ${rows} tokens × ${dim} dims (${(out.length / 1e6).toFixed(2)} MB vectors)`)
