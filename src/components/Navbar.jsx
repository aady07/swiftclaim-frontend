import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdMiscellaneousServices } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavbar = () => setNav(!nav);
  const toggleServicesDropdown = () => setServicesDropdown(!servicesDropdown);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setNav(false);
  }, [window.location.pathname]);

  const navItems = [
    { id: 1, text: "Home", href: "/", icon: <IoHome className="text-xl" /> },
    { id: 2, text: "About Us", href: "/about-us", icon: <BsFillPeopleFill className="text-xl" /> },
    { id: 3, text: "Services", href: "#", icon: <MdMiscellaneousServices className="text-xl" />, isDropdown: true },
    { id: 4, text: "Contacts", href: "/contacts", icon: <BiSupport className="text-xl" /> },
  ];

  const serviceOptions = [
    { id: 1, text: "Claim", href: "/claimupload" },
    { id: 2, text: "Chatbot", href: "/chatbotpage" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-[#fcfcfc] shadow-lg"
    >
      <div className="flex justify-between items-center h-20 max-w-[1200px] mx-auto px-6">
        <Link to="/" className="flex items-center">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="/images/logo.png" 
            alt="logo" 
            className="h-16 w-auto transition-all duration-300" 
            style={{ minWidth: "60px" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6 relative">
          {navItems.map((item) => (
            <div key={item.id} className="relative" ref={item.isDropdown ? dropdownRef : null}>
              {!item.isDropdown ? (
                <Link to={item.href}>
                  <motion.li
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer 
                               text-gray-700 hover:text-blue-600 transition-all duration-300
                               font-medium tracking-wide"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    <span className="relative">
                      {item.text}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                                     group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </motion.li>
                </Link>
              ) : (
                <div className="relative">
                  <motion.div
                    className={`group flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer
                             transition-all duration-300 font-medium tracking-wide ${
                               servicesDropdown ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
                             }`}
                    onClick={toggleServicesDropdown}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                    <span className="relative">
                      {item.text}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 
                                     group-hover:w-full transition-all duration-300"></span>
                    </span>
                    <motion.div
                      animate={{ rotate: servicesDropdown ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaAngleDown className="text-sm" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {servicesDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-lg overflow-hidden z-50"
                      >
                        {serviceOptions.map((option) => (
                          <Link to={option.href} key={option.id}>
                            <motion.div
                              className="px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-600 
                                         transition-all duration-200 font-medium border-b border-gray-100 last:border-0"
                              whileHover={{ x: 5 }}
                              onClick={() => setServicesDropdown(false)}
                            >
                              {option.text}
                            </motion.div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <motion.div 
          whileTap={{ scale: 0.9 }}
          onClick={handleNavbar} 
          className="block lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          {nav ? (
            <AiOutlineClose size={24} className="text-gray-700" />
          ) : (
            <AiOutlineMenu size={24} className="text-gray-700" />
          )}
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {nav && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed top-20 right-0 left-0 bottom-0 flex flex-col bg-[#fcfcfc] shadow-xl z-40"
            >
              <div className="flex flex-col py-4 overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.id}>
                    {!item.isDropdown ? (
                      <Link to={item.href}>
                        <motion.div
                          className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 text-gray-700"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setNav(false)}
                        >
                          <div className="text-blue-600">{item.icon}</div>
                          <span className="font-medium">{item.text}</span>
                        </motion.div>
                      </Link>
                    ) : (
                      <>
                        <motion.div
                          className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-gray-50 
                                     text-gray-700 cursor-pointer"
                          whileTap={{ scale: 0.98 }}
                          onClick={toggleServicesDropdown}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-blue-600">{item.icon}</div>
                            <span className="font-medium">{item.text}</span>
                          </div>
                          <motion.div
                            animate={{ rotate: servicesDropdown ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaAngleDown />
                          </motion.div>
                        </motion.div>

                        <AnimatePresence>
                          {servicesDropdown && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-gray-50"
                            >
                              {serviceOptions.map((option) => (
                                <Link to={option.href} key={option.id}>
                                  <motion.div
                                    className="px-12 py-3 hover:bg-gray-100 text-gray-600"
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setNav(false)}
                                  >
                                    {option.text}
                                  </motion.div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;