import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";

const HomePage = () => {
  const { scrollYProgress } = useScroll();

  const navigate = useNavigate();
  
  // Hero section background animation
  
  
  // Features data
  const features = [
    {
      title: "Intelligent Analytics",
      description: "Transform raw data into actionable insights with our AI-powered analytics platform.",
      icon: "https://cdn-icons-png.flaticon.com/512/2620/2620669.png"
    },
    {
      title: "Predictive Modeling",
      description: "Forecast trends and anticipate market changes with our advanced predictive algorithms.",
      icon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png"
    },
    {
      title: "Natural Language Processing",
      description: "Analyze text data at scale and extract meaningful patterns from unstructured content.",
      icon: "https://cdn-icons-png.flaticon.com/512/6614/6614677.png"
    },
    {
      title: "Computer Vision",
      description: "Automate image and video analysis with our cutting-edge visual recognition systems.",
      icon: "https://cdn-icons-png.flaticon.com/512/3081/3081977.png" // New icon URL
    }
  ];
  
  // Solutions for different industries
  const industries = [
    {
      name: "Banking",
      description: "Enhancing customer experience, fraud detection, and risk management through advanced AI algorithms.",
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?q=80&w=1200",
      color: "from-blue-600 to-blue-800",
      icon: "💹"
    },
    {
      name: "Insurance",
      description: "Streamlining claims processing and improving underwriting with predictive models and automation.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
      color: "from-emerald-600 to-emerald-800",
      icon: "🛡️"
    },
    {
      name: "Wealth Management",
      description: "Personalizing investment strategies and optimizing portfolio allocation through data-driven insights.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
      color: "from-amber-600 to-amber-800",
      icon: "📈"
    },
    {
      name: "Science & Research",
      description: "Accelerating discoveries and analyzing complex datasets for breakthrough innovations across disciplines.",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1200",
      color: "from-purple-600 to-purple-800",
      icon: "🔬"
    }
  ];
  
  // Update the Trusted By section with real company logos
  /*const brandLogos = [
    {
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      name: "IBM",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      color: "from-blue-600/20 to-blue-700/20"
    },
    {
      name: "Deloitteasd",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Deloitte.svg",
      color: "from-green-500/20 to-green-600/20"
    },
    {
      name: "Accenture",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
      color: "from-purple-500/20 to-purple-600/20"
    },
    {
      name: "KPMG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/76/KPMG_logo.svg",
      color: "from-blue-400/20 to-blue-500/20"
    }
  ];
  const technologies = [
    {
      name: "Machine Learning",
      description: "Advanced algorithms that learn and improve from experience",
      icon: "🧠",
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Deep Neural Networks",
      description: "Complex neural architectures mimicking human brain processing",
      icon: "💡",
      color: "from-green-500 to-teal-600"
    },
    {
      name: "Natural Language Processing",
      description: "Transforming human language into actionable insights",
      icon: "💬",
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "Computer Vision",
      description: "Intelligent image and video analysis capabilities",
      icon: "👁️",
      color: "from-red-500 to-orange-600"
    }
  ];*/
 
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
      answer: "We implement enterprise-grade encryption, strict access controls, and conduct regular security audits to safeguard your data. All our solutions are designed to comply with Indian regulatory requirements, including the Digital Personal Data Protection Act (DPDP Act, 2023), CERT-In guidelines, and other sector-specific regulations issued by authorities such as RBI, IRDAI, and SEBI, ensuring full alignment with national standards for data privacy and cybersecurity."
    },
    {
      question: "Can your AI solutions integrate with our existing systems?",
      answer: "Yes, our solutions are designed for seamless integration with popular business platforms, databases, and APIs. We have experience working with a wide range of systems and can develop custom connectors when needed."
    },
    {
      question: "What makes Miraista different from other AI companies?",
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
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);
  const handleTryItNow = () => {
    navigate("/claimupload");
  };

  const [hoveredCard, setHoveredCard] = useState(null);


  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>Miraista - AI-Powered Business Solutions & Innovation</title>
        <meta name="description" content="Transform your business with Miraista's cutting-edge AI solutions. We deliver advanced machine learning, data analytics, and AI innovation services to drive growth and efficiency." />
        <meta name="keywords" content="AI solutions, business transformation, machine learning, data analytics, AI innovation, Miraista, artificial intelligence services, predictive analytics, natural language processing, computer vision" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.miraista.com" />
        <meta property="og:title" content="Miraista - AI-Powered Business Solutions & Innovation" />
        <meta property="og:description" content="Transform your business with Miraista's cutting-edge AI solutions. Advanced machine learning and data analytics services for modern enterprises." />
        <meta property="og:image" content="https://www.miraista.com/og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.miraista.com" />
        <meta property="twitter:title" content="Miraista - AI-Powered Business Solutions & Innovation" />
        <meta property="twitter:description" content="Transform your business with Miraista's cutting-edge AI solutions. Advanced machine learning and data analytics services for modern enterprises." />
        <meta property="twitter:image" content="https://www.miraista.com/og-image.jpg" />
        
        {/* Additional SEO tags */}
        <link rel="canonical" href="https://www.miraista.com" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Miraista" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="generator" content="React" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Miraista",
            "url": "https://www.miraista.com",
            "logo": "https://www.miraista.com/logo.png",
            "description": "AI-Powered Business Solutions & Innovation",
            "sameAs": [
              "https://www.linkedin.com/company/miraista",
              "https://twitter.com/miraista",
              "https://www.facebook.com/miraista"
            ]
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
              <span className="block mb-2 sm:mb-4">Transforming Business</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Through AI Innovation
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-8 sm:mb-10 text-gray-300 px-4 sm:px-0"
            >
              Unlock the full potential of your data with our cutting-edge AI solutions that drive growth, efficiency, and innovation.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTryItNow}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-base sm:text-lg font-medium"
              >
                Try It Now
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


      {/* Features Section */}
      <section className="relative -mt-1 py-16 bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>
        <div className="container mx-auto px-4 relative z-10">
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
              className="text-slate-400 uppercase tracking-wider mb-2"
              >
              Advanced AI Solutions
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-gradient-to-r from-slate-500 to-slate-600 mx-auto"
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
              onClick={() => navigate("/services")}
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-lg font-medium"
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
              className="text-slate-400 uppercase tracking-wider mb-2"
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
                
                <div className="mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-slate-500/20 border border-slate-500/50 mx-auto">
