import { createAssistant } from '../../../assistant/assistant.js'
import { buildModel } from '../../../assistant/embed.js'
import meta from '../../../assistant/model/meta.json'
import vectorsUrl from '../../../assistant/model/vectors.bin?url'
import vocabUrl from '../../../assistant/model/vocab.json?url'

// The assistant running in the visitor's browser, for hosts with no /api/chat function
// (GitHub Pages). Loaded only when needed: the model files (~2.3 MB, less over gzip) are
// fetched on the first question and kept for the rest of the visit.

let ready = null

export function localReply(question) {
  ready ??= Promise.all([
    fetch(vocabUrl).then((r) => r.json()),
    fetch(vectorsUrl).then((r) => r.arrayBuffer()),
  ])
    .then(([vocab, buf]) => createAssistant(buildModel({ vocab, dim: meta.dim, bytes: new Uint8Array(buf) })))
    .catch((err) => {
      ready = null // let the next question try again
      throw err
    })
  return ready.then((assistant) => assistant.reply(question))
}
