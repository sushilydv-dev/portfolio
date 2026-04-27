import React from "react";
import { motion } from "framer-motion";
import { FiGithub } from "react-icons/fi";
import { SiJavascript, SiExpress, SiMongodb, SiMysql } from "react-icons/si";
import { RiReactjsLine } from "react-icons/ri";
import { FaNodeJs, FaPython } from "react-icons/fa";
import { BiLogoPostgresql } from "react-icons/bi";
import { HiOutlineViewGrid } from "react-icons/hi";

const techStack = [
  { name: "JavaScript", icon: SiJavascript, color: "text-yellow-400" },
  { name: "React", icon: RiReactjsLine, color: "text-cyan-400" },
  { name: "NodeJS", icon: FaNodeJs, color: "text-green-500" },
  { name: "Express", icon: SiExpress, color: "text-neutral-200" },
  { name: "Git/Github", icon: FiGithub, color: "text-white" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
  { name: "MySQL", icon: SiMysql, color: "text-neutral-100" },
  { name: "Python", icon: FaPython, color: "text-blue-500" },
  { name: "PostgreSQL", icon: BiLogoPostgresql, color: "text-blue-400" },
  { name: "UI/UX Design", icon: HiOutlineViewGrid, color: "text-purple-500" },
];

// Variants for the items
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  },
};

const Technologies = () => {
  return (
    <section className="border-b border-neutral-900 pb-24 flex flex-col justify-center items-center overflow-x-hidden ">
      {/* Header Animation - Repeated when scrolled into view */}
      <motion.h1 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="h-[10rem] md:h-[15rem] flex justify-center items-center text-center text-[2.7rem] md:text-[4rem] font-light tracking-tighter text-amber-50"
      >
        Technologies & Tools
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className=" bg-gradient-to-r from-[#f2a7f0] via-purple-500 to-[#5b9ae2] bg-clip-text text-transparent justify-center items-center text-center text-[1.3rem] md:text-[1.9rem] font-light tracking-tighter  h-[10rem] md:h-[8rem] w-[80%] md:w-[]"
      >
        A blend of design thinking and development tools for creating impactful products
      </motion.p>


      <div className="w-full md:w-7xl mx-auto px-6 md:px-12">
        <motion.div
          // This parent controls the one-by-one "stagger" effect
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1, // This creates the "one by one" delay
              },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 w-full"
        >
          {techStack.map((tech, index) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="
                    relative h-44 rounded-2xl 
                    bg-neutral-900/50 border border-neutral-800 
                    flex flex-col items-center justify-center gap-5
                    transition-all duration-300
                    hover:border-neutral-600 hover:bg-neutral-800/80 
                    shadow-2xl
                  "
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

                  <motion.div
                    className="transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-12"
                  >
                    <Icon className={`w-14 h-14 ${tech.color}`} />
                  </motion.div>

                  <span className="text-[10px] md:text-xs tracking-[0.2em] text-neutral-500 uppercase font-medium">
                    {tech.name}
                  </span>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-amber-50/20 group-hover:w-1/3 transition-all duration-500" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Technologies;