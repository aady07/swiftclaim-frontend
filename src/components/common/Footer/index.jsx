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
    { id: 4, text: "Careers", href: "/careers", icon: <BsFillPeopleFill className="text-xl" /> },
    { id: 5, text: "Contacts", href: "/contacts", icon: <BiSupport className="text-xl" /> },
  ];

  const serviceOptions = [
    { id: 1, text: "Claim", href: "/claimupload" },
    { id: 2, text: "Chatbot", href: "/chatbotpage" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <footer className="bg-gray-950 py-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="flex flex-col items-center md:items-start"
          >
            <div className="flex flex-col items-center md:items-start">
              <Link 
                to="/" 
                className="flex items-center justify-center md:justify-start"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}
              >
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  src="/images/logo.png" 
                  alt="logo" 
                  className="h-auto w-auto max-h-[130px] md:max-h-[150px] lg:max-h-[170px] -mt-8 object-contain"
                  style={{ maxWidth: "150px" }}
                />
              </Link>
              <div className="mt-4">
                <ul className="flex space-x-6 list-none">
                  {[
                    { icon: <FaLinkedin />, href: "https://www.linkedin.com/company/miraista", label: "LinkedIn" },
                    { icon: <FaTwitter />, href: "#", label: "Twitter" },
                    { icon: <FaGithub />, href: "#", label: "GitHub" },
                    { icon: <FaEnvelope />, href: "mailto:customersupport@miraista.com", label: "Email" }
                  ].map((social, index) => (
                    <li key={index}>
                      <motion.a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        whileHover={{ scale: 1.2, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={`Visit our ${social.label} page`}
                      >
                        {social.icon}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center md:items-start md:pl-8"
          >
            <h5 className="text-lg font-semibold text-white mb-4 w-full text-center md:text-left">Navigation</h5>
            <ul className="space-y-3 w-full list-none">
              {navItems.map((item) => (
                <li key={item.id} className="w-full">
                  <Link to={item.href} className="block" aria-label={`Navigate to ${item.text}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
                    >
                      {item.icon}
                      <span className="text-sm md:text-base">{item.text}</span>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center md:items-start md:pl-8"
          >
            <h5 className="text-lg font-semibold text-white mb-4 w-full text-center md:text-left">Resources</h5>
            <ul className="space-y-3 w-full list-none">
              <li className="w-full">
                <motion.a 
                  href="/apidocs" 
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="block text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm md:text-base"
                  aria-label="View API Documentation"
                >
                  API Documentation
                </motion.a>
              </li>
            </ul>
          </motion.div>

          {/* Service Options */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center md:items-start md:pl-8"
          >
            <h5 className="text-lg font-semibold text-white mb-4 w-full text-center md:text-left">Service Options</h5>
            <ul className="space-y-3 w-full list-none">
              {serviceOptions.map((option) => (
                <li key={option.id} className="w-full">
                  <Link to={option.href} className="block" aria-label={`Learn more about ${option.text}`}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-sm md:text-base"
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
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} MiraIsta. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <ul className="flex space-x-8 list-none">
              {["Privacy Policy", "Terms of Service"].map((item, index) => (
                <li key={index}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-500 hover:text-blue-400 text-sm transition-colors duration-300"
                    aria-label={`View ${item}`}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;