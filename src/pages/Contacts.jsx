import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiTwitter, FiFacebook, FiArrowLeft } from "react-icons/fi";
import DOMPurify from 'dompurify';
import { useForm } from '@formspree/react';
import { useNavigate } from "react-router-dom";
import { useScroll } from "framer-motion";
import { useTransform } from "framer-motion";
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

const Contacts = () => {
  const { scrollYProgress } = useScroll();
  const [state, formSubmit] = useForm("mrbpaklw");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());
  };

  const navigate = useNavigate();

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    const sanitizedName = sanitizeInput(formData.name);
    if (!sanitizedName) {
      newErrors.name = "Name is required";
    } else if (sanitizedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(sanitizedName)) {
      newErrors.name = "Name can only contain letters";
    }

    // Email validation
    const sanitizedEmail = sanitizeInput(formData.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedEmail) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(sanitizedEmail)) {
      newErrors.email = "Invalid email format";
    }

    // Subject validation
    const sanitizedSubject = sanitizeInput(formData.subject);
    if (!sanitizedSubject) {
      newErrors.subject = "Subject is required";
    } else if (sanitizedSubject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters long";
    }

    // Message validation
    const sanitizedMessage = sanitizeInput(formData.message);
    if (!sanitizedMessage) {
      newErrors.message = "Message is required";
    } else if (sanitizedMessage.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        await formSubmit(e);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
      } catch (error) {
        // Handle errors
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  if (state.succeeded) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-12 border border-gray-700/50 text-white text-center max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6"
          >
            <FiSend className="text-white text-3xl" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
          <p className="text-gray-300 mb-8">Your message has been successfully sent. We will get back to you shortly.</p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
          >
            <FiArrowLeft className="inline-block mr-2" /> Back to Contact
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>Contact Miraista - Get in Touch with Our AI Experts | Support & Inquiries</title>
        <meta name="description" content="Contact Miraista's team of AI experts for inquiries about our solutions, partnerships, or support. We're here to help transform your business with cutting-edge AI technology." />
        <meta name="keywords" content="contact Miraista, AI support, business inquiry, AI solutions contact, Miraista contact, AI experts, technical support, partnership inquiry" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.miraista.com/contact" />
        <meta property="og:title" content="Contact Miraista - Get in Touch with Our AI Experts | Support & Inquiries" />
        <meta property="og:description" content="Contact our team of AI experts. Get in touch for inquiries about our AI solutions, partnerships, or support." />
        <meta property="og:image" content="https://www.miraista.com/contact-og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.miraista.com/contact" />
        <meta property="twitter:title" content="Contact Miraista - Get in Touch with Our AI Experts | Support & Inquiries" />
        <meta property="twitter:description" content="Contact our team of AI experts. Get in touch for inquiries about our AI solutions, partnerships, or support." />
        <meta property="twitter:image" content="https://www.miraista.com/contact-og-image.jpg" />
        
        {/* Additional SEO tags */}
        <link rel="canonical" href="https://www.miraista.com/contact" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Miraista" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Miraista",
            "description": "Get in touch with Miraista's AI experts for support and inquiries",
            "mainEntity": {
              "@type": "Organization",
              "name": "Miraista",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91 9601185083",
                "contactType": "customer service",
                "email": "info@miraista.com",
                "availableLanguage": ["English"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              }
            }
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
              <span className="block mb-2">Get in Touch</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Let's Connect
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Have questions or want to learn more about our AI solutions? We're here to help you innovate and transform.
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/services")}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Our Services
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/about-us")}
                className="px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                About Us
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
        <div className="relative z-10 container mx-auto px-4 py-16">
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
              REACH OUT TO US
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-300 text-transparent bg-clip-text">
              Let's Connect
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              Have questions or want to learn more about our AI solutions? We're here to help you innovate and transform.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.2 }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {/* Contact Information Card */}
            <motion.div
              variants={fadeIn}
              className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50 h-full"
            >
              <h2 className="text-2xl font-bold mb-8 text-white">Contact Details</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <FiMail className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Email</h3>
                    <p className="text-white font-medium">info@miraista.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <FiPhone className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Phone</h3>
                    <p className="text-white font-medium">+91 9601185083</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <FiMapPin className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm mb-1">Location</h3>
                    <p className="text-white font-medium">India</p>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <h3 className="text-lg font-medium mb-4 text-white">Follow Us</h3>
              <div className="flex space-x-3">
                <motion.a 
                  href="https://www.linkedin.com/company/miraista" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-700/50 p-3 rounded-lg hover:bg-blue-600/50 transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <FiLinkedin className="text-white" size={18} />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-gray-700/50 p-3 rounded-lg hover:bg-blue-400/50 transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <FiTwitter className="text-white" size={18} />
                </motion.a>
                <motion.a 
                  href="mailto:info@miraista.com"
                  className="bg-gray-700/50 p-3 rounded-lg hover:bg-blue-800/50 transition-colors"
                  whileHover={{ y: -5 }}
                >
                  <FiMail className="text-white" size={18} />
                </motion.a>
              </div>
            </motion.div>

            {/* Contact Form - Spans 2 columns on larger screens */}
            <motion.div
              variants={fadeIn}
              className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold mb-6 text-white">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.name ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      disabled={isSubmitting}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.email ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      disabled={isSubmitting}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.subject ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    disabled={isSubmitting}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/30 text-white border ${errors.message ? 'border-red-500' : 'border-gray-600'} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    rows="5"
                    disabled={isSubmitting}
                    placeholder="Tell us more about your project or inquiry..."
                  ></textarea>
                  {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium text-lg shadow-lg shadow-blue-500/20"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FiSend className="mr-2" /> Send Message
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-gray-400 mt-4">Find quick answers to common questions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  question: "What services do you offer?",
                  answer: "We provide AI-powered solutions including data analysis, machine learning models, and custom AI integrations for businesses of all sizes."
                },
                {
                  question: "How quickly do you respond to inquiries?",
                  answer: "We aim to respond to all inquiries within 24 hours during business days."
                },
                {
                  question: "Do you offer custom solutions?",
                  answer: "Yes, we specialize in creating tailored AI solutions designed specifically for your business needs and challenges."
                },
                {
                  question: "How can I request technical support?",
                  answer: "Existing customers can contact our support team through this form or by emailing info@miraista.com."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                  whileHover={{ y: -5, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="mt-20"
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
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to transform with AI?</h2>
                  <p className="text-blue-100 max-w-xl">
                    Our team of experts is ready to help you implement cutting-edge AI solutions tailored to your business needs.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
              
                  <motion.button
                    className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate("/services")}

                    whileTap={{ scale: 0.95 }}
                  >
                    View Solutions
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Footer spacing - removed the footer itself from here */}
          <div className="mt-16"></div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;