<span className="text-2xl font-bold text-slate-400">{step.number}</span>
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
              onClick={() => navigate("/contacts")}
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-lg font-medium"
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
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Industries We Serve
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
            />
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
{industries.map((industry, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col"
  >
    {/* Image Container */}
    <div className="relative h-48 overflow-hidden">
      <img
        src={industry.image}
        alt={industry.name}
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{industry.icon}</span>
        <h3 className="text-xl font-semibold text-white">{industry.name}</h3>
      </div>
      <p className="text-gray-300 mb-6 text-sm flex-grow">{industry.description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/services")}
        className="w-full px-4 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 mt-auto"
      >
        <span>Learn More</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </motion.button>
    </div>
  </motion.div>
))}
</div>

          {/* CTA Button */}
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
              onClick={() => navigate("/services")}
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg text-lg font-medium"
            >
              Explore All Industries
            </motion.button>
          </motion.div>
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
              className="text-slate-400 uppercase tracking-wider mb-2"
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
      <section className="py-20 bg-gradient-to-r from-slate-700 to-slate-800 relative overflow-hidden">
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
                onClick={() => navigate("/services")}
                className="px-10 py-4 bg-white text-slate-700 rounded-lg shadow-xl font-bold text-lg"
              >
                Learn More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contacts")}
                className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
     
    </div>
  );
};

export default HomePage;