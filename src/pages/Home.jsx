  import React, { useState, useEffect } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  import { useNavigate } from "react-router-dom";

  const HomePage = () => {
    const navigate = useNavigate();
    
    // Hero section background animation
    
    
    // Features data
    const features = [
      {
        title: "Intelligent Analytics",
        description: "Transform raw data into actionable insights with our AI-powered analytics platform.",
        icon: "/images/analytics-icon.png"
      },
      {
        title: "Predictive Modeling",
        description: "Forecast trends and anticipate market changes with our advanced predictive algorithms.",
        icon: "/images/predictive-icon.png"
      },
      {
        title: "Natural Language Processing",
        description: "Analyze text data at scale and extract meaningful patterns from unstructured content.",
        icon: "/images/nlp-icon.png"
      },
      {
        title: "Computer Vision",
        description: "Automate image and video analysis with our cutting-edge visual recognition systems.",
        icon: "/images/vision-icon.png"
      }
    ];
    
    // Solutions for different industries
    const industries = [
      {
        name: "Healthcare",
        description: "Improving patient outcomes through predictive diagnostics and personalized treatment plans.",
        image: "/images/healthcare-bg.jpg",
        color: "from-blue-600 to-cyan-500"
      },
      {
        name: "Finance",
        description: "Enhancing risk assessment and fraud detection with pattern recognition algorithms.",
        image: "/images/finance-bg.jpg",
        color: "from-indigo-600 to-purple-500"
      },
      {
        name: "Retail",
        description: "Optimizing inventory management and personalizing customer experiences.",
        image: "/images/retail-bg.jpg",
        color: "from-fuchsia-600 to-pink-500"
      },
      {
        name: "Manufacturing",
        description: "Streamlining operations and predicting maintenance needs before failures occur.",
        image: "/images/manufacturing-bg.jpg",
        color: "from-orange-600 to-amber-500"
      }
    ];
    
    // How it works steps
    const steps = [
      {
        number: "01",
        title: "Data Integration",
        description: "We seamlessly connect to your existing data sources, no matter how complex or diverse."
      },
      {
        number: "02",
        title: "AI Model Selection",
        description: "Our experts choose the optimal algorithms tailored to your specific business challenges."
      },
      {
        number: "03",
        title: "Training & Optimization",
        description: "We train and fine-tune models using your data to ensure maximum accuracy and relevance."
      },
      {
        number: "04",
        title: "Deployment & Scaling",
        description: "Implement solutions across your organization with our enterprise-grade infrastructure."
      }
    ];
    
    // FAQ items
    const [activeFaq, setActiveFaq] = useState(null);
    const faqItems = [
      {
        question: "How quickly can you implement AI solutions for my business?",
        answer: "Implementation timelines vary based on project complexity. Simple integrations can be completed in as little as 2-4 weeks, while more complex enterprise-wide solutions may take 3-6 months. Our team works with you to establish clear milestones and deliverables from day one."
      },
      {
        question: "Do I need to have technical expertise to use your AI solutions?",
        answer: "Not at all. We design our solutions with user-friendly interfaces that require no technical background. Additionally, we provide comprehensive training and support to ensure your team can maximize the value of our AI tools."
      },
      {
        question: "How do you ensure data security and privacy?",
        answer: "Security is our top priority. We implement enterprise-grade encryption, strict access controls, and regular security audits. All solutions are designed to comply with relevant regulations including GDPR, HIPAA, and other industry-specific requirements."
      },
      {
        question: "Can your AI solutions integrate with our existing systems?",
        answer: "Yes, our solutions are designed for seamless integration with popular business platforms, databases, and APIs. We have experience working with a wide range of systems and can develop custom connectors when needed."
      },
      {
        question: "What makes Techiees.AI different from other AI companies?",
        answer: "Our team combines deep technical expertise with practical business experience. We focus on delivering measurable ROI rather than implementing technology for its own sake. Additionally, our continuous support model ensures your AI solutions evolve alongside your business needs."
      }
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

    const handleTryItNow = () => {
      navigate("/claim-upload");
    };

    return (
      <div className="bg-gray-950 text-gray-200 overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900" />

          
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
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen">
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
                <span className="block mb-2">Transforming Business</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Through AI Innovation
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300"
              >
                Unlock the full potential of your data with our cutting-edge AI solutions that drive growth, efficiency, and innovation.
              </motion.p>
              
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-6 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTryItNow}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg text-lg font-medium"
                >
                  Try It Now
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-blue-500 text-white rounded-lg text-lg font-medium"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
          
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

        {/* Trusted By Section */}
        <section className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl font-semibold text-gray-400">Trusted By Industry Leaders</h2>
            </motion.div>
            
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-70">
              {["brand1", "brand2", "brand3", "brand4", "brand5"].map((brand, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                >
                  <img
                    src={`/images/${brand}-logo.png`}
                    alt={`${brand} logo`}
                    className="h-12 md:h-16"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h6
                variants={fadeInUp}
                className="text-blue-400 uppercase tracking-wider mb-2"
              >
                Our Capabilities
              </motion.h6>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Advanced AI Solutions
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700 flex flex-col items-center text-center"
                >
                  <div className="h-16 w-16 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                    <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-lg font-medium"
              >
                Explore All Features
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h6
                variants={fadeInUp}
                className="text-blue-400 uppercase tracking-wider mb-2"
              >
                Our Process
              </motion.h6>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                How It Works
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-blue-500/30 -z-10 transform -translate-x-1/2" />
                  )}
                  
                  <div className="mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/50 mx-auto">
                    <span className="text-2xl font-bold text-blue-400">{step.number}</span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-300">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto mt-16 p-6 bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Ready to experience AI transformation?</h3>
              <p className="text-gray-300 mb-6">Schedule a personalized demo to see how our solutions can work for your business.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-lg font-medium"
              >
                Request Demo
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Industries Section */}
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h6
                variants={fadeInUp}
                className="text-blue-400 uppercase tracking-wider mb-2"
              >
                Tailored Solutions
              </motion.h6>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Industries We Serve
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
              />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="relative rounded-xl overflow-hidden group cursor-pointer h-64"
                >
                  {/* Background image with overlay */}
                  <div className="absolute inset-0">
                    <img
                      src={industry.image}
                      alt={industry.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} opacity-80`} />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end transition-all duration-300 group-hover:bg-black/30">
                    <h3 className="text-2xl font-bold text-white mb-2">{industry.name}</h3>
                    <p className="text-white/90 mb-6 max-w-sm">{industry.description}</p>
                    <span className="text-white font-semibold flex items-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Learn More
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.h6
                variants={fadeInUp}
                className="text-blue-400 uppercase tracking-wider mb-2"
              >
                Common Questions
              </motion.h6>
              <motion.h2
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.div
                variants={fadeInUp}
                className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
              />
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-4"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-4 bg-gray-800 rounded-lg text-left flex justify-between items-center"
                  >
                    <span className="text-lg font-medium text-white">{item.question}</span>
                    <span className="text-blue-400 transition-transform duration-200" style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-gray-800/50 border-t border-gray-700 rounded-b-lg">
                          <p className="text-gray-300">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
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
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Start Your AI Journey Today
              </h2>
              <p className="text-xl text-blue-100 mb-10">
                Join leading companies already leveraging our AI solutions to transform their business.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTryItNow}
                  className="px-10 py-4 bg-white text-blue-700 rounded-lg shadow-xl font-bold text-lg"
                >
                  Try It Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg"
                >
                  Contact Sales
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-950 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Techiees.AI</h3>
                <p className="text-gray-400 mb-6">Transforming business through AI innovation.</p>
                <div className="flex space-x-4">
                  {["twitter", "linkedin", "facebook", "instagram"].map((social, index) => (
                    <a key={index} href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <img src={`/images/${social}-icon.svg`} alt={social} className="h-6 w-6" />
                    </a>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Solutions</h4>
                <ul className="space-y-2">
                  {["Analytics Platform", "Predictive Modeling", "Natural Language Processing", "Computer Vision", "Custom Solutions"].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2">
                  {["About Us", "Team", "Careers", "News", "Contact"].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  {["Blog", "Case Studies", "Documentation", "Support", "API Reference"].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Techiees.AI. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-400 text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  export default HomePage;