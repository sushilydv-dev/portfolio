import { useEffect } from 'react'
import { usePath } from '@/hooks/usePath'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/layout/PageTransition'
import FoxMascot from '@/components/mascot/FoxMascot'
import ChatWidget from '@/components/assistant/ChatWidget'
import AboutPage from '@/pages/About'
import ContactPage from '@/pages/Contact'
import Now from '@/pages/Now'
import Resume from '@/pages/Resume'
import ServicesPage from '@/pages/Services'
import WorkPage from '@/pages/Work'
import Project from '@/pages/Project'
import Service from '@/pages/Service'
import { findService } from '@/data/services'
import { findWork } from '@/data/work'
import About from '@/sections/About'
import Beliefs from '@/sections/Beliefs'
import BuildMarquee from '@/sections/BuildMarquee'
import Hero from '@/sections/Hero'
import Services from '@/sections/Services'
import Work from '@/sections/Work'

function Home() {
  useEffect(() => {
    document.title = 'Sushil Yadav'
  }, [])

  return (
    <main>
      <Hero />
      <About />
      <BuildMarquee />
      <Work />
      <Services />
      <Beliefs />
      {/* Experience section (src/sections/Experience.jsx) is hidden for now; the nav links stay */}
    </main>
  )
}

const pages = { '/about': AboutPage, '/work': WorkPage, '/services': ServicesPage, '/contact': ContactPage, '/resume': Resume, '/now': Now }

function App() {
  useSmoothScroll()
  const path = usePath()
  const Page = pages[path] ?? Home
  // A project's own page: /work/<slug> (an unknown slug falls back to the Work list)
  const projectSlug = path.startsWith('/work/') ? path.slice('/work/'.length) : null
  // A service's own page: /services/<slug> (an unknown slug falls back to the Services page)
  const serviceSlug = path.startsWith('/services/') ? path.slice('/services/'.length) : null

  // Arriving with a #section (e.g. /#work from the Resume page): scroll to it once it has rendered
  useEffect(() => {
    const { hash } = window.location
    if (!hash) return
    const frame = requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [path])

  return (
    <>
      <Navbar />
      {projectSlug ? (
        findWork(projectSlug) ? <Project key={projectSlug} slug={projectSlug} /> : <WorkPage />
      ) : serviceSlug ? (
        findService(serviceSlug) ? <Service key={serviceSlug} slug={serviceSlug} /> : <ServicesPage />
      ) : (
        <Page />
      )}
      <Footer />
      <FoxMascot />
      <ChatWidget />
      <PageTransition />
    </>
  )
}

export default App
