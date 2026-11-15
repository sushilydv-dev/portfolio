// "What I believe" principles. `keyword` is the word that gets the blue highlight / hand-drawn doodle.
export const beliefs = [
  {
    title: 'Your data stays yours.',
    keyword: 'yours',
    body: 'AI and apps that run on your own servers, not someone else’s.',
  },
  {
    title: 'Boring tech, on purpose.',
    keyword: 'Boring',
    body: 'Proven tools that will still be running in five years.',
  },
  {
    title: 'Done means deployed.',
    keyword: 'deployed',
    body: 'Not a demo. Live, tested and documented.',
  },
]

// Splits a title around its keyword: ['Your data stays ', 'yours', '.']
export function splitKeyword({ title, keyword }) {
  const i = title.indexOf(keyword)
  return [title.slice(0, i), keyword, title.slice(i + keyword.length)]
}
