import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoHome } from "react-icons/io5";
import { FaRegStar } from "react-icons/fa6";
import { MdBusinessCenter } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdOutlineAccountBalance } from "react-icons/md";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaNewspaper } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

const Navbar = () => {
  // manage navbar's visibility
  const [nav, setNav] = useState(false);

  // toggle function to handle the navbar's display
  const handleNavbar = () => {
    setNav(!nav);
  };

  // array containing navigation items
  const navItems = [
    { id: 1, text: "Home", href: "/", icon: <IoHome className="text-xl" /> },
    { id: 2, text: "About Us", href: "/about-us", icon: <BsFillPeopleFill className="text-xl" /> },
    { id: 3, text: "Services", href: "/services", icon: <MdMiscellaneousServices className="text-xl" /> },
    { id: 4, text: "Contacts", href: "/contacts", icon: <BiSupport className="text-xl" /> },
  ];

  const border = `1px solid #1E67C6`;
  const boxShadow = `0px 4px 24px #1E67C6`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-[#fcfcfc] shadow-lg" // Changed here
    >
      <div className="flex justify-between items-center h-20 max-w-[1200px] mx-auto px-6">
        <Link to="/" className="flex items-center">
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="/images/logo.png" 
            alt="logo" 
            className="h-14 transition-all duration-300" 
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-6">
          {navItems.map((item) => (
            <Link to={item.href} key={item.id}>
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
      </div>

      {/* Mobile Navigation */}
      <motion.ul
        initial={{ opacity: 0, x: -20 }}
        animate={{ 
          opacity: nav ? 1 : 0,
          x: nav ? 0 : -20,
          display: nav ? "block" : "none"
        }}
        className={`lg:hidden absolute w-full bg-white shadow-xl`}
      >
        {navItems.map((item) => (
          <Link to={item.href} key={item.id}>
            <motion.li 
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 p-4 border-b border-gray-100
                       text-gray-700 hover:bg-blue-50 hover:text-blue-600
                       transition-all duration-300 font-medium"
            >
              {item.icon}
              {item.text}
            </motion.li>
          </Link>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default Navbar;
