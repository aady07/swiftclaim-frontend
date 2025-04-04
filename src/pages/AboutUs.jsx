import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  
  const teamRef = useRef(null);
  const navigate = useNavigate();

  const teamMembers = [
    { 
      name: "Rachit", 
      role: "Co-Founder", 
      image: "https://i.imgur.com/wc1ZutY.png", 
      bio: "Expert in AI and machine learning with deep specialization in financial platform technologies. Develops advanced AI solutions that transform complex financial data into actionable insights." 
    },
    { 
      name: "Bharat Parmar", 
      role: "Co-Founder", 
      image: "https://i.imgur.com/OehHTK9.jpeg", 
      bio: "Seasoned business expert with comprehensive understanding of strategic business operations, technology integration, and organizational growth strategies." 
    },
    { 
      name: "Adarsh", 
      role: "Co-Founder", 
      image: "https://i.imgur.com/e9LoxyO.png", 
      bio: "Technical expert with full-stack experience specializing in creating and deploying large-scale financial applications with robust architectural design." 
    },
  ];

  const values = [
    { 
      title: "Pioneering Innovation", 
      description: "We constantly push the boundaries of what's possible with AI.", 
      icon: "https://i.imgur.com/Ki32uaU.jpeg " 
    },
    { 
      title: "Ethical Intelligence", 
      description: "Our AI solutions are built with integrity and responsibility at their core.", 
      icon: "https://cdn-icons-png.flaticon.com/512/4727/4727493.png" 
    },
    { 
      title: "Collaborative Excellence", 
      description: "We believe great ideas emerge from diverse teams working in harmony.", 
      icon: "https://cdn-icons-png.flaticon.com/512/1006/1006555.png" 
    },
    { 
      title: "Relentless Pursuit", 
      description: "We're never satisfied with 'good enough' – we strive for excellence in everything.", 
      icon: "https://cdn-icons-png.flaticon.com/512/6295/6295417.png" 
    },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Parallax effect
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  
  // Counter animation
  const CountUp = ({ end, duration = 2000, label }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            let start = 0;
            const increment = end / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              setCount(Math.floor(Math.min(start, end)));
              if (start >= end) clearInterval(timer);
            }, 16);
            
            return () => clearInterval(timer);
          }
        },
        { threshold: 0.1 }
      );
      
      if (countRef.current) {
        observer.observe(countRef.current);
      }
      
      return () => {
        if (countRef.current) {
          observer.unobserve(countRef.current);
        }
      };
    }, [end, duration]);
    
    return (
      <div ref={countRef} className="text-center">
        <h3 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-600">
          {count}+
        </h3>
        <p className="text-gray-400 mt-2 text-lg">{label}</p>
      </div>
    );
  };
  
  return (
    <motion.section 
      initial="hidden" 
      animate="visible" 
      className="relative bg-gray-950 text-gray-200 overflow-hidden"
    >
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gray-500 opacity-70"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                opacity: [0.7, 0.1, 0.7],
                scale: [1, Math.random() * 1.5, 1]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <motion.div 
          className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.h1
            variants={fadeInUp}
            className="max-w-4xl text-center text-5xl font-bold text-white sm:text-7xl mb-6"
          >
            <span className="block">Welcome to</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              MiraIsta
            </span>
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            className="my-6 max-w-2xl text-center text-xl md:text-2xl text-gray-300"
          >
            We are innovators in AI solutions, dedicated to transforming businesses with cutting-edge technology.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mt-8 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/services")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-lg text-lg font-medium"
            >
              Our Services
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contacts")}
              className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white rounded-lg text-lg font-medium"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#111827"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 5L12 19M12 19L19 12M12 19L5 12" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
      
      {/* Our Story Section - ENHANCED TEXT SECTION */}
      {/* Our Story Section - SIMPLIFIED TEXT SECTION */}
<div className="py-20 bg-gradient-to-b from-gray-900 to-black">
  <div className="container mx-auto px-4">
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="text-center mb-16"
    >
      <motion.h6 
        variants={fadeInUp}
        className="text-gray-400 uppercase tracking-wider mb-2"
      >
        Our Mission
      </motion.h6>
      <motion.h2 
        variants={fadeInUp}
        className="text-4xl md:text-5xl font-bold mb-4 text-white"
      >
        Transforming Businesses Through AI
      </motion.h2>
      <motion.div 
        variants={fadeInUp}
        className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-700 mx-auto"
      />
    </motion.div>
    
    {/* Simplified Text Section */}
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-lg"
      >
        <div className="w-20 h-1 bg-blue-500 mb-6"></div>
        <p className="text-lg text-gray-300 mb-6">
          At MiraIsta, we are dedicated to revolutionizing businesses through intelligent AI solutions. Our core focus is on developing transformative technologies that solve complex challenges across industries. We believe in the power of artificial intelligence to unlock unprecedented efficiency, drive innovation, and create meaningful impact.
        </p>
        <p className="text-lg text-gray-300">
          Our approach combines cutting-edge research, strategic innovation, and a deep understanding of technological potential. We don't just develop AI solutions; we craft intelligent systems that adapt, learn, and drive tangible business value. From financial platforms to enterprise solutions, we're committed to pushing the boundaries of what's possible with artificial intelligence.
        </p>
      </motion.div>
    </div>
  </div>
</div>

      {/* Team Section - IMPROVED STYLING */}
      {/* Team Section - IMPROVED STYLING WITH BLUR EFFECT */}
{/* Team Section - Updated with Classic Futuristic Design */}
{/* Team Section - Updated with names at bottom middle and improved colors */}
<div ref={teamRef} className="py-20 bg-gradient-to-b from-gray-900 to-black">
  <div className="container mx-auto px-4">
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <motion.h6 
        variants={fadeInUp}
        className="text-gray-400 uppercase tracking-wider mb-2"
      >
        The Minds Behind Our Success
      </motion.h6>
      <motion.h2 
        variants={fadeInUp}
        className="text-4xl md:text-5xl font-bold mb-4 text-white"
      >
        Meet Our Team
      </motion.h2>
      <motion.div 
        variants={fadeInUp}
        className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
      />
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="group relative rounded-xl overflow-hidden shadow-2xl h-96 border border-gray-800 bg-gray-900/20 backdrop-blur-sm"
        >
          {/* Image container with subtle transition */}
          <div className="h-full w-full overflow-hidden absolute inset-0">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-center transition-all duration-700 filter group-hover:brightness-20 group-hover:blur-sm group-hover:scale-105"
            />
            {/* Overlay with gradient for better text visibility at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 
                         group-hover:bg-gray-900/90 overflow-hidden">
              {/* Futuristic grid lines that become more visible on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-700">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute left-0 right-0 h-px bg-blue-500/30" 
                       style={{ top: `${i * 10}%` }}></div>
                ))}
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 w-px bg-blue-500/30" 
                       style={{ left: `${i * 10}%` }}></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Name and role at bottom middle */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end items-center text-center pb-6 px-4 z-10 transition-all duration-500 transform translate-y-0 group-hover:opacity-0 group-hover:translate-y-10">
            {/* Glowing accent line above name */}
            <div className="w-16 h-0.5 bg-blue-400/80 mb-3"></div>
            
            {/* Name with gradient text for better visibility */}
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              {member.name}
            </h3>
            
            {/* Role with better visibility */}
            <p className="text-lg text-blue-300 font-medium">
              {member.role}
            </p>
          </div>
          
          {/* Content that appears on hover (centered) */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="transform transition-all duration-500 text-center max-w-xs">
              {/* Holographic accent line */}
              <div className="w-16 h-0.5 bg-blue-400 mb-4 mx-auto"></div>
              
              {/* Name with attractive gradient */}
              <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                {member.name}
              </h3>
              
              {/* Role with improved visibility */}
              <p className="text-lg text-blue-300 font-medium mb-4">
                {member.role}
              </p>
              
              {/* Bio */}
              <p className="text-gray-200 text-lg">
                {member.bio}
              </p>
              
              {/* Futuristic indicator */}
              <div className="mt-6 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mr-2"></div>
              </div>
            </div>
          </div>
          
          {/* Corner accents visible only on hover */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-blue-500/0 group-hover:border-blue-500/80 transition-all duration-700"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-blue-500/0 group-hover:border-blue-500/80 transition-all duration-700"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-blue-500/0 group-hover:border-blue-500/80 transition-all duration-700"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-blue-500/0 group-hover:border-blue-500/80 transition-all duration-700"></div>
        </motion.div>
      ))}
    </div>
  </div>
</div>

      {/* Values Section - UPDATED WITH NEW ICONS */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h6 
              variants={fadeInUp}
              className="text-gray-400 uppercase tracking-wider mb-2"
            >
              What Drives Us
            </motion.h6>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Our Core Values
            </motion.h2>
            <motion.div 
              variants={fadeInUp}
              className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-700 mx-auto"
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden p-8 shadow-lg border border-gray-700 flex flex-col items-center"
              >
                <div className="h-16 w-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 border border-gray-700">
                  <img
                    src={value.icon}
                    alt={value.title}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 text-center">{value.title}</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-gray-500 to-gray-700 mb-3"></div>
                <p className="text-gray-300 text-center">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gray-600 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                borderRadius: '50%',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Let's discuss how our AI solutions can help you achieve unprecedented growth and efficiency.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/contacts")}
              className="px-10 py-4 bg-white text-gray-900 rounded-lg shadow-xl font-bold text-lg"
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;