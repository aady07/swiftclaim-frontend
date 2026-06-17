import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiCheck, FiShield, FiDatabase, FiUsers, FiTrendingUp, FiLayers, FiCode, FiArrowRight } from "react-icons/fi";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

// Animation variants - updated to match Home component
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: 
  {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const Services = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const { scrollYProgress } = useScroll();
  const processRef = useRef(null);
  const navigate = useNavigate();

  // Parallax effect - updated to match Home
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

  const services = {
    individual: [
      {
        icon: <FiShield />,
        title: "Vehicle Damage Assessment AI",
        description: "Automated motor damage assessment with our advanced vehicle damage assessment AI system that analyzes vehicle images instantly",
        features: ["Automated vehicle damage assessment", "Motor damage detection", "99.8% accuracy", "Detailed damage analysis reports"]
      },
      {
        icon: <FiDatabase />,
        title: "Data Analysis",
        description: "Get deep insights from your claim data with advanced analytics",
        features: ["Pattern recognition", "Fraud detection", "Historical analysis", "Custom reporting"]
      },
      {
        icon: <FiUsers />,
        title: "Multi-Language Chatbot AI",
        description: "Customized chatbot AI with multi-language support for seamless customer communication across different languages",
        features: ["Multi-language chatbot capabilities", "Customized chatbot responses", "24/7 intelligent chatbot support", "Personalized chatbot interactions"]
      }
    ],
    business: [
      {
        icon: <FiTrendingUp />,
        title: "Enterprise Solutions",
        description: "Scalable verification systems designed for high-volume business needs",
        features: ["Bulk processing", "API integration", "Custom workflows", "Administrative controls"]
      },
      {
        icon: <FiLayers />,
        title: "Multi-tier Verification",
        description: "Layered verification approach for complex business requirements",
        features: ["Multiple verification levels", "Configurable approval flows", "Audit trails", "Compliance documentation"]
      },
      {
        icon: <FiCode />,
        title: "Integration Services",
        description: "Seamlessly integrate our verification system with your existing infrastructure",
        features: ["API documentation", "SDK support", "Developer resources", "Custom implementation"]
      }
    ]
  };
  const processSteps = [
    {
      title: "Image Submission",
      description: "Upload vehicle photos through our secure portal for instant processing and analysis",
      number: "01"
    },
    {
      title: "AI Processing",
      description: "Advanced algorithms analyze images to detect damage patterns and evaluate severity with precision",
      number: "02"
    },
    {
      title: "Detailed Report",
      description: "Receive comprehensive assessment reports with identified issues, severity ratings, and recommendations",
      number: "03"
    },
    {
      title: "Implementation",
      description: "Apply the verification results to your decision-making process",
      number: "04"
    }
  ];

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
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>LendOS Digital Lending Platform | AI Credit Decisioning & Lending Services | Miraista</title>
        <meta name="description" content="Explore LendOS, Miraista's AI-powered end-to-end digital lending platform for Banks, NBFCs & Fintechs. Plus vehicle damage assessment AI and multi-language chatbot solutions. Credit decisions in under 10 seconds." />
        <meta name="keywords" content="LendOS, digital lending platform, AI lending services, credit decisioning, loan disbursal, NBFC lending software, fintech lending, vehicle damage assessment AI, multi-language chatbot, automated motor damage assessment" />
        <meta property="og:title" content="LendOS Digital Lending Platform | AI-Powered Lending Services | Miraista" />
        <meta property="og:description" content="LendOS enables Banks, NBFCs & Fintechs to onboard customers, underwrite loans, disburse funds, and manage collections. Also explore our vehicle damage assessment AI and chatbot solutions." />
        <meta property="og:image" content="https://d1194rs9ausm91.cloudfront.net/images/lendos/hero2.png" />
        <meta property="og:url" content="https://www.miraista.com/services" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.miraista.com/services" />
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
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center min-h-screen"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6"
            >
              <span className="block mb-2 sm:mb-4">Vehicle Damage Assessment AI</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                & Multi-Language Chatbot
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8 sm:mb-10 text-gray-300 px-4 sm:px-0"
            >
              We offer cutting-edge vehicle damage assessment AI services and customized multi-language chatbot solutions powered by artificial intelligence. Our automated motor damage assessment and intelligent chatbot AI ensure accuracy and reliability for individuals and businesses alike.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contacts")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-base sm:text-lg font-medium"
              >
                Contact Us
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/services")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-slate-500 text-white rounded-lg text-base sm:text-lg font-medium"
              >
                Learn More
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

      {/* LendOS Featured Service */}
      <div className="bg-gradient-to-b from-gray-900 to-black pt-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="relative overflow-hidden rounded-2xl border border-green-500/20 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-green-500/5" />
              <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
                <div>
                  <span className="inline-block text-green-400 uppercase tracking-wider text-sm font-semibold mb-3">Featured Product</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">LendOS</h2>
                  <p className="text-lg text-gray-300 mb-4">
                    AI-Powered End-to-End Digital Lending Platform for Instant Credit Decisioning, Disbursals & Collections
                  </p>
                  <p className="text-gray-400 mb-6">
                    Enable Banks, NBFCs & Fintechs to onboard customers, underwrite applications, generate loan offers, disburse funds, manage collections, and monitor portfolios—all in a single platform.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {["Credit Decisions in Under 10 Seconds", "End-to-End Lending Automation", "Modular & Configurable Platform"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-300">
                        <FiCheck className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/lendos")}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold flex items-center gap-2"
                  >
                    Explore LendOS <FiArrowRight />
                  </motion.button>
                </div>
                <div className="hidden lg:block">
                  <div className="p-1 rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-green-500 shadow-lg shadow-green-500/20">
                    <div className="rounded-2xl bg-gray-900/90 p-2">
                      <img
                        src="https://d1194rs9ausm91.cloudfront.net/images/lendos/hero2.png"
                        alt="LendOS Digital Lending Platform"
                        className="w-full h-auto object-contain rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main content with gradient background */}
      <div className="bg-gradient-to-b from-gray-900 to-black">
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
              className="text-blue-400 uppercase tracking-wider mb-2"
            >
              What We Offer
            </motion.h6>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Vehicle Damage Assessment & Chatbot Services
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 mb-6 max-w-3xl mx-auto"
            >
              Our AI-powered vehicle inspection services deliver precise automated damage assessment. Combined with our multilingual chatbot and customizable AI communication solutions, we provide comprehensive automation for vehicle analysis and seamless customer support across languages.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
            />
          </motion.div>
          
          {/* Service type tabs */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center gap-2 bg-gray-800/50 p-1 rounded-full mb-12 backdrop-blur-sm max-w-md mx-auto"
          >
            {["individual", "business"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  activeTab === tab 
                    ? "bg-slate-700 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab} Services
              </motion.button>
            ))}
          </motion.div>

          {/* Services grid - Updated animation properties */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            key={activeTab}
          >
            {services[activeTab].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full"
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  borderColor: ["#0f766e", "#0e7490", "#0369a1", "#1d4ed8"][index % 4],
                }}
              >
                <div className="p-6 flex-grow">
                  <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-2xl mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <FiCheck className="text-blue-400 flex-shrink-0" />
                        <span className="text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 pt-0">
                  <motion.button
                    className="w-full py-2 rounded-lg bg-slate-700/70 hover:bg-slate-700 transition-colors text-white font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/contacts")}
                  >
                    Learn More
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Process Section - Updated animation properties */}
      <div ref={processRef} className="py-20 bg-gray-900">
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
              How It Works
            </motion.h6>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Vehicle Damage Assessment Process
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-300 mb-6 max-w-3xl mx-auto"
            >
              Our streamlined workflow processes vehicle images efficiently using advanced AI algorithms. The system delivers instant damage detection, severity evaluation, and comprehensive inspection reports with exceptional accuracy.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-700 mx-auto"
            />
          </motion.div>
          
          <div className="relative">
            {/* Process timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-700 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Process steps - Updated animation properties */}
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative flex md:items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className={`md:w-1/2 flex ${
                  index % 2 === 0 ? "md:justify-end md:pr-8" : "md:justify-start md:pl-8"
                } justify-center`}>
                  <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700 max-w-md">
                    <div className="text-3xl font-bold text-slate-500 mb-2">{step.number}</div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                <div className="md:w-1/2 hidden md:flex items-center justify-center">
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 z-10"
                    style={{ borderColor: ["#0f766e", "#0e7490", "#0369a1", "#1d4ed8"][index % 4] }}
                    whileInView={{ 
                      scale: [1, 1.2, 1],
                      borderWidth: ["2px", "4px", "2px"],
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }} // Faster animation
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-slate-700 to-slate-800 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Verification Process?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of satisfied customers who trust our AI-powered verification services for their most critical decisions.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/claimupload")}
                className="px-10 py-4 bg-white text-slate-700 rounded-lg shadow-xl font-bold text-lg"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contacts")}
                className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Services;