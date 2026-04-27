import React, { useEffect } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Socials from "./Socials";

import Lottie from "lottie-react";
import developerAnimation from "../assets/homeanimation.json";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowRoundDown } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import { SlArrowDown } from "react-icons/sl";
const Home = () => {
  const numberdata = [
    { label: "Projects", value: 6 },
    { label: "Technologies", value: 10 },
  ];
  return (
    <section name="home " className=" h-screen w-full ">
      <Socials />
      <div className="w-full mx-auto flex flex-col sm:flex-row items-center justify-center h-full px-4 ">
        <div
          className="flex flex-col justify-center items-center w-full sm:w-1/2 
                        h-1/2 sm:h-full  gap-6 "
        >
          <motion.h1
          className="pb-6 text-5xl sm:text-6xl font-thin tracking-tight lg:mt-16 lg:text-8xl text-amber-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Sushil Yadav
          </motion.h1>

          <motion.span
            className="bg-gradient-to-r from-[#f2a7f0] via-purple-500 to-[#5b9ae2] bg-clip-text text-4xl tracking-tight text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Full Stack Developer
          </motion.span>

          <motion.a
            href="/sushil-resume.pdf"
            class="rounded-[10px] relative group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-[#5b0f7c]   border-[#211530] text-white overflow-hidden w-[10rem] h-[2.8rem] flex gap-3 "
            download="Sushil-resume"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-[10rem] group-hover:h-32 opacity-10"></span>
            <span class="relative ">Download CV </span>
            <GoDownload />
          </motion.a>
          <motion.div
            className="flex items-center gap-12 mt-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {numberdata.map((item, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-thin tracking-tighter text-white">
                    <CountUp end={item.value} duration={2.5} />+
                  </span>
                  <span className="text-lg font-medium tracking-wide text-zinc-400 uppercase">
                    {item.label}
                  </span>
                </div>

              
                {index !== numberdata.length - 1 && (
                  <div className="h-12 w-[1px] bg-zinc-700 mx-4" />
                )}
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="w-full sm:w-1/2 h-1/2 sm:h-full rounded-lg  mt-4 sm:mt-0 flex justify-center items-center relative bottom-15 sm:bottom-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Lottie
            animationData={developerAnimation}
            loop={true}
            autoplay={true}
            className="w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] md:w-[35rem] md:h-[35rem] hover:scale-[1.06] transition-transform duration-600 hover:drop-shadow-[0_0_20px_rgba(109,80,198,0.5)] "
          />
        </motion.div>
      </div>
      <motion.div
       
        animate={{ y: [0, 18, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[9rem] left-1/2 -translate-x-1/2 flex flex-col items-center cursor-default z-10"
      >
      
        <span className="text-[#ebeff4] text-lg  mb-1 font-thin">
          Scroll to explore
        </span>

  
        <SlArrowDown className="text-[#e1d8ea] text-4xl" />
      </motion.div>
    </section>
  );
};

export default Home;
