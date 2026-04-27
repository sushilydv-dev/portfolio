import React from 'react'
import "../src/App.css"
import { useEffect } from 'react'
import { useState, useRef} from 'react';
import Home from "./component/Home"
import Navbar from './component/Navbar'
import About from './component/About'
import Technologies from './component/Technologies';
import Projects from './component/Projects';
import { Contact } from './component/Contact';
import Socials from './component/Socials';
const App = () => {
  const [activeSection, setActiveSection] = useState("home");

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const techRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const options = { threshold: 0.6 }; 
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    const sections = [
      homeRef.current,
      aboutRef.current,
      techRef.current,
      projectsRef.current,
      contactRef.current,
    ];
    sections.forEach((sec) => observer.observe(sec));

    return () => sections.forEach((sec) => observer.unobserve(sec));
  }, []);

  return (
    <div className='-scroll-smooth'>
    <Navbar externalActive={activeSection} />
      <div className=" top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] fixed"></div>
   
    <section ref={homeRef}  className=' max-w-screen h-screen ' id='home'><Home/></section>
    
    
    <section ref={aboutRef} className=' max-w-screen ' id='about'><About/>
     
      
    </section>
    <section ref={techRef} className=' max-w-screen h-auto' id='technologies'><Technologies/></section>
    <section ref={projectsRef} className=' max-w-screen h-screen' id='projects'><Projects/></section>
    <section ref={contactRef} className=' max-w-screen h-screen'id='contact'><Contact/></section>
  

    </div>
  )
}

export default App
