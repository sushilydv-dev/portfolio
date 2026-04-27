import React from "react";

import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa6";
import { RiGithubFill } from "react-icons/ri";
import { CgMail } from "react-icons/cg";
import "../component/css/socials.css";
const Socials = () => {
  return (
    <>
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-[999] rounded-md shadow-lg">
        <ul className="flex flex-col gap-3 justify-center items-center w-10 p-1.5 social-container ">
          <li className="p-1.5">
            <a
              href="https://www.linkedin.com/in/sushil-yadav-125937279"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedinIn color="white" className="size-6 social " />
            </a>
          </li>

          <li className="p-1.5">
            <a
              href="https://github.com/sushilydv-dev"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              <RiGithubFill color="white" className="size-6 social" />
            </a>
          </li>

          <li className="p-1.5">
            <a href="mailto:sushilydv.dev@gmail.com">
              <CgMail color="white" className="size-6 social" />
            </a>
          </li>

          <li className="p-1.5 ">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <IoLogoInstagram color="white" className="size-6 social" />
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Socials;
