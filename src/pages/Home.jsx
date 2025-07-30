import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";

// Typewriter effect component
const TypewriterText = ({ text, variations, color = "from-green-500 to-blue-600" }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVariation, setCurrentVariation] = useState(0);

  useEffect(() => {
    const currentText = variations[currentVariation];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText === currentText) {
          // Start deleting after a pause
          setTimeout(() => setIsDeleting(true), 1500);
        } else {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }
      } else {
        if (displayText === "") {
          setIsDeleting(false);
          setCurrentVariation((prev) => (prev + 1) % variations.length);
        } else {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentVariation, variations]);

  return (
    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mt-2 hover:scale-105 transition-transform duration-300">
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
};

const HomePage = () => {
  const { scrollYProgress } = useScroll();

  const navigate = useNavigate();
  
  // Hero section text carousel data with variations
  const heroTexts = [
    {
      title: "Meet Your AI Agent",
      subtitle: "Smart Chatbot Assistant",
      subtitleVariations: [
        "Smart Chatbot Assistant",
        "Intelligent AI Companion",
        "24/7 Virtual Assistant",
        "Context-Aware Helper",
        "Natural Language Expert"
      ],
      description: "Our advanced AI chatbot isn't just a simple assistant - it's your dedicated agent that understands context, handles complex queries, and provides intelligent responses. Experience natural conversations with an AI that truly understands you.",
      previewPosition: "right",
      type: "video",
      videoSource: "/chat.mp4"
    },
    {
      title: "Auto Claim Processing",
      subtitle: "Powered by AI",
      subtitleVariations: [
        "Powered by AI",
        "Intelligent Processing",
        "Automated Excellence",
        "Smart Document Analysis",
        "Real-time Validation"
      ],
      description: "Transform your claims processing with our AI-powered system. Upload documents, and watch as our intelligent agent automatically extracts information, validates claims, and processes them with unprecedented speed and accuracy.",
      previewPosition: "left",
      type: "video",
      videoSource: "/claim.mp4"
    }
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // Auto-scroll carousel every 10-12 seconds
    const carouselInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, currentTextIndex === 0 ? 10000 : 12000);

    return () => {
      clearInterval(carouselInterval);
    };
  }, [currentTextIndex]);

  // Function to handle manual carousel change
  const handleCarouselChange = (index) => {
    setCurrentTextIndex(index);
  };

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
      color: "from-gray-800 to-black",
      icon: "💹"
    },
    {
      name: "Insurance",
      description: "Streamlining claims processing and improving underwriting with predictive models and automation.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200",
      color: "from-gray-800 to-black",
      icon: "🛡️"
    },
    {
      name: "Wealth Management",
      description: "Personalizing investment strategies and optimizing portfolio allocation through data-driven insights.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
      color: "from-gray-800 to-black",
      icon: "📈"
    },
    {
      name: "Science & Research",
      description: "Accelerating discoveries and analyzing complex datasets for breakthrough innovations across disciplines.",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1200",
      color: "from-gray-800 to-black",
      icon: "🔬"
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
    navigate("/imageupload");
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  // Add state for interactive elements
  const [activeFeature, setActiveFeature] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  
  // Add interactive demo data
  const demoData = {
    "Intelligent Analytics": {
      metrics: ["98% Accuracy", "2x Faster", "50% Cost Reduction"],
      chart: "📊",
      description: "Real-time analytics dashboard with predictive insights"
    },
    "Predictive Modeling": {
      metrics: ["95% Precision", "3x Efficiency", "40% Growth"],
      chart: "📈",
      description: "Advanced predictive models for business forecasting"
    },
    "Natural Language Processing": {
      metrics: ["99% Understanding", "5x Speed", "60% Automation"],
      chart: "💬",
      description: "Natural language understanding and processing"
    },
    "Computer Vision": {
      metrics: ["97% Recognition", "4x Faster", "70% Accuracy"],
      chart: "👁️",
      description: "Advanced image and video analysis"
    }
  };

  const [activeFaq, setActiveFaq] = useState(null);
  
  // Add FAQ items data
  const faqItems = [
    {
      question: "How does the AI claim processing work?",
      answer: "Our AI system uses advanced machine learning algorithms to analyze claim documents, extract relevant information, and automatically process claims. It can handle various document types and formats while maintaining high accuracy."
    },
    {
      question: "What types of documents can the system process?",
      answer: "The system can process a wide range of documents including insurance forms, damage reports, medical records, invoices, and photos. It supports multiple file formats including PDF, JPG, PNG, and more."
    },
    {
      question: "How accurate is the AI processing?",
      answer: "Our AI system achieves over 99% accuracy in document processing and information extraction. It's continuously learning and improving from each processed claim to maintain and enhance its accuracy."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All data is encrypted in transit and at rest. We comply with industry standards and regulations including GDPR, HIPAA, and other relevant data protection requirements."
    },
    {
      question: "How long does it take to implement the system?",
      answer: "Implementation typically takes 2-4 weeks, depending on your specific requirements and existing infrastructure. Our team will guide you through the entire process, from initial setup to full deployment."
    }
  ];

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
      <section className="relative min-h-screen overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" />
          
          {/* Animated Lines */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent"
                style={{
                  top: `${20 + i * 15}%`,
                  left: '0',
                  right: '0',
                  transform: `rotate(${i * 10}deg)`,
                  animation: `float ${5 + i}s infinite ease-in-out`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl transform-gpu"
            >
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="transform-gpu"
                  >
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight hover:scale-105 transition-transform duration-300">
                      {heroTexts[currentTextIndex].title}
                      <TypewriterText 
                        text={heroTexts[currentTextIndex].subtitle}
                        variations={heroTexts[currentTextIndex].subtitleVariations}
                      />
                    </h1>
                    
                    <p className="text-xl text-gray-300 mb-12 leading-relaxed hover:scale-105 transition-transform duration-300">
                      {heroTexts[currentTextIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 transform-gpu mb-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, rotateX: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(currentTextIndex === 0 ? "/chatbotpage" : "/imageupload")}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 relative overflow-hidden group transform-gpu"
                >
                  <span className="relative z-10">{currentTextIndex === 0 ? "Meet Your Agent" : "Try It Now"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-0" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, rotateX: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/services")}
                  className="px-8 py-4 bg-gray-800/80 backdrop-blur-sm text-gray-200 rounded-xl text-lg font-semibold border-2 border-gray-700 hover:border-gray-600 transition-all duration-300 relative overflow-hidden group transform-gpu"
                >
                  <span className="relative z-10">Learn More</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-full group-hover:translate-y-0" />
                </motion.button>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6"
              >
                {[
                  { value: "99.8%", label: "Accuracy" },
                  { value: "24/7", label: "Support" },
                  { value: "10x", label: "Faster" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* Carousel Indicators with 3D Effect */}
              <div className="flex gap-3 mt-8 transform-gpu">
                {heroTexts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleCarouselChange(index)}
                    className={`h-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      currentTextIndex === index 
                        ? 'w-8 bg-gradient-to-r from-green-600 to-blue-600 shadow-lg shadow-green-500/25' 
                        : 'w-2 bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right Content - Preview with 3D Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative hidden lg:block transform-gpu"
            >
              {heroTexts[currentTextIndex].type === 'video' ? (
                <div className={`relative mx-auto ${
                  currentTextIndex === 0 
                    ? 'w-[400px] h-[600px] -mt-10'
                    : 'w-[700px] h-[450px]' // Horizontal for claim.mp4
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur-2xl transform -rotate-6" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl blur-2xl transform rotate-6" />
                  <video
                    key={currentTextIndex}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-2xl relative z-10 shadow-2xl"
                    ref={(el) => {
                      if (el) {
                        el.playbackRate = 1.3;
                      }
                    }}
                  >
                    <source src={heroTexts[currentTextIndex].videoSource} type="video/mp4" />
                  </video>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full blur-2xl animate-pulse" />
                </div>
              ) : (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700 transform hover:scale-105 transition-transform duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 w-32 bg-gradient-to-r from-gray-100 to-gray-50 rounded-full transform hover:scale-105 transition-transform duration-300"></div>
                        <div className="h-2 w-20 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full mt-2 transform hover:scale-105 transition-transform duration-300"></div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-3/4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full transform hover:scale-105 transition-transform duration-300"></div>
                      <div className="h-4 w-1/2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full transform hover:scale-105 transition-transform duration-300"></div>
                    </div>
                    <div className="h-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl transform hover:scale-105 transition-transform duration-300"></div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>  
        </div>  
      </section>

      {/* Features Section with Advanced Interactive Cards */}
      <section className="py-12 relative overflow-hidden perspective-1000">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-2"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full mb-2"
            >
              <span className="font-semibold tracking-wider uppercase text-sm">Industry Solutions</span>
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold mb-2"
            >
              Transform Your Business with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                AI-Powered Automation
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 mb-3"
            >
              Discover how leading industries are leveraging our intelligent chatbot solutions to streamline operations and enhance customer experience.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 gap-8">
            {[
              {
                industry: "Insurance",
                title: "Automated Claims Processing",
                description: "Our AI chatbot revolutionizes insurance claims by automating document processing, instant claim validation, and real-time status updates. Reduce processing time by 70% while maintaining 99.8% accuracy.",
                features: [
                  "Instant claim validation",
                  "Automated document processing",
                  "Real-time status updates",
                  "Fraud detection"
                ],
                image: "/chatbot-insurance.png",
                gradient: "from-green-500/20 to-blue-500/20"
              },
              {
                industry: "Banking",
                title: "24/7 Customer Support",
                description: "Transform your banking operations with our intelligent chatbot that handles customer queries, account management, and transaction assistance around the clock. Improve customer satisfaction by 85%.",
                features: [
                  "Account balance inquiries",
                  "Transaction assistance",
                  "Loan application support",
                  "Security alerts"
                ],
                image: "/chatbot-banking.png",
                gradient: "from-green-500 to-teal-500"
              },
              {
                industry: "Healthcare",
                title: "Patient Care Assistant",
                description: "Enhance patient care with our healthcare chatbot that provides appointment scheduling, medical information, and symptom assessment. Reduce administrative workload by 60%.",
                features: [
                  "Appointment scheduling",
                  "Medical information access",
                  "Symptom assessment",
                  "Prescription reminders"
                ],
                image: "/chatbot-healthcare.png",
                gradient: "from-green-500 to-teal-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className={`bg-gradient-to-br ${
                  item.industry === "Insurance" 
                    ? "from-green-50/50 to-blue-50/50" 
                    : item.industry === "Banking"
                    ? "from-green-50/50 to-teal-50/50"
                    : "from-green-50/50 to-teal-50/50"
                } rounded-3xl overflow-hidden shadow-xl border ${
                  item.industry === "Insurance" 
                    ? "border-green-100" 
                    : item.industry === "Banking"
                    ? "border-green-100"
                    : "border-teal-100"
                }`}>
                  <div className="grid lg:grid-cols-2 gap-8 p-8">
                    {/* Left Content */}
                    <div className="space-y-6">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${
                        item.industry === "Insurance" 
                          ? "from-green-100 to-blue-100" 
                          : item.industry === "Banking"
                          ? "from-green-100 to-teal-100"
                          : "from-green-100 to-teal-100"
                      }`}>
                        <span className="text-sm font-medium text-gray-600">{item.industry}</span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                      
                      <p className="text-gray-600">{item.description}</p>
                      
                      <div className="space-y-3">
                        {item.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full ${
                              item.industry === "Insurance" 
                                ? "bg-green-100" 
                                : item.industry === "Banking"
                                ? "bg-green-100"
                                : "bg-teal-100"
                            } flex items-center justify-center`}>
                              <svg className={`w-3 h-3 ${
                                item.industry === "Insurance" 
                                  ? "text-green-600" 
                                  : item.industry === "Banking"
                                  ? "text-teal-600"
                                  : "text-teal-600"
                              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/contacts")}
                        className={`px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 ${
                          item.industry === "Insurance" 
                            ? "bg-gradient-to-r from-green-500 to-blue-500" 
                            : item.industry === "Banking"
                            ? "bg-gradient-to-r from-green-500 to-teal-500"
                            : "bg-gradient-to-r from-green-500 to-teal-500"
                        }`}
                      >
                        Learn More
                      </motion.button>
                    </div>
                    
                    {/* Right Content - Chatbot Preview - Hidden on Mobile */}
                    <div className="relative hidden lg:block">
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        item.industry === "Insurance" 
                          ? "from-green-50 to-blue-50" 
                          : item.industry === "Banking"
                          ? "from-green-50 to-teal-50"
                          : "from-green-50 to-teal-50"
                      } rounded-2xl`} />
                      <div className="relative p-6">
                        <div className={`bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700`}>
                          {/* Chat Header */}
                          <div className={`flex items-center gap-3 pb-4 border-b ${
                            item.industry === "Insurance" 
                              ? "border-green-100" 
                              : item.industry === "Banking"
                              ? "border-green-100"
                              : "border-teal-100"
                          }`}>
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                              item.industry === "Insurance" 
                                ? "from-green-500 to-blue-500" 
                                : item.industry === "Banking"
                                ? "from-green-500 to-teal-500"
                                : "from-green-500 to-teal-500"
                            } flex items-center justify-center`}>
                              <span className="text-white text-lg">AI</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white">AI Assistant</div>
                              <div className="text-sm text-gray-300">Online</div>
                            </div>
                          </div>
                          
                          {/* Chat Messages */}
                          <div className="space-y-4 max-h-[300px] overflow-y-auto">
                            {item.industry === "Insurance" && (
                              <>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">I need to file a claim for my car accident</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-white text-sm">AI</span>
                                  </div>
                                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">I'll help you file your claim. Please upload photos of the damage and your insurance documents.</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Here are the photos and documents</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                                    <span className="text-white text-sm">AI</span>
                                  </div>
                                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Thank you! I've processed your documents. Your claim has been approved. You'll receive the settlement within 2-3 business days.</p>
                                  </div>
                                </div>
                              </>
                            )}
                            
                            {item.industry === "Banking" && (
                              <>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">What's my current account balance?</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                    <span className="text-white text-sm">AI</span>
                                  </div>
                                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Your current balance is $5,240.75. Would you like to see your recent transactions?</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Yes, please show me the last 5 transactions</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                    <span className="text-white text-sm">AI</span>
                                  </div>
                                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Here are your recent transactions:</p>
                                    <div className="mt-2 space-y-2">
                                      <div className="text-xs text-gray-300">• Starbucks - $4.50</div>
                                      <div className="text-xs text-gray-300">• Amazon - $29.99</div>
                                      <div className="text-xs text-gray-300">• Salary Deposit - $3,500.00</div>
                                      <div className="text-xs text-gray-300">• Netflix - $15.99</div>
                                      <div className="text-xs text-gray-300">• Uber - $12.75</div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            
                            {item.industry === "Healthcare" && (
                              <>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">I need to schedule a check-up appointment</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                    <span className="text-white text-sm">AI</span>
                                  </div>
                                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">I can help you schedule that. Dr. Smith has availability next week. Would you prefer morning or afternoon?</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Morning would be better</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                    <span className="text-white text-sm">AI</span>
                                  </div>
                                  <div className="bg-gray-600 rounded-lg p-3 max-w-[80%]">
                                    <p className="text-sm text-white">Great! I've scheduled your appointment for Tuesday at 9:00 AM. I'll send a confirmation email with preparation instructions.</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Chat Input */}
                          <div className={`flex items-center gap-2 pt-4 border-t ${
                            item.industry === "Insurance" 
                              ? "border-green-100" 
                              : item.industry === "Banking"
                              ? "border-green-100"
                              : "border-teal-100"
                          }`}>
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className={`flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 ${
                                item.industry === "Insurance" 
                                  ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500" 
                                  : item.industry === "Banking"
                                  ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-green-500"
                                  : "bg-gray-700 text-white placeholder-gray-400 focus:ring-teal-500"
                              }`}
                            />
                            <button className={`p-2 text-white rounded-lg ${
                              item.industry === "Insurance" 
                                ? "bg-gradient-to-r from-green-500 to-blue-500" 
                                : item.industry === "Banking"
                                ? "bg-gradient-to-r from-green-500 to-teal-500"
                                : "bg-gradient-to-r from-green-500 to-teal-500"
                            }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto Claim Processing Section */}
      <section className="py-12 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block"
            >
              Auto Claim Processing
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Transform Claims Processing with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                AI-Powered Automation
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8"
            >
              Experience the future of claims processing with our intelligent AI system that automates document analysis, validation, and processing with unprecedented accuracy.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Features */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {[
                {
                  title: "Smart Document Processing",
                  description: "Our AI automatically extracts and validates information from various document types with 99.8% accuracy.",
                  icon: "📄",
                  color: "from-green-500 to-blue-500"
                },
                {
                  title: "Real-time Validation",
                  description: "Instant verification of claim details against policy information and historical data.",
                  icon: "⚡",
                  color: "from-green-500 to-teal-500"
                },
                {
                  title: "Automated Decision Making",
                  description: "AI-powered decision engine that processes claims based on predefined rules and machine learning models.",
                  icon: "🤖",
                  color: "from-green-500 to-teal-500"
                },
                {
                  title: "Fraud Detection",
                  description: "Advanced algorithms detect suspicious patterns and potential fraud in real-time.",
                  icon: "🛡️",
                  color: "from-red-500 to-orange-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="flex gap-6 items-start group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right Side - Interactive Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
                <div className="space-y-6">
                  {/* Processing Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-green-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                      <span className="text-white text-lg">AI</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">Document Processing Engine</div>
                      <div className="text-sm text-gray-300">Powered by RCNN & YOLO Models</div>
                    </div>
                  </div>

                  {/* Processing Steps */}
                  <div className="space-y-4">
                    {/* Step 1: Document Upload */}
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600">1</span>
                        </div>
                        <h4 className="font-medium text-gray-900">Document Upload</h4>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-lg bg-white border-2 border-dashed border-green-200 flex items-center justify-center">
                          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-600">Upload damage photos and insurance documents</div>
                          <div className="mt-2 text-xs text-green-600">Supported formats: JPG, PNG, PDF</div>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: AI Processing */}
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600">2</span>
                        </div>
                        <h4 className="font-medium text-gray-900">AI Processing</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600">RCNN Model: Damage Assessment</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600">YOLO Model: Object Detection</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600">OCR: Text Extraction</span>
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Results */}
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600">3</span>
                        </div>
                        <h4 className="font-medium text-gray-900">Processing Results</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Damage Assessment:</span>
                          <span className="text-green-600 font-medium">98.5% Confidence</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Object Detection:</span>
                          <span className="text-green-600 font-medium">99.2% Accuracy</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Text Extraction:</span>
                          <span className="text-green-600 font-medium">99.8% Accuracy</span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-green-100">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-gray-900">Total Processing Time:</span>
                            <span className="text-green-600">2.3 seconds</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Processing Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-green-100">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-gray-600">Processing Complete</span>
                    </div>
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl" />
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/imageupload")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg shadow-xl font-bold text-lg"
            >
              Try Auto Claim Processing
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 pb-16 relative overflow-hidden hidden lg:block">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-8"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center px-4 py-2 rounded-full mb-2 bg-white/10 backdrop-blur-sm"
            >
              <span className="text-white font-semibold tracking-wider uppercase text-sm">How It Works</span>
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold mb-3 text-white"
            >
              Deploy This in Your Codebase
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-4"
            >
              Enjoy Complete Automation
            </motion.p>
          </motion.div>

          {/* Technology Connection Diagram */}
          <div className="relative max-w-6xl mx-auto h-[500px] mb-8">
            {/* Animated Connection Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
              {/* Static Vertical Lines Between Technologies */}
              <path
                d="M150,60 L150,540"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
              <path
                d="M350,60 L350,540"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
              <path
                d="M650,60 L650,540"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
              <path
                d="M850,60 L850,540"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />

              {/* Static Horizontal Lines Between Technologies */}
              <path
                d="M150,100 L350,100 M150,300 L350,300 M150,500 L350,500"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
              <path
                d="M650,100 L850,100 M650,300 L850,300 M650,500 L850,500"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />

              {/* Animated Lines to Chatbot with Icons */}
              {[
                { startX: 150, startY: 100, endX: 500, endY: 300 },
                { startX: 150, startY: 300, endX: 500, endY: 300 },
                { startX: 150, startY: 500, endX: 500, endY: 300 },
                { startX: 350, startY: 100, endX: 500, endY: 300 },
                { startX: 350, startY: 300, endX: 500, endY: 300 },
                { startX: 350, startY: 500, endX: 500, endY: 300 },
                { startX: 650, startY: 100, endX: 500, endY: 300 },
                { startX: 650, startY: 300, endX: 500, endY: 300 },
                { startX: 650, startY: 500, endX: 500, endY: 300 },
                { startX: 850, startY: 100, endX: 500, endY: 300 },
                { startX: 850, startY: 300, endX: 500, endY: 300 },
                { startX: 850, startY: 500, endX: 500, endY: 300 }
              ].map((line, index) => (
                <g key={index}>
                  <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: index * 0.1 }}
                    viewport={{ once: true }}
                    d={`M${line.startX},${line.startY} L${line.endX},${line.endY}`}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="3"
                    strokeDasharray="10,10"
                    fill="none"
                    className="animate-pulse"
                  />
                  <motion.circle
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    cx={line.endX}
                    cy={line.endY}
                    r="12"
                    fill="rgba(255,255,255,0.3)"
                    className="animate-pulse"
                  />
                </g>
              ))}
            </svg>

            {/* Center Chatbot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 45 }} // 90 degrees to the right
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="absolute z-30"
              style={{ 
                left: '535px',
                top: '205px',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl transform rotate-45 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-2xl transform rotate-45 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
                  <img 
                    src="/dodgelogo.png" 
                    alt="Dodge Logo" 
                    className="w-16 h-16 object-contain filter brightness-0 invert"
                  />
                </div>
              </div>
            </motion.div>

            {/* Left Technologies */}
            <div className="absolute left-[5%] top-0 w-[40%] h-full">
              {[
                { icon: "⚛️", name: "React", color: "from-green-400 to-green-600", x: "15%", y: "10%" },
                { icon: "🚀", name: "Node.js", color: "from-green-400 to-green-600", x: "15%", y: "30%" },
                { icon: "🔷", name: "TypeScript", color: "from-green-400 to-green-600", x: "15%", y: "50%" },
                { icon: "⚡", name: "Next.js", color: "from-green-400 to-green-600", x: "15%", y: "70%" },
                { icon: "🎨", name: "Tailwind", color: "from-green-400 to-green-600", x: "15%", y: "90%" },
                { icon: "📦", name: "Webpack", color: "from-green-400 to-green-600", x: "35%", y: "20%" },
                { icon: "🔍", name: "ESLint", color: "from-red-400 to-red-600", x: "35%", y: "40%" },
                { icon: "🎯", name: "Jest", color: "from-green-400 to-green-600", x: "35%", y: "60%" },
                { icon: "📱", name: "React Native", color: "from-green-400 to-green-600", x: "35%", y: "80%" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute"
                  style={{ left: tech.x, top: tech.y }}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {tech.icon}
                  </div>
                  <div className="absolute left-20 top-1/2 -translate-y-1/2 text-white font-medium whitespace-nowrap">
                    {tech.name}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Technologies */}
            <div className="absolute right-[5%] top-0 w-[40%] h-full">
              {[
                { icon: "🗄️", name: "MongoDB", color: "from-green-400 to-green-600", x: "65%", y: "10%" },
                { icon: "⚡", name: "Redis", color: "from-red-400 to-red-600", x: "65%", y: "30%" },
                { icon: "🔐", name: "AWS", color: "from-orange-400 to-orange-600", x: "65%", y: "50%" },
                { icon: "🐘", name: "PostgreSQL", color: "from-green-400 to-green-600", x: "65%", y: "70%" },
                { icon: "🔑", name: "JWT", color: "from-green-400 to-green-600", x: "65%", y: "90%" },
                { icon: "🔄", name: "GraphQL", color: "from-pink-400 to-pink-600", x: "85%", y: "20%" },
                { icon: "🔒", name: "OAuth", color: "from-blue-400 to-blue-600", x: "85%", y: "40%" },
                { icon: "📊", name: "Docker", color: "from-green-400 to-green-600", x: "85%", y: "60%" },
                { icon: "⚙️", name: "Kubernetes", color: "from-green-400 to-green-600", x: "85%", y: "80%" }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute"
                  style={{ left: tech.x, top: tech.y }}
                >
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-3xl shadow-lg transform hover:scale-110 transition-transform duration-300 relative z-10`}>
                    {tech.icon}
                  </div>
                  <div className="absolute right-20 top-1/2 -translate-y-1/2 text-white font-medium whitespace-nowrap">
                    {tech.name}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `float ${5 + Math.random() * 5}s infinite ease-in-out`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block"
            >
              Tailored Solutions
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              Industries We Serve
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"
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
                className="group bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col"
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
                    <h3 className="text-xl font-semibold text-gray-900">{industry.name}</h3>
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
        </div>
      </section>
    </div>
  );
};

export default HomePage;