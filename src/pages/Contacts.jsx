import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend, FiLinkedin, FiTwitter, FiFacebook } from "react-icons/fi";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (e.g., API call)
    console.log("Form submitted:", formData);
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
        {/* Hero Section */}
        <motion.span 
          variants={fadeInUp}
          className="mb-1.5 inline-block rounded-full bg-gray-600/70 backdrop-blur-md px-4 py-1.5 text-sm font-medium tracking-wider"
        >
          CONTACT US
        </motion.span>
        
        <motion.h1 
          variants={fadeInUp}
          className="max-w-3xl bg-gradient-to-br from-gray-200 to-white bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl"
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
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700/50 text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700/50 text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700/50 text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-700/50 text-gray-300"
                  rows="4"
                  required
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full py-3 rounded-lg bg-gray-700/70 hover:bg-gray-700 transition-colors text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiSend className="inline-block mr-2" /> Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            variants={fadeInUp}
            className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 border border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <FiMail className="text-blue-400 mr-3" />
                <span>support@techiees.ai</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-blue-400 mr-3" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="text-blue-400 mr-3" />
                <span>India</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FiLinkedin size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FiTwitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <FiFacebook size={24} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          variants={fadeInUp}
          className="w-full mt-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Location</h2>
          <div className="relative h-64 w-full rounded-xl overflow-hidden">
            {/* Embed your map here, e.g., Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d448196.5267132906!2d76.76357333036381!3d28.643795032341773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b715389640!2sDelhi%2C%20India!5e0!3m2!1sen!2sus!4v1698765432109!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
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
              <h3 className="text-3xl font-bold mb-4">Need Assistance?</h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                Our team is ready to help you with any questions or concerns. Reach out to us today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  className="px-8 py-3 rounded-lg bg-gray-950/30 text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Support
                </motion.button>
                <motion.button
                  className="px-8 py-3 rounded-lg border border-gray-500 text-gray-300"
                  whileHover={{ scale: 1.05, borderColor: "white" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back to Home
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

export default Contacts;