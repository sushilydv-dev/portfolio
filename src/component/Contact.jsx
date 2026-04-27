import React, { useRef } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { ToastContainer, toast, Bounce } from "react-toastify"; // 1. Import Toastify
import "react-toastify/dist/ReactToastify.css";
export const Contact = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    const SERVICE_ID = "service_0kvnqua";
    const TEMPLATE_ID = "template_tfnk7ab";
    const PUBLIC_KEY = "SNiJdSyuJHYyr9tAi";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      () => {
        toast("Message sent successfully", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        e.target.reset(); 
      },
      (error) => {
        toast.error(
          "Failed to send message. Please try again or email me directly",
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          },
        );

        console.error("EmailJS Error:", error.text);
      },
    );
  };

  const scrollVariant = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const contactDetails = [
    { icon: <FiMail />, label: "Email", value: "sushilyadav292001@gmail.com" },
    { icon: <FiPhone />, label: "Phone", value: "+91 6283106923" },
    { icon: <FiMapPin />, label: "Location", value: "Chandigarh, India" },
  ];

  return (
    <div className="w-full min-h-screen font-light py-[5rem] relative flex-col justify-start gap-[4rem] items-center top-[110rem] md:top-[20rem] flex">
      <ToastContainer stacked limit={3} />
      <div className="flex flex-col items-center justify-center px-10 md:px-[3rem] text-center mb-[4rem]">
        <motion.h1
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
          variants={scrollVariant}
          className="flex justify-center items-center text-[2.5rem] md:text-[3.5rem] text-amber-50 h-[3rem] md:h-[10rem]"
        >
          Let’s connect
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
          className="text-[1rem] md:text-[1.5rem] bg-gradient-to-r from-[#f2a7f0] via-purple-500 to-[#5b9ae2] bg-clip-text text-transparent font-thin"
        >
          I'm always open to discussing new projects, creative ideas or
          opportunities to be part of your visions.
        </motion.h1>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-[4rem] flex flex-col-reverse md:flex-row gap-12 items-start">
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.2 }}
          variants={scrollVariant}
          className="w-full md:w-[40%] space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-[1.8rem] text-amber-50">Contact Information</h2>
          </div>

          <div className="space-y-6 border border-white/10 p-6 rounded-xl flex flex-col gap-[2rem]">
            {contactDetails.map((item, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-12 h-12 flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-amber-50/50 uppercase tracking-widest">
                    {item.label}
                  </p>
                  <p className="text-amber-50 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            ...scrollVariant,
            onscreen: {
              ...scrollVariant.onscreen,
              transition: { ...scrollVariant.onscreen.transition, delay: 0.2 },
            },
          }}
          className="w-full md:w-[60%] -8 md:p-10 rounded-[2rem] shadow-2xl"
        >
          <form
            ref={form}
            onSubmit={sendEmail}
            className="space-y-7 w-full flex flex-col gap-[1.5rem]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] uppercase tracking-[0.2em] text-white ml-1 font-semibold">
                  Your Name
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-[#434446] border border-white/10 px-4 py-4 text-amber-50 outline-none focus:border-[#ce88ef] focus:bg-white/[0.07] transition-all duration-300 placeholder:text-white/20 h-[3rem]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.7rem] uppercase tracking-[0.2em] text-white ml-1 font-semibold">
                  Email Address
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-[#434446] border border-white/10 px-4 py-4 text-amber-50 outline-none focus:border-[#ce88ef] focus:bg-white/[0.07] transition-all duration-300 placeholder:text-white/20 h-[3rem]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] uppercase tracking-[0.2em] text-white ml-1 font-semibold">
                Subject
              </label>
              <input
                required
                name="subject"
                type="text"
                placeholder="How can I help you?"
                className="w-full bg-[#434446] border border-white/10 px-4 py-4 text-amber-50 outline-none focus:border-[#ce88ef] focus:bg-white/[0.07] transition-all duration-300 placeholder:text-white/20 h-[3rem]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] uppercase tracking-[0.2em] text-white ml-1 font-semibold">
                Message
              </label>
              <textarea
                required
                name="message"
                rows="5"
                placeholder="Tell me about your project..."
                className="w-full bg-[#434446] border border-white/10 px-4 py-4 text-amber-50 outline-none focus:border-[#ce88ef] focus:bg-white/[0.07] transition-all duration-300 placeholder:text-white/20 resize-none"
              ></textarea>
            </div>

            <div className="w-full flex justify-center md:justify-start">
              <button
                type="submit"
                className="bg-transparent hover:bg-[#a261ed] text-[#a261ed] hover:text-white border border-[#a261ed] hover:border-transparent px-[2rem] py-[0.5rem] rounded-[0.7rem] h-[3.4rem] w-full md:w-[16rem] flex justify-center items-center transition-all duration-300 font-medium uppercase tracking-widest text-sm"
              >
                send message
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
