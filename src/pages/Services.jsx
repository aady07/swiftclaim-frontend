import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiCheck, FiShield, FiDatabase, FiUsers, FiTrendingUp, FiLayers, FiCode } from "react-icons/fi";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useNavigate } from "react-router-dom";


// Animation variants - updated to match AboutUs component
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }  // Removed duration to match AboutUs
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

const Services = () => {
  const [activeTab, setActiveTab] = useState("individual");
  const { scrollYProgress } = useScroll();
  const processRef = useRef(null);
  
  const navigate = useNavigate();

  // Parallax effect
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  const services = {
    individual: [
      {
        icon: <FiShield />,
        title: "Claim Verification",
        description: "Verify the authenticity of claims with our AI-powered verification system",
        features: ["Instant verification", "99.8% accuracy", "Secure processing", "Detailed reports"]
      },
      {
        icon: <FiDatabase />,
        title: "Data Analysis",
        description: "Get deep insights from your claim data with advanced analytics",
        features: ["Pattern recognition", "Fraud detection", "Historical analysis", "Custom reporting"]
      },
      {
        icon: <FiUsers />,
        title: "User Profiling",
        description: "Create comprehensive profiles for better understanding of claim patterns",
        features: ["Behavioral analysis", "Risk assessment", "User categorization", "Continuous learning"]
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
      title: "Data Submission",
      description: "Upload your documents for verification through our secure portal",
      number: "01"
    },
    {
      title: "AI Processing",
      description: "Our advanced AI analyzes the submitted information for authenticity",
      number: "02"
    },
    {
      title: "Verification Report",
      description: "Receive a detailed verification report with actionable insights",
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
    <motion.section 
      initial="hidden" 
      animate="visible" 
      className="relative min-h-screen overflow-hidden bg-gray-950 text-gray-200"
    >
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        
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
          <motion.span 
            variants={fadeInUp}
            className="mb-1.5 inline-block rounded-full bg-gray-600/70 backdrop-blur-md px-4 py-1.5 text-sm font-medium tracking-wider"
          >
            OUR SERVICES
          </motion.span>
          
          <motion.h1
            variants={fadeInUp}
            className="max-w-4xl text-center text-5xl font-bold sm:text-7xl mb-6"
          >
            <span className="bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI-Powered Verification Solutions
            </span>
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            className="my-6 max-w-2xl text-center text-xl md:text-2xl text-gray-300"
          >
            We offer cutting-edge verification services powered by artificial intelligence to ensure accuracy and reliability for individuals and businesses alike.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-4 mt-8 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg text-lg font-medium"
            >
              Contact Us
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-gray-600 text-white rounded-lg text-lg font-medium"
            >
              Learn More
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

      {/* Service Type Section */}
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
              What We Offer
            </motion.h6>
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Our Verification Services
            </motion.h2>
            <motion.div 
              variants={fadeInUp}
              className="w-24 h-1 bg-gradient-to-r from-gray-500 to-gray-700 mx-auto"
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
            viewport={{ once: true }}
            key={activeTab}
          >
            {services[activeTab].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full"
                transition={{ duration: 0.5, delay: index * 0.1 }} // Faster animation like AboutUs
                whileHover={{ 
                  y: -10, 
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
              Our Verification Process
            </motion.h2>
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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }} // Faster animation like AboutUs
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
      
      {/* Stats Section */}
      <motion.div 
        className="py-20 bg-gradient-to-b from-black to-gray-900"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <CountUp end={98} label="Accuracy Rate (%)" />
            <CountUp end={5000} label="Verifications Completed" />
            <CountUp end={250} label="Enterprise Clients" />
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section - Updated animation properties */}
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
            transition={{ duration: 0.5 }} // Faster animation
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Transform Your Verification Process?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of satisfied customers who trust our AI-powered verification services for their most critical decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/claimupload")}
                className="px-10 py-4 bg-white text-gray-900 rounded-lg shadow-xl font-bold text-lg"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/aboutus")}

                className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Starry background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas>
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>
    </motion.section>
  );
};

export default Services;