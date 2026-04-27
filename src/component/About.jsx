import React from "react";
import Lottie from "lottie-react";
import developerAnimation from "../assets/aboutlottie.json";
import { motion } from "framer-motion";
import avatar from "../assets/avatar.png";
import about1 from "../assets/about1.jpg";
import about2 from "../assets/about2.png";
import about3 from "../assets/about3.png";
import about4 from "../assets/about4.jpg";

const About = () => {
  const cards = [
    {
      img: about4,
      title: "Fullstack Developer",
      desc: "MERN stack, well versed with React, Node.js, MongoDB, RESTful APIs, GraphQL etc..",
    },
    {
      img: about3,
      title: "Tech Enthusiast",
      desc: "Love new technologies and like to explore the field of Machine Learning, AI and Image Processing.",
    },
    {
      img: about2,
      title: "Problem Solver",
      desc: "Equipped with good analytical and problem solving skills. Creative thinker and love to take up any challenges.",
    },
    {
      img: about1,
      title: "Visionary",
      desc: "A visionary with commendable leadership qualities. Aiming to reach new heights and grow consistently.",
    },
  ];

  const aboutDescription1 = `I’m Sushil Yadav, a passionate Full Stack Developer who specializes in creating seamless and engaging user experiences on the frontend with React, while also building a solid foundation in backend technologies like Node.js. What defines me is a problem-solving mindset—I enjoy breaking down complex challenges and building practical solutions that make an impact. Coding, for me, is more than writing logic; it’s the energy and thrill that keeps me motivated to explore, innovate, and grow.`;

  // Animation variants to keep the code clean
  const scrollVariant = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    /* Added overflow-x-hidden to prevent animation-related horizontal scroll */
    <div className="w-full h-full font-light overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center px-10 sm:px-[3rem] text-center">
        <motion.h1
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.3 }}
          variants={scrollVariant}
          className="text-[2rem] sm:text-[3rem] text-amber-50"
        >
          Users Skip The Code
        </motion.h1>

        <motion.h1
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            ...scrollVariant,
            onscreen: {
              ...scrollVariant.onscreen,
              transition: { ...scrollVariant.onscreen.transition, delay: 0.2 },
            },
          }}
          className="text-[2rem] sm:text-[3rem] bg-gradient-to-r from-[#f2a7f0] via-purple-500 to-[#5b9ae2] bg-clip-text text-transparent"
        >
          They Feel The Experience
        </motion.h1>
      </div>

      {/* ABOUT SECTION */}
      <div className="my-[5rem] w-full flex flex-col items-center mb-[5rem]">
        <div className="flex sm:flex-row flex-col-reverse justify-center items-center w-full min-h-[400px] sm:min-h-[350px] gap-6 px-6 sm:px-[4rem] py-6 sm:py-8">
          {/* LEFT */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.2 }}
            variants={scrollVariant}
            className="text-amber-50 flex flex-col items-center sm:items-start gap-4 max-w-[95%] sm:max-w-[65%]"
          >
            <h1 className="text-[1.5rem] w-full text-center sm:text-left">
              About Me
            </h1>

            {/* Fixed width to avoid pushing layout horizontally on mobile */}
            <p className="w-[70vw] sm:w-auto text-[1rem] leading-relaxed text-justify sm:p-[6rem]">
              {aboutDescription1}
            </p>

            <div className="hidden sm:flex w-full justify-center sm:justify-start">
              <button className="bg-transparent hover:bg-[#a261ed] text-[#a261ed] hover:text-white border border-[#a261ed] hover:border-transparent px-[2rem] py-[0.5rem] rounded-[0.7rem] h-[3.4rem] w-[6rem]">
                <a href="public\sushil resume.pdf"download="Sushil CV"> Resume</a>
               
              </button>
            </div>
          </motion.div>

          {/* RIGHT LOTTIE */}
          <motion.div
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.2 }}
            variants={scrollVariant}
            className="flex justify-center items-center "
          >
            <img
              src={avatar}
              alt="Sushil Yadav Avatar"
              className=" w-[18rem] sm:w-[14.5rem] object-contain hover:scale-105 transition duration-500 rounded-[20%]"
            />
          </motion.div>
        </div>
      </div>

      {/* CARDS */}

      <div className="w-full h-auto flex flex-wrap justify-center gap-10 sm:gap-16 mt-10 mb-[4rem] sm:mb-0 px-6 items-around relative">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: false, amount: 0.1 }}
            variants={{
              offscreen: { opacity: 0, y: 50 },
              onscreen: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: index * 0.1 },
              },
            }}
            className="flex flex-col items-center text-center max-w-[200px] transition-transform duration-300 hover:-translate-y-4 gap-3 items-around"
          >
            <div className="w-full h-[180px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="mt-4 text-lg text-amber-50 text-left w-full">
              {card.title}
            </h3>

            <p className="mt-2 text-[0.85rem] text-amber-50 text-left leading-relaxed">
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
