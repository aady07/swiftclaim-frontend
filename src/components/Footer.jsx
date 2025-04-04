import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdMiscellaneousServices } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navItems = [
    { id: 1, text: "Home", href: "/", icon: <IoHome className="text-xl" /> },
    { id: 2, text: "About Us", href: "/about-us", icon: <BsFillPeopleFill className="text-xl" /> },
    { id: 3, text: "Services", href: "/services", icon: <MdMiscellaneousServices className="text-xl" /> },
    { id: 4, text: "Contacts", href: "/contacts", icon: <BiSupport className="text-xl" /> },
  ];

  const serviceOptions = [
    { id: 1, text: "Claim", href: "/claimupload" },
    { id: 2, text: "Chatbot", href: "/chatbotpage" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="bg-gray-950 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-block mb-4">
              {/* Logo container with #fcfcfc background */}
              <div className="bg-[#fcfcfc] p-2 rounded-lg inline-flex items-center justify-center mb-2">
                <img 
                  src="/images/logo.png" 
                  alt="MiraIsta Logo"
                  className="h-12 w-auto"
                  style={{ minWidth: "60px" }}
                />
              </div>
              <h3 className="text-2xl font-bold text-white">MiraIsta</h3>
            </Link>
            <div className="flex space-x-4">
              {[
                { icon: <FaLinkedin />, href: "#" },
                { icon: <FaTwitter />, href: "#" },
                { icon: <FaGithub />, href: "#" },
                { icon: <FaEnvelope />, href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation Links - Now in vertical layout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link to={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources and Service Options */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a 
                  href="/apidocs" 
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                >
                  API Documentation
                </a>
              </li>
            </ul>
            
            <h4 className="text-lg font-semibold text-white mb-4">Service Options</h4>
            <ul className="space-y-3">
              {serviceOptions.map((option) => (
                <li key={option.id}>
                  <Link to={option.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    >
                      {option.text}
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-800"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MiraIsta. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {["Privacy Policy", "Terms of Service"].map((item, index) => (
              <a key={index} href="#" className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-300">
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;