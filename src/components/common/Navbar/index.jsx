import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom"; // Added useLocation hook
import { motion, AnimatePresence } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
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
    { id: 3, text: "Services", href: "#", icon: <MdMiscellaneousServices className="text-xl" />, isDropdown: true },
    { id: 4, text: "Careers", href: "/careers", icon: <BsFillPeopleFill className="text-xl" /> },
    { id: 5, text: "Contacts", href: "/contacts", icon: <BiSupport className="text-xl" /> },
  ];

  const serviceOptions = [
    { id: 1, text: "Claim", href: "/claimupload" },
    { id: 2, text: "Chatbot", href: "/chatbotpage" }
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
          className={`absolute inset-0 mx-auto w-full ${getWindowWidth() >= 1024 ? 'max-w-[1200px]' : 'max-w-[1100px]'} bg-gray-900/95 backdrop-blur-md rounded-full border border-gray-700/50 shadow-lg h-16`}
          initial={{ opacity: 0, scaleX: 0.9, scaleY: 0.7 }}
          animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)' }}
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

      <div className="relative flex justify-between items-center h-16 max-w-[1200px] mx-auto px-6">
        {/* Logo Container - Adjusted to align left with no extra space */}
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
                className="h-[140px] lg:h-[180px] w-auto object-contain transform translate-y-0.5 lg:translate-y-1"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-end z-10">
          <ul className="flex space-x-3 items-center list-none">
            {navItems.map((item) => (
              <li key={item.id} className="relative" ref={item.isDropdown ? dropdownRef : null}>
                {!item.isDropdown ? (
                  <Link to={item.href}>
                    <motion.div
                      className={`flex items-center gap-1 px-5 py-2 rounded-full cursor-pointer text-base font-semibold
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
                      className={`flex items-center gap-1 px-5 py-2 rounded-full cursor-pointer text-base font-semibold ${
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
                          aria-label={`${item.text} options`}
                        >
                          {/* Dropdown highlight gradient */}
                          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
                          
                          <ul className="list-none">
                            {serviceOptions.map((option) => (
                              <li key={option.id}>
                                <Link to={option.href}>
                                  <motion.div
                                    className={`px-5 py-3 hover:bg-gray-700/70 transition-all duration-150 text-base font-medium border-b border-gray-700/50 last:border-0 relative
                                      ${location.pathname === option.href 
                                        ? "text-blue-400 bg-blue-900/30 border-l-4 border-l-blue-500/70 pl-4" // Active state styling
                                        : "text-gray-200 hover:text-blue-400"}`}
                                    whileHover={{ x: 2 }}
                                    onClick={() => setServicesDropdown(false)}
                                    role="menuitem"
                                  >
                                    {option.text}
                                    {location.pathname === option.href && (
                                      <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                                    )}
                                  </motion.div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu Button and Services dropdown toggle */}
        <div className="lg:hidden flex items-center justify-end space-x-2 h-full z-10">
          <motion.div
            ref={servicesMobileRef}
            className={`flex items-center font-semibold text-base ${isServicePage ? "text-blue-400 font-bold" : "text-blue-400"}`}
            onClick={toggleServicesDropdown}
          >
            Services
            <motion.div
              animate={{ rotate: servicesDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1"
            >
              <FaAngleDown size={16} />
            </motion.div>
          </motion.div>
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleNavbar} 
            className="relative p-2 rounded-full text-gray-200"
            aria-label="Toggle menu"
          >
            {nav ? (
              <AiOutlineClose size={24} className="text-blue-400" />
            ) : (
              <div className="relative">
                <HiMenuAlt4 size={24} className="text-blue-400 relative z-10" />
              </div>
            )}
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu Dropdown */}
        <AnimatePresence>
          {nav && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed top-16 right-0 left-0 bg-gray-900/98 backdrop-blur-md shadow-lg z-40 border-t border-gray-800/50"
            >
              {/* Mobile menu highlight gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
              
              <div className="flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.id}>
                    {!item.isDropdown ? (
                      <Link to={item.href}>
                        <motion.div
                          className={`flex items-center justify-between px-6 py-3 border-b border-gray-800/50 hover:bg-blue-900/10
                            ${isActive(item.href) 
                              ? "text-blue-400 bg-blue-900/20 border-l-4 border-l-blue-500/70 px-5" // Active state for mobile
                              : "text-gray-200 hover:text-blue-400"}`}
                          whileTap={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                          onClick={() => setNav(false)}
                        >
                          <span className="font-semibold text-base">{item.text}</span>
                          <div className={isActive(item.href) ? "text-blue-400" : "text-blue-500"}>{item.icon}</div>
                        </motion.div>
                      </Link>
                    ) : (
                      <>
                        <motion.div
                          className={`flex items-center justify-between px-6 py-3 border-b border-gray-800/50 cursor-pointer hover:bg-blue-900/10
                            ${isServicePage 
                              ? "text-blue-400 bg-blue-900/20 border-l-4 border-l-blue-500/70 px-5" // Active for services
                              : "text-gray-200 hover:text-blue-400"}`}
                          whileTap={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setServicesDropdown(!servicesDropdown);
                          }}
                        >
                          <span className="font-semibold text-base">{item.text}</span>
                          <div className="flex items-center text-blue-500">
                            {item.icon}
                            <motion.div
                              animate={{ rotate: servicesDropdown ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-2"
                            >
                              <FaAngleDown size={16} />
                            </motion.div>
                          </div>
                        </motion.div>

                        <AnimatePresence>
                          {servicesDropdown && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-gray-800/70"
                            >
                              {serviceOptions.map((option) => (
                                <Link to={option.href} key={option.id}>
                                  <motion.div
                                    className={`px-10 py-2 border-b border-gray-800/30 hover:text-blue-400 text-base
                                      ${location.pathname === option.href 
                                        ? "text-blue-400 bg-blue-900/30 border-l-4 border-l-blue-500/70 px-9" // Active state for submenu
                                        : "text-gray-300"}`}
                                    whileTap={{ backgroundColor: "rgba(59, 130, 246, 0.15)" }}
                                    onClick={() => {
                                      setNav(false);
                                      setServicesDropdown(false);
                                    }}
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

        {/* Enhanced Services Dropdown for Mobile (when clicking "Services" text) */}
        <AnimatePresence>
          {servicesDropdown && getWindowWidth() < 1024 && !nav && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden absolute top-16 right-20 w-48 bg-gray-800/95 backdrop-blur-md shadow-lg rounded-lg overflow-hidden z-50 border border-gray-700/50"
            >
              {/* Mobile services dropdown highlight gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
              
              {serviceOptions.map((option) => (
                <Link to={option.href} key={option.id}>
                  <motion.div
                    className={`px-5 py-2 hover:bg-blue-900/10 transition-all duration-150 text-base font-medium border-b border-gray-700/50 last:border-0
                      ${location.pathname === option.href 
                        ? "text-blue-400 bg-blue-900/30 border-l-4 border-l-blue-500/70 pl-4" // Active state
                        : "text-gray-200 hover:text-blue-400"}`}
                    whileHover={{ x: 2 }}
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
    </motion.div>
  );
};

export default Navbar;