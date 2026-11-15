import { useEffect } from 'react'

// Empty for now: the Now page (what I'm focused on these days) will be designed later.
function Now() {
  useEffect(() => {
    document.title = 'Now · Sushil Yadav'
  }, [])

  return (
    <main id="top" className="min-h-[70svh]">
      <h1 className="sr-only">Now</h1>
    </main>
  )
}

export default Now
