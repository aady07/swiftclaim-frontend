import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";

const Legal = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);

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

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>Legal Information | Miraista</title>
        <meta name="description" content="Legal information, terms of service, and privacy policy for Miraista - A brand of NexoraTrading Ventures PVT LTD." />
        <meta name="keywords" content="legal information, terms of service, privacy policy, Miraista legal, company information" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[50vh] overflow-hidden">
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
          className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-[50vh]"
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
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Legal Information
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Important legal information about Miraista and our services
            </motion.p>
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

      {/* Main content */}
      <div className="relative -mt-1 bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950"></div>
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-lg mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Company Information</h2>
              <div className="w-20 h-1 bg-blue-500 mb-6"></div>
              <p className="text-gray-300 mb-4">
                Miraista is a brand and brand of NexoraTrading Ventures PVT LTD, a registered company in India. Our parent company provides the legal framework and foundation for our innovative AI solutions.
              </p>
              <p className="text-gray-300">
                <strong>Parent Company:</strong> NexoraTrading Ventures PVT LTD<br />
                <strong>Brand Name:</strong> Miraista<br />
                <strong>Website:</strong> www.miraista.com
              </p>
            </motion.div>

            {/* Terms of Service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-lg mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Terms of Service</h2>
              <div className="w-20 h-1 bg-blue-500 mb-6"></div>
              <p className="text-gray-300 mb-4">
                By accessing and using Miraista's services, you agree to comply with and be bound by these terms of service. Please read these terms carefully before using our services.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h3>
                  <p className="text-gray-300">By accessing or using our services, you agree to be bound by these Terms of Service.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2. Use of Services</h3>
                  <p className="text-gray-300">Our services are provided for legitimate business purposes only.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3. Intellectual Property</h3>
                  <p className="text-gray-300">All content and materials available through our services are protected by intellectual property rights.</p>
                </div>
              </div>
            </motion.div>

            {/* Privacy Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 p-8 rounded-xl border border-gray-700 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Privacy Policy</h2>
              <div className="w-20 h-1 bg-blue-500 mb-6"></div>
              <p className="text-gray-300 mb-4">
                We are committed to protecting your privacy and handling your data with transparency and care.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">1. Data Collection</h3>
                  <p className="text-gray-300">We collect information necessary to provide and improve our services.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2. Data Usage</h3>
                  <p className="text-gray-300">Your data is used to provide, maintain, and improve our services.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">3. Data Protection</h3>
                  <p className="text-gray-300">We implement appropriate security measures to protect your information.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal; 