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
    { id: 1, text: "Home", href: "/" },
    { id: 2, text: "About Us", href: "/about-us" },
    { id: 3, text: "Services", href: "/services" },
    { id: 4, text: "Contacts", href: "/contacts" },
  ];

  const border = `1px solid #1E67C6`;
  const boxShadow = `0px 4px 24px #1E67C6`;

  return (
    <div className="sticky top-0 z-50 bg-nile-light shadow-lg">
      <div className="flex justify-between items-center h-16 max-w-[1200px] mx-auto px-4">
        <Link to="/" className="flex items-center">
          <img src="/images/logo.png" alt="logo" className="h-12" />
        </Link>
        <ul className="hidden lg:flex space-x-4">
          {navItems.map((item) => (
            <Link to={item.href} key={item.id}>
              <motion.li
                className="p-4 rounded-xl cursor-pointer text-nile-400 uppercase hover:bg-nile-100 focus:bg-nile-100"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.text}
              </motion.li>
            </Link>
          ))}
        </ul>
        <div onClick={handleNavbar} className="block lg:hidden">
          {nav ? <AiOutlineClose size={20} color="black" /> : <AiOutlineMenu size={20} color="black" />}
        </div>
      </div>
      <ul
        className={`${
          nav ? "absolute z-40 left-0 top-16 w-full bg-nile-light" : "hidden"
        } lg:hidden`}
      >
        {navItems.map((item) => (
          <Link to={item.href} key={item.id}>
            <li className="p-4 border-b border-b-gray-300 text-nile-400 uppercase hover:bg-nile-100 focus:bg-nile-100">
              {item.text}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Navbar;
