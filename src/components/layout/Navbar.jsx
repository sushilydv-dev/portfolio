import { navLinks } from '@/data/navigation'
import { profile } from '@/data/profile'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import { useMagnetic } from '@/hooks/useMagnetic'
import { sectionHref, usePath } from '@/hooks/usePath'
import SiteLink from '@/components/ui/SiteLink'
import ThemeToggle from '@/components/ui/ThemeToggle'
import MobileMenu from '@/components/layout/MobileMenu'

function NavLink({ href, children }) {
  const ref = useMagnetic({ radius: 40, strength: 0.15, maxOffset: 6, stretch: 0.04, group: 'nav' })

  return (
    <SiteLink
      ref={ref}
      href={href}
      className="relative inline-block font-medium text-muted transition-colors will-change-transform after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-ink hover:after:origin-left hover:after:scale-x-100 focus-visible:text-ink focus-visible:after:origin-left focus-visible:after:scale-x-100"
    >
      {children}
    </SiteLink>
  )
}

function Navbar() {
  const logoRef = useMagnetic({ strength: 0.25, maxOffset: 18, stretch: 0.1 })
  const hidden = useHideOnScroll()
  const path = usePath()

  return (
    <header
      className={`sticky top-0 z-10 print:hidden bg-canvas/90 text-ink backdrop-blur transition-transform duration-300 ease-out focus-within:translate-y-0 motion-reduce:transition-none ${hidden ? '-translate-y-full' : 'translate-y-0'} after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-center after:scale-x-0 after:bg-ink/20 after:transition-transform after:duration-500 after:ease-out hover:after:scale-x-100`}
    >
      <div className="flex h-16 w-full items-center justify-between px-6 md:px-12">
        <SiteLink
          ref={logoRef}
          href={path === '/' ? '#top' : '/'}
          className="inline-block font-display text-2xl leading-none will-change-transform"
        >
          {profile.name}
        </SiteLink>
        <div className="flex items-center gap-4 md:gap-9">
          <ul className="hidden gap-9 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={sectionHref(link.href, path)}>{link.label}</NavLink>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default Navbar
