import ArrowLink from '@/components/ui/ArrowLink'
import { profile } from '@/data/profile'

function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-6 py-24 md:px-12 md:py-32">
      {/* Heading kept for screen readers and the #about link; hidden visually */}
      <h2 id="about-heading" className="sr-only">About</h2>

      {/* Full-bleed like the hero (no Container), so the text sits flush with the right edge.
          Full width on phones so the lines are not squeezed into a thin column. */}
      <p className="ml-auto text-right text-[clamp(2.125rem,5.1vw,4.25rem)] leading-[1.15] font-medium tracking-tight text-balance text-ink md:max-w-[85%]">
        {profile.about}
      </p>

      <div className="mt-10 flex justify-end md:mt-12">
        <ArrowLink href="/contact" className="text-lg">
          Let's talk
        </ArrowLink>
      </div>
    </section>
  )
}

export default About
