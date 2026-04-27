import React, { useState, useEffect } from 'react';
import { AiOutlineFolder } from 'react-icons/ai';
import { CiHome } from 'react-icons/ci';
import { FaLaptopCode } from 'react-icons/fa6';
import { FaUserAlt } from 'react-icons/fa';
import { IoIosCall } from 'react-icons/io';

const Navbar = ({ externalActive }) => {
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (externalActive && externalActive !== active) {
      setActive(externalActive);
    }
  }, [externalActive, active]);

  return (
    <div className='fixed bottom-[2rem] w-[100%] flex justify-center items-center z-20 '>
      <nav className='h-[3rem] w-[26rem] rounded-[20px] bg-white/10 backdrop-blur-4xl'>
        <ul className='flex gap-3 justify-around items-center p-1.5 social-container w-[100%]'>
         
          <a href='#about'>
            <li
              onClick={() => setActive('about')}
              className={`${
                active === 'about'
                  ? 'bg-gradient-to-tr  from-purple-600 via-slate-500 to-purple-500 rounded-[50%] relative  scale-[1.3] translate-y-[-2rem]'
                  : ''
              } p-2 transition duration-400 h-[2.2rem] w-[2.2rem] rounded-[50%] flex flex-col justify-center items-center`}
            >
              <FaUserAlt color='white' className='size-5 transition transform-all duration-300 hover:scale-[1.1]' />
              {active === 'about' && (
                <span className='text-white text-xs mt-2 absolute top-[2.5rem]'>about</span>
              )}
            </li>
          </a>

         
          <a href='#technologies'>
            <li
              onClick={() => setActive('technologies')}
              className={`${
                active === 'technologies'
                  ? 'bg-gradient-to-tr from-purple-800 via-slate-500 to-purple-500 rounded-[50%] relative  scale-[1.3] translate-y-[-2rem]'
                  : ''
              } p-2 transition duration-400 h-[2.2rem] w-[2.2rem] rounded-[50%] flex flex-col justify-center items-center`}
            >
              <FaLaptopCode color='white' className='size-6 transition transform-all duration-300 hover:scale-[1.1]' />
              {active === 'technologies' && (
                <span className='text-white text-xs mt-2 absolute top-[2.5rem]'>technologies</span>
              )}
            </li>
          </a>

       
          <a href='#home'>
            <li
              onClick={() => setActive('home')}
              className={`${
                active === 'home'
                  ? 'bg-gradient-to-tr from-purple-800 via-slate-500 to-purple-500 rounded-[50%] relative  scale-[1.3] translate-y-[-2rem]'
                  : ''
              } p-2 transition duration-400 h-[2.2rem] w-[2.2rem] rounded-[50%] flex flex-col justify-center items-center`}
            >
              <CiHome color='white' className='size-6 transition transform-all duration-300 hover:scale-[1.1]' />
              {active === 'home' && (
                <span className='text-white text-xs mt-2 absolute top-[2.5rem]'>home</span>
              )}
            </li>
          </a>

          
          <a href='#projects'>
            <li
              onClick={() => setActive('projects')}
              className={`${
                active === 'projects'
                  ? 'bg-gradient-to-tr from-purple-800 via-slate-500 to-purple-500 rounded-[50%] relative  scale-[1.3] translate-y-[-2rem]'
                  : ''
              } p-2 transition duration-400 h-[2.2rem] w-[2.2rem] rounded-[50%] flex flex-col justify-center items-center`}
            >
              <AiOutlineFolder color='white' className='size-6 transition transform-all duration-300 hover:scale-[1.1]' />
              {active === 'projects' && (
                <span className='text-white text-xs mt-2 absolute top-[2.5rem]'>projects</span>
              )}
            </li>
          </a>

        
          <a href='#contact'>
            <li
              onClick={() => setActive('contact')}
              className={`${
                active === 'contact'
                  ? 'bg-gradient-to-tr from-purple-800 via-slate-500 to-purple-500 rounded-[50%] relative  scale-[1.3] translate-y-[-2rem]'
                  : ''
              } p-2 transition duration-400 h-[2.2rem] w-[2.2rem] rounded-[50%] flex flex-col justify-center items-center`}
            >
              <IoIosCall color='white' className='size-6 transition transform-all duration-300 hover:scale-[1.1]' />
              {active === 'contact' && (
                <span className='text-white text-xs mt-2 absolute top-[2.5rem]'>contact</span>
              )}
            </li>
          </a>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
