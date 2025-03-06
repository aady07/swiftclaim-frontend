import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiShield, FiDatabase, FiUsers, FiTrendingUp, FiLayers, FiCode } from "react-icons/fi";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const fadeInStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const Services = () => {
  const [activeTab, setActiveTab] = useState("individual");

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

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden px-4 py-16 text-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Static Linear Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900" />

      {/* Wave background effect */}
      <div className="absolute inset-0 z-0 opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[50vh] border-t border-white/10"
            style={{
              top: `${20 * i}vh`,
              scaleX: 2,
              transformOrigin: "center",
            }}
            animate={{
              y: [0, 15, 0],
              scaleY: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        variants={fadeInStagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center max-w-6xl mx-auto"
      >
        <motion.span 
          variants={fadeInUp}
          className="mb-1.5 inline-block rounded-full bg-gray-600/70 backdrop-blur-md px-4 py-1.5 text-sm font-medium tracking-wider"
        >
          OUR SERVICES
        </motion.span>
        
        <motion.h1 
          variants={fadeInUp}
          className="max-w-3xl bg-gradient-to-br from-gray-200 to-white bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl"
        >
          AI-Powered Verification Solutions
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="my-6 max-w-2xl text-center text-lg leading-relaxed md:text-xl text-gray-300"
        >
          We offer cutting-edge verification services powered by artificial intelligence to ensure accuracy and reliability for individuals and businesses alike.
        </motion.p>

        {/* Service type tabs */}
        <motion.div 
          variants={fadeInUp}
          className="flex gap-2 bg-gray-800/50 p-1 rounded-full mb-12 backdrop-blur-sm"
        >
          {["individual", "business"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                activeTab === tab 
                  ? "bg-gray-700 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab} Services
            </motion.button>
          ))}
        </motion.div>

        {/* Services grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
          variants={fadeInUp}
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {services[activeTab].map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 flex flex-col h-full"
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                borderColor: ["#0f766e", "#0e7490", "#0369a1", "#1d4ed8"][index % 4],
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.3,
                delay: 0.1 * index 
              }}
            >
              <div className="p-6 flex-grow">
                <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center text-2xl mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FiCheck className="text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <motion.button
                  className="w-full py-2 rounded-lg bg-gray-700/70 hover:bg-gray-700 transition-colors text-white font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Process section */}
        <motion.div
          variants={fadeInUp} 
          className="mt-24 w-full"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Our Verification Process
            </h2>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Our streamlined verification process leverages the latest in AI technology to provide fast and accurate results
            </p>
          </div>
          
          <div className="relative">
            {/* Process timeline line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-700 transform -translate-x-1/2 hidden md:block"></div>
            
            {/* Process steps */}
            {[
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
            ].map((step, index) => (
              <motion.div
                key={index}
                className={`relative flex md:items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } flex-col`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`md:w-1/2 flex ${
                  index % 2 === 0 ? "md:justify-end md:pr-8" : "md:justify-start md:pl-8"
                } justify-center`}>
                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 max-w-md">
                    <div className="text-3xl font-bold text-gray-500 mb-2">{step.number}</div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                <div className="md:w-1/2 hidden md:flex items-center justify-center">
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-600 z-10"
                    style={{ borderColor: ["#0f766e", "#0e7490", "#0369a1", "#1d4ed8"][index % 4] }}
                    whileInView={{ 
                      scale: [1, 1.2, 1],
                      borderWidth: ["2px", "4px", "2px"],
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          variants={fadeInUp}
          className="w-full mt-16 mb-8"
        >
          <div className="rounded-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm z-0"></div>
            <div className="relative z-10 p-12 flex flex-col items-center text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                Join thousands of satisfied customers who trust our AI-powered verification services for their most critical decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  style={{
                    border: "1px solid #0f766e",
                    boxShadow: "0px 4px 24px #0f766e",
                  }}
                  className="px-8 py-3 rounded-lg bg-gray-950/30 text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
                <motion.button
                  className="px-8 py-3 rounded-lg border border-gray-500 text-gray-300"
                  whileHover={{ scale: 1.05, borderColor: "white" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Starry background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas>
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>
    </motion.div>
  );
};

export default Services;