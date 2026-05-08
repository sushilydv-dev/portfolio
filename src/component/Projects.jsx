import React from "react";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink, FiEye } from "react-icons/fi";

import passer from "../assets/passer.png";
import portfolio from "../assets/portfolio.png";
import neurovault from "../assets/neurovault.png";
import currency from "../assets/currency.png";
import airglide from "../assets/airglide.png";
const projectData = [
  {
    title: "NeuroVault",
    image: neurovault,
    description:
      "AI document intelligence platform focused on source transparency and cited data analysis.",
    site:"https://neurovault-xi.vercel.app",
    git: "https://github.com/sushilydv-dev/neurovault",
    category: "Next.js / LLM",
  },
  {
    title: "Airglide",
    image: airglide,
    description:
      "A sophisticated gesture-controlled interface for presentations using Computer Vision and AI.",
       site:"#",
    git: "https://github.com/sushilydv-dev/Airglide",
    category: "Python / AI",
  },
  {
    title: "Passer",
    image: passer,
    description:
      "High-security password management solution featuring AES-256 encryption and cloud-sync.",
       site:"#",
    git: "https://github.com/sushilydv-dev/Passer",
    category: "React JS",
  },
  {
    title: "Portfolio",
    image: portfolio,
    description:
      "Modern, high-performance portfolio crafted with React and motion-heavy framer animations.",
       site:"https://sushildev.in",
    git: "https://github.com/sushilydv-dev/portfolio",
    category: "React JS",
  },

  {
    title: "Currency Converter",
    image: currency,
    description:
      "Real-time currency conversion tool with a clean, intuitive interface.",
       site:"#",
    git: "https://github.com/sushilydv-dev/currency-converter",
    category: "React JS",
  },
];

const Projects = () => {
  return (
    // FIXED: Changed flex to block to allow natural document flow
    <section
      id="projects"
      className="py-20 min-h-screen w-full flex flex-col items-center"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[20%] w-[40%] h-[40%] bg-blue-600/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[20%] w-[40%] h-[40%] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 w-full"
        >
          {/* REMOVED FIXED HEIGHTS: Using padding for spacing instead */}
          <h1 className="h-[18rem] md:h-[25rem] flex justify-center items-center pt-10 pb-6 font-light tracking-tight text-white text-[2.7rem] md:text-[4rem] leading-tight">
            My Creative Portfolio
          </h1>
        </motion.div>

        {/* 4-Column Responsive Grid - Added h-full and gap adjustments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
          {projectData.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col border border-white/5 rounded-[2rem] p-4 transition-all duration-500 hover:bg-white/[0.06] hover:border-white/20 w-full max-w-[320px] bg-zinc-900/10"
            >
              {/* Square Image Area */}
              <div className="relative w-full aspect-square rounded-[1.4rem] overflow-hidden bg-zinc-900 mb-5 border border-white/5">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />

                {/* Hover Icons */}
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.a
                    href={project.site}
                    target="_self"
                    whileHover={{ scale: 1.1 }}
                    className="p-3 bg-white rounded-full text-black"
                  >
                    <FiEye size={20} />
                  </motion.a>
                  <motion.a
                    href={project.git}
                    target="_blank"
                    whileHover={{ scale: 1.1 }}
                    className="p-3 bg-zinc-800 border border-white/20 rounded-full text-white"
                  >
                    <FiGithub size={20} />
                  </motion.a>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#0a0a0a] border border-white/10 px-4 py-1 rounded-full z-20">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-bold">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Text Area */}
              <div className="flex flex-col flex-grow text-center mt-6 px-2 w-full">
                <h2 className="text-lg font-semibold text-white mb-2 tracking-tight group-hover:text-[#f3edf6] transition-colors">
                  {project.title}
                </h2>
                <p className="text-xs text-zinc-500 leading-relaxed min-h-[50px] line-clamp-3 mb-6">
                  {project.description}
                </p>

                <div className="mt-auto pb-2">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-200 bg-white/[0.03] border border-white/10"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Know More <span>→</span>
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
