import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FiBriefcase, 
  FiUsers, 
  FiAward, 
  FiSearch, 
  FiFilter, 
  FiClock, 
  FiMapPin, 
  FiArrowRight, 
  FiStar, 
  FiChevronDown, 
  FiArrowLeft, 
  FiChevronUp 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useScroll, useTransform } from "framer-motion";
import { useForm } from '@formspree/react';
import DOMPurify from 'dompurify';
import jobsData from '../data/jobs.json';
import { Helmet } from "react-helmet";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

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

// Job categories
const categories = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Data Science",
  "Product",
  "Operations"
];

// Job locations
const locations = [
  "All Locations",
  "Remote",
  "Hybrid",
  "On-site"
];

const Careers = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [jobs, setJobs] = useState(jobsData.jobs);
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    position: ""
  });
  const [errors, setErrors] = useState({});
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);
  const [state, formSubmit] = useForm("movdagwv");
  const [expandedJob, setExpandedJob] = useState(null);
  const jobListingsRef = useRef(null);

  // Animation variants
  const pageTransition = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.5, ease: "easeInOut" }
  };

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resume: e.target.files[0]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationData({
      ...applicationData,
      [name]: value
    });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    const sanitizedName = sanitizeInput(applicationData.fullName);
    if (!sanitizedName) {
      newErrors.fullName = "Full name is required";
    } else if (sanitizedName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters long";
    }
    
    // Email validation
    const sanitizedEmail = sanitizeInput(applicationData.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(sanitizedEmail)) {
      newErrors.email = "Invalid email format";
    }
    
    // Phone validation
    const sanitizedPhone = sanitizeInput(applicationData.phone);
    if (!sanitizedPhone) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!applicationData.resume) {
      newErrors.resume = "Resume is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplicationData({ ...applicationData, position: job.title });
    setIsApplying(true);
    // Scroll to top with smooth animation
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('fullName', applicationData.fullName);
        formData.append('email', applicationData.email);
        formData.append('phone', applicationData.phone);
        formData.append('position', applicationData.position);
        formData.append('coverLetter', applicationData.coverLetter);
        
        // Don't send the resume file to Formspree
        // Instead, just log that it would be processed separately
        console.log('Resume would be processed separately:', applicationData.resume?.name);
        
        // Use the formSubmit function from Formspree with the modified form data
        const response = await fetch('https://formspree.io/f/movdagwv', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Reset form state on success
          setApplicationData({
            fullName: "",
            email: "",
            phone: "",
            resume: null,
            coverLetter: "",
            position: ""
          });
          setErrors({});
          setIsApplying(false);
          
          // Trigger the same state change that Formspree would
          // This will display the success message
          state.succeeded = true;
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        // You might want to set an error state here to show to the user
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = activeCategory === "All" || job.department === activeCategory;
    const matchesLocation = activeLocation === "All Locations" || 
                           job.location.includes(activeLocation);
    return matchesCategory && matchesLocation;
  });

  const scrollToJobListings = () => {
    const openPositionsSection = document.getElementById('open-positions');
    if (openPositionsSection) {
      openPositionsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const navigateToAbout = () => {
    navigate('/about-us');
  };

  if (state.succeeded) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-12 border border-gray-700/50 text-white text-center max-w-md"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6"
          >
            <FiBriefcase className="text-white text-3xl" />
          </motion.div>
          <motion.h2 
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Thank You for Applying!
          </motion.h2>
          <motion.p 
            className="text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            Your application has been successfully submitted. We will review it and get back to you shortly.
          </motion.p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg font-medium relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            onClick={() => {
              setIsApplying(false);
              setSelectedJob(null);
              setApplicationData({
                fullName: "",
                email: "",
                phone: "",
                coverLetter: "",
                position: ""
              });
              setErrors({});
            }}
          >
            <span className="relative z-10 top-4">Back to Careers</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (isApplying) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 overflow-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10 container mx-auto px-4 py-16 pb-32">
          <motion.div 
            className="mb-16 flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <button 
              onClick={() => setIsApplying(false)}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
            >
              <FiArrowRight className="mr-2 rotate-180" /> Back to Careers
            </button>
          </motion.div>
          
          <motion.div
            className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              Apply for {applicationData.position}
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <div>
                  <label className="block text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={applicationData.fullName}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.fullName ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <label className="block text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={applicationData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.phone ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="+91 9876543210"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <label className="block text-gray-300 mb-2">Resume/CV</label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.resume ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  accept=".pdf,.doc,.docx"
                />
                {errors.resume && <p className="text-red-400 text-sm mt-1">{errors.resume}</p>}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
              >
                <label className="block text-gray-300 mb-2">Cover Letter (Optional)</label>
                <textarea
                  name="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700/30 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  rows="5"
                  placeholder="Tell us why you're interested in this position..."
                ></textarea>
              </motion.div>
              
              <motion.button
                type="submit"
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium text-lg shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.4 }}
              >
                Submit Application
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>Careers at MiraIsta - Join Our AI Innovation Team | Job Opportunities</title>
        <meta name="description" content="Join MiraIsta's team of AI innovators. Explore exciting career opportunities in AI development, machine learning, data science, and business transformation. Shape the future of AI solutions." />
        <meta name="keywords" content="AI careers, machine learning jobs, tech careers, MiraIsta jobs, AI development positions, tech innovation careers, data science jobs, AI engineering positions" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.miraista.com/careers" />
        <meta property="og:title" content="Careers at MiraIsta - Join Our AI Innovation Team | Job Opportunities" />
        <meta property="og:description" content="Join our team of AI innovators. Explore exciting career opportunities in AI development, machine learning, and business transformation." />
        <meta property="og:image" content="https://www.miraista.com/careers-og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.miraista.com/careers" />
        <meta property="twitter:title" content="Careers at MiraIsta - Join Our AI Innovation Team | Job Opportunities" />
        <meta property="twitter:description" content="Join our team of AI innovators. Explore exciting career opportunities in AI development, machine learning, and business transformation." />
        <meta property="twitter:image" content="https://www.miraista.com/careers-og-image.jpg" />
        
        {/* Additional SEO tags */}
        <link rel="canonical" href="https://www.miraista.com/careers" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="MiraIsta" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": "AI and Machine Learning Positions at MiraIsta",
            "description": "Join our team of AI innovators. Explore exciting career opportunities in AI development, machine learning, and business transformation.",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "MiraIsta",
              "sameAs": "https://www.miraista.com"
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            },
            "employmentType": ["FULL_TIME", "CONTRACT"],
            "workHours": "40 hours per week",
            "datePosted": new Date().toISOString(),
            "validThrough": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white opacity-70"
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
        
        {/* Hero content */}
        <motion.div 
          className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="block mb-2">Join Our Team</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Shape the Future of AI
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              We're building the next generation of AI solutions. Be part of our journey to transform industries through innovation.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button 
                onClick={scrollToJobListings}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                View Open Positions
              </motion.button>
              <motion.button 
                onClick={navigateToAbout}
                className="px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                Learn About Our Culture
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path
              fill="#111827"
              fillOpacity="1"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main content with gradient background */}
      <div className="relative -mt-1 bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>
        <div ref={jobListingsRef} className="relative z-10 container mx-auto px-4 py-16">
          {/* Header with subtle glow effect */}
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium text-sm tracking-wider mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              JOIN OUR TEAM
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-300 text-transparent bg-clip-text">
              Careers at Miraista
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              Join our innovative team to build cutting-edge AI solutions that are changing the world. We're looking for passionate individuals who are eager to make an impact.
            </p>
          </motion.div>

          {/* Company culture section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Why Join Us</h2>
              <p className="text-gray-400 mt-4">Discover what makes our company a great place to work</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiUsers className="text-blue-400" size={24} />,
                  title: "Collaborative Culture",
                  description: "Work alongside talented professionals in an environment that values teamwork and diverse perspectives."
                },
                {
                  icon: <FiAward className="text-green-400" size={24} />,
                  title: "Growth Opportunities",
                  description: "We invest in our team's development through mentorship, learning resources, and career advancement paths."
                },
                {
                  icon: <FiBriefcase className="text-purple-400" size={24} />,
                  title: "Impactful Work",
                  description: "Build AI solutions that solve real-world problems and make a difference in how people work and live."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center"
                  whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main content - Job listings */}
          <motion.div
            id="open-positions"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Open Positions</h2>
              <p className="text-gray-400 mt-4">Find your dream role and apply today</p>
            </div>
            
            {/* Filter section */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 mb-8">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Filter by Department</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm ${
                          activeCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-64">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Location</label>
                  <div className="relative">
                    <select
                      value={activeLocation}
                      onChange={(e) => setActiveLocation(e.target.value)}
                      className="w-full p-3 rounded-lg bg-gray-700/30 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <FiChevronDown className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job listings */}
            <div className="space-y-5">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                              {job.department}
                            </span>
                            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                              {job.type}
                            </span>
                            <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                              {job.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                          <p className="text-gray-300 leading-relaxed line-clamp-3">{job.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Key Responsibilities</h4>
                            <ul className="list-none text-gray-300 space-y-2">
                              {job.responsibilities.slice(0, 3).map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-400 mr-2">•</span>
                                  <span className="line-clamp-2">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Requirements</h4>
                            <ul className="list-none text-gray-300 space-y-2">
                              {job.requirements.slice(0, 3).map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-blue-400 mr-2">•</span>
                                  <span className="line-clamp-2">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-700/30">
                          <div className="flex items-center space-x-2">

                          </div>
                          <motion.button
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium relative overflow-hidden group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleApply(job)}
                          >
                            <span className="relative z-10">Apply Now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FiSearch className="mx-auto text-4xl mb-4" />
                  <p className="text-lg">No matching positions found. Try adjusting your filters.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-gradient-to-r from-blue-900/50 to-violet-900/50 backdrop-blur-md rounded-2xl p-10 border border-blue-700/30 relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-blue-400 opacity-70"
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
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Don't see the right role?</h2>
                  <p className="text-blue-100 max-w-xl">
                    We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
                  </p>
                </div>
                <div>
                  <motion.button
                    onClick={() => navigate("/contacts")}
                    className="px-8 py-3 bg-white text-blue-900 rounded-lg font-bold flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Us <FiArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Footer spacing */}
          <div className="mt-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Careers;