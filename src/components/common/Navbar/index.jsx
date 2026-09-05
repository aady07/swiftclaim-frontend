import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom"; // Added useLocation hook
import { motion, AnimatePresence } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { BsFillPeopleFill, BsJournalText } from "react-icons/bs";
import { MdMiscellaneousServices } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi";

const Navbar = () => {
  const location = useLocation(); // Get current location/path
  const [nav, setNav] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const servicesMobileRef = useRef(null);
  const previousScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  const handleNavbar = () => setNav(!nav);
  
  // Check if path is currently active (including subpaths for services)
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    
    // Special case for services dropdown
    if (path === "#") {
      // Check if any service option path is active
      return serviceOptions.some(option => location.pathname === option.href);
    }
    
    return location.pathname.startsWith(path);
  };
  
  // Modified to ensure proper toggle on mobile
  const toggleServicesDropdown = (e) => {
    e.stopPropagation(); // Prevent bubbling
    setServicesDropdown(!servicesDropdown);
  };

  // Function to close dropdown when a service option is clicked
  const handleServiceOptionClick = () => {
    setServicesDropdown(false);
  };

  // Handle scroll effect with debounce to prevent flickering
  useEffect(() => {
    const handleScroll = () => {
      // Clear existing timeout to debounce scroll events
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      const currentScrollY = window.scrollY;
      
      // Prevent immediate state changes that cause flickering
      if (Math.abs(currentScrollY - previousScrollY.current) < 5) {
        return;
      }
      
      // Set timeout for smoother transition
      scrollTimeout.current = setTimeout(() => {
        if (currentScrollY > 50) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
        previousScrollY.current = currentScrollY;
      }, 10);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial check on mount to prevent flash
    if (window.scrollY > 50) {
      setScrolled(true);
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check both desktop and mobile dropdown refs
      if (
        (dropdownRef.current && !dropdownRef.current.contains(event.target)) &&
        (servicesMobileRef.current && !servicesMobileRef.current.contains(event.target))
      ) {
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
  }, [location.pathname]); // Changed from window.location.pathname to use location hook

  const navItems = [
    { id: 1, text: "Home", href: "/", icon: <IoHome className="text-xl" /> },
    { id: 2, text: "About Us", href: "/about-us", icon: <BsFillPeopleFill className="text-xl" /> },
    { id: 3, text: "Products", href: "#", icon: <MdMiscellaneousServices className="text-xl" />, isDropdown: true },
    { id: 6, text: "IT Consulting", href: "/consulting", icon: <MdMiscellaneousServices className="text-xl" /> },
    { id: 4, text: "Blog", href: "/blog", icon: <BsJournalText className="text-xl" /> },
    { id: 5, text: "Careers", href: "/careers", icon: <BsFillPeopleFill className="text-xl" /> },
  ];

  const serviceOptions = [
    { id: 1, text: "LendOS", href: "/lendos" },
    { id: 2, text: "Claim", href: "/claimupload" },
    { id: 3, text: "Chatbot", href: "/chatbotpage" }
  ];

  // Function to get window width safely (for SSR compatibility)
  const getWindowWidth = () => {
    return typeof window !== 'undefined' ? window.innerWidth : 1024;
  };

  // Check if current path is a service page
  const isServicePage = serviceOptions.some(option => location.pathname === option.href);

  return (
    <motion.div 
      className="fixed top-3 z-50 w-full lg:top-3 sm:top-0"
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
    >
      {/* Enhanced Cylindrical highlight container - adjusted to extend only as needed */}
      {(scrolled || getWindowWidth() < 1024) && (
        <motion.div 
          className={`absolute inset-0 mx-auto w-full max-w-[1200px] bg-gray-900/95 backdrop-blur-md rounded-full border border-gray-700/50 shadow-lg h-16`}
          initial={{ opacity: 0, scaleX: 0.9, scaleY: 0.7 }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            transform: getWindowWidth() >= 1024 ? 'translateX(-50px)' : 'none'
          }}
        >
          {/* Enhanced highlighted glow effects */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-900/20 via-blue-400/10 to-blue-900/20"></div>
          
          {/* Outer glow */}
          <div className="absolute -inset-1 rounded-full bg-blue-500/5 blur-md"></div>
          
          {/* Enhanced blue highlight border */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20"></div>
          
          {/* Stronger highlight at the top */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
          
          {/* Additional highlight at the bottom for balance */}
          <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-900/30 to-transparent"></div>
          
          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400/5"
            animate={{ 
              scale: [1, 1.01, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}

      <div className="relative flex justify-between items-center h-16 max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Logo Container */}
        <div className="flex items-center z-10">
          <Link to="/" className="flex items-center" onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.location.href = '/';
          }}>
            <div className="relative">
              <motion.img 
                src="/images/logo.png" 
                alt="logo" 
                className="h-[120px] lg:h-[160px] w-auto object-contain transform translate-y-0.5 lg:translate-y-1"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-start z-10 ml-4">
          <ul className="flex space-x-1 items-center list-none">
            {navItems.map((item) => (
              <li key={item.id} className="relative" ref={item.isDropdown ? dropdownRef : null}>
                {!item.isDropdown ? (
                  <Link to={item.href}>
                    <motion.div
                      className={`flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer text-sm font-semibold whitespace-nowrap
                               ${scrolled 
                                  ? isActive(item.href)
                                    ? "text-blue-400 bg-blue-900/30 border border-blue-500/30 shadow-inner shadow-blue-500/20" // Active state with glow
                                    : "text-gray-100 hover:text-blue-400" 
                                  : isActive(item.href)
                                    ? "text-blue-300 bg-blue-900/20 border border-blue-500/20 shadow-inner shadow-blue-500/10" // Active state less intense
                                    : "text-white hover:text-blue-300"}`}
                      whileHover={{ scale: 1.05 }}
                      aria-label={`Navigate to ${item.text}`}
                    >
                      <span>{item.text}</span>
                    </motion.div>
                  </Link>
                ) : (
                  <div className="relative">
                    <motion.button
                      className={`flex items-center gap-1 px-3 py-2 rounded-full cursor-pointer text-sm font-semibold whitespace-nowrap ${
                                 scrolled
                                    ? servicesDropdown || isServicePage
                                      ? "text-blue-400 bg-blue-900/30 border border-blue-500/30 shadow-inner shadow-blue-500/20" // Active state with glow
                                      : "text-gray-100 hover:text-blue-400"
                                    : servicesDropdown || isServicePage
                                      ? "text-blue-300 bg-blue-900/20 border border-blue-500/20 shadow-inner shadow-blue-500/10" // Active state less intense
                                      : "text-white hover:text-blue-300"
                               }`}
                      onClick={toggleServicesDropdown}
                      whileHover={{ scale: 1.05 }}
                      aria-label={`Toggle ${item.text} dropdown menu`}
                      aria-expanded={servicesDropdown}
                    >
                      <span>{item.text}</span>
                      <motion.div
                        animate={{ rotate: servicesDropdown ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FaAngleDown className="text-sm ml-1" />
                      </motion.div>
                    </motion.button>
                    
                    {/* Enhanced Dropdown Menu */}
                    <AnimatePresence>
                      {servicesDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-md shadow-lg rounded-lg overflow-hidden z-50 border border-gray-700/50"
                          role="menu"
                        >
                          {serviceOptions.map((option) => (
                            <Link
                              key={option.id}
                              to={option.href}
                              className={`block px-4 py-3 text-sm ${
                                isActive(option.href)
                                  ? "text-blue-400 bg-blue-900/30"
                                  : "text-gray-200 hover:text-blue-400 hover:bg-blue-900/20"
                              } transition-colors duration-200`}
                              role="menuitem"
                              onClick={handleServiceOptionClick}
                            >
                              {option.text}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Special Contacts Button */}
        <div className="hidden lg:block z-10">
          <Link to="/contacts">
            <motion.button
              className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                scrolled
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-400/25 hover:shadow-blue-400/40"
              } transition-all duration-300`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden z-10">
          <motion.button
            onClick={handleNavbar}
            className="p-2 text-white hover:text-blue-400 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            {nav ? (
              <AiOutlineClose size={24} />
            ) : (
              <HiMenuAlt4 size={24} />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {nav && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 w-full h-screen bg-gray-900/95 backdrop-blur-md z-40 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-end p-4">
                  <motion.button
                    onClick={handleNavbar}
                    className="p-2 text-white hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close mobile menu"
                  >
                    <AiOutlineClose size={24} />
                  </motion.button>
                </div>
                <nav className="flex-1 px-6 py-4">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.id} ref={item.isDropdown ? servicesMobileRef : null}>
                        {!item.isDropdown ? (
                          <Link
                            to={item.href}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-lg font-semibold ${
                              isActive(item.href)
                                ? "text-blue-400 bg-blue-900/30"
                                : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                            } transition-colors duration-200`}
                          >
                            {item.icon}
                            <span>{item.text}</span>
                          </Link>
                        ) : (
                          <div>
                            <button
                              onClick={toggleServicesDropdown}
                              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-lg font-semibold ${
                                servicesDropdown || isServicePage
                                  ? "text-blue-400 bg-blue-900/30"
                                  : "text-white hover:text-blue-400 hover:bg-blue-900/20"
                              } transition-colors duration-200`}
                            >
                              <div className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.text}</span>
                              </div>
                              <motion.div
                                animate={{ rotate: servicesDropdown ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FaAngleDown />
                              </motion.div>
                            </button>
                            <AnimatePresence>
                              {servicesDropdown && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-2 ml-4 space-y-2"
                                >
                                  {serviceOptions.map((option) => (
                                    <Link
                                      key={option.id}
                                      to={option.href}
                                      className={`block px-4 py-2 rounded-lg text-base ${
                                        isActive(option.href)
                                          ? "text-blue-400 bg-blue-900/30"
                                          : "text-gray-200 hover:text-blue-400 hover:bg-blue-900/20"
                                      } transition-colors duration-200`}
                                      onClick={handleServiceOptionClick}
                                    >
                                      {option.text}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </li>
                    ))}
                    {/* Add Contacts to mobile menu */}
                    <li>
                      <Link
                        to="/contacts"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      >
                        <BiSupport className="text-xl" />
                        <span>Contact Us</span>
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Navbar;