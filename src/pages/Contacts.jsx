import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiTwitter, FiFacebook } from "react-icons/fi";
import DOMPurify from 'dompurify';
import { useForm, ValidationError } from '@formspree/react';

// Animation variants for fade-in effects
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

const Contacts = () => {
    const [state, formSubmit] = useForm("mrbpaklw"); // Formspree form ID
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
            // Form is valid, proceed with submission
            try {
                await formSubmit(e); // submit to formspree
                // Reset form after successful submission
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: ""
                });
                setErrors({}); //clear errors
            } catch (error) {
                console.error("Form submission failed:", error);
                //handle errors with formspree
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
                className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-white text-center">
                    <p>Your message has been successfully sent. We will get back to you shortly.</p>
                </div>
            </motion.div>
        );
    }

    return (
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background particles - Updated to match HomePage style */}
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

        <motion.div
          variants={fadeInStagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center max-w-6xl mx-auto px-4 py-16"
        >
          {/* Hero Section */}
          <motion.span 
            variants={fadeInUp}
            className="mb-4 inline-block rounded-full bg-gray-800/70 px-4 py-1.5 text-sm font-medium tracking-wider"
          >
            CONTACT US
          </motion.span>
          
          <motion.h1 
            variants={fadeInUp}
            className="max-w-3xl bg-clip-text text-center text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Get in Touch
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="my-6 max-w-2xl text-center text-lg leading-relaxed md:text-xl text-gray-300"
          >
            Reach out to our team for inquiries, support, or collaboration opportunities. We're here to help you with our AI-powered solutions.
          </motion.p>

          {/* Contact Form and Information */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Contact Form */}
            <motion.div
              variants={fadeInUp}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <h2 className="text-2xl font-semibold mb-6 text-white">Send Us a Message</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/50 text-gray-300 ${errors.name ? 'border-2 border-red-500' : 'border border-gray-600'}`}
                    disabled={isSubmitting}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/50 text-gray-300 ${errors.email ? 'border-2 border-red-500' : 'border border-gray-600'}`}
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/50 text-gray-300 ${errors.subject ? 'border-2 border-red-500' : 'border border-gray-600'}`}
                    disabled={isSubmitting}
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg bg-gray-700/50 text-gray-300 ${errors.message ? 'border-2 border-red-500' : 'border border-gray-600'}`}
                    rows="4"
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  <FiSend className="inline-block mr-2" /> {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              variants={fadeInUp}
              className="bg-gray-800 rounded-xl p-8 border border-gray-700"
            >
              <h2 className="text-2xl font-semibold mb-6 text-white">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiMail className="text-white mr-3" />
                  <span className="text-white">customersupport@miraista.com</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="text-white mr-3" />
                  <span className="text-white">+91 9601185083</span>
                </div>
                <div className="flex items-center">
                  <FiMapPin className="text-white mr-3" />
                  <span className="text-white">India</span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FiLinkedin size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FiTwitter size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FiFacebook size={24} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            variants={fadeInUp}
            className="w-full py-20 mt-16"
          >
            <div className="rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 relative overflow-hidden">
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
              
              <div className="relative z-10 p-12 flex flex-col items-center text-center">
                <h3 className="text-3xl font-bold mb-4 text-white">Need Assistance?</h3>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                  Our team is ready to help you with any questions or concerns. Reach out to us today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    className="px-10 py-4 bg-white text-slate-700 rounded-lg shadow-xl font-bold text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Support
                  </motion.button>
                  <motion.button
                    className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to Home
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  export default Contacts;