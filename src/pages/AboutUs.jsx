    import React, { useRef, useState, useEffect } from "react";
    import { motion, useScroll, useTransform } from "framer-motion";

    const AboutUs = () => {
      const { scrollYProgress } = useScroll();
      const teamRef = useRef(null);

      const teamMembers = [
        { 
          name: "Rachit", 
          role: "AI Research Lead", 
          image: "/images/rachit.jpg", 
          bio: "PhD in Machine Learning, with 10+ years of experience in deep learning and neural networks. Passionate about hiking and landscape photography." 
        },
        { 
          name: "Bharat Parmar", 
          role: "Chief Innovation Officer", 
          image: "/images/bharat.jpg", 
          bio: "Expert in scalable AI systems with previous roles at Google AI and OpenAI. Avid coffee enthusiast and chess player." 
        },
        { 
          name: "Adarsh ", 
          role: "Senior Software Architect", 
          image: "/images/adarsh.jpg", 
          bio: "Full-stack developer specialized in AI implementation. Has built solutions for Fortune 500 companies. Soccer fan and amateur guitarist." 
        },
      ];

      const values = [
        { 
          title: "Pioneering Innovation", 
          description: "We constantly push the boundaries of what's possible with AI.", 
          icon: "/images/innovation-icon.png" 
        },
        { 
          title: "Ethical Intelligence", 
          description: "Our AI solutions are built with integrity and responsibility at their core.", 
          icon: "/images/integrity-icon.png" 
        },
        { 
          title: "Collaborative Excellence", 
          description: "We believe great ideas emerge from diverse teams working in harmony.", 
          icon: "/images/collaboration-icon.png" 
        },
        { 
          title: "Relentless Pursuit", 
          description: "We're never satisfied with 'good enough' – we strive for excellence in everything.", 
          icon: "/images/excellence-icon.png" 
        },
      ];

      const milestones = [
        { year: 2018, title: "Founded", description: "Started with a team of 3 AI enthusiasts." },
        { year: 2020, title: "First Major Client", description: "Partnered with Fortune 500 companies." },
        { year: 2021, title: "Expansion", description: "Expanded to international markets." },
        { year: 2023, title: "Innovation Award", description: "Recognized as a leading AI innovator." },
        { year: 2024, title: "Today", description: "A team of expert AI professionals changing the world." },
      ];

      const testimonials = [
        {
          quote: "Techiees.AI transformed our approach to data analysis with cutting-edge AI solutions.",
          author: "Sarah Johnson",
          position: "CTO, GlobalTech",
          image: "/images/testimonial1.jpg"
        },
        {
          quote: "Their innovative AI platform helped us increase efficiency by 200% within months.",
          author: "Michael Chen",
          position: "CEO, FutureCorp",
          image: "/images/testimonial2.jpg"
        },
        {
          quote: "The team's expertise in machine learning algorithms is unmatched in the industry.",
          author: "Jessica Williams",
          position: "Head of Innovation, TechGiant",
          image: "/images/testimonial3.jpg"
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

      // Parallax effect
      const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
      const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
      
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
            <h3 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              {count}+
            </h3>
            <p className="text-gray-300 mt-2 text-lg">{label}</p>
          </div>
        );
      };
      
      // Testimonial slider
      const [currentTestimonial, setCurrentTestimonial] = useState(0);
      
      useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        
        return () => clearInterval(interval);
      }, [testimonials.length]);

      return (
        <motion.section 
          initial="hidden" 
          animate="visible" 
          className="relative bg-gray-950 text-gray-200 overflow-hidden"
        >
          {/* Hero Section */}
          <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-900" />
            
            {/* Animated Particles */}
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
            
            {/* Hero Content */}
            <motion.div 
              className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center min-h-screen"
              style={{ opacity: heroOpacity, y: heroY }}
            >
              <motion.h1
                variants={fadeInUp}
                className="max-w-4xl text-center text-5xl font-bold text-white sm:text-7xl mb-6"
              >
                <span className="block">Welcome to</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  Techiees.AI
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="my-6 max-w-2xl text-center text-xl md:text-2xl text-gray-200"
              >
                We are innovators in AI solutions, dedicated to transforming businesses with cutting-edge technology.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-4 mt-8 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg text-lg font-medium"
                >
                  Our Services
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-transparent border-2 border-blue-500 text-white rounded-lg text-lg font-medium"
                >
                  Contact Us
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
          

          {/* Our Story Section */}
          <div className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
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
                  Our Journey
                </motion.h6>
                <motion.h2 
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  The Techiees.AI Story
                </motion.h2>
                <motion.div 
                  variants={fadeInUp}
                  className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
                />
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-3xl font-bold text-white mb-6">From Vision to Reality</h3>
                  <p className="text-lg text-gray-300 mb-6">
                    Founded in 2018, Techiees.AI embarked on a mission to revolutionize the AI landscape. From humble beginnings in a small office with just three passionate AI enthusiasts, we've grown into a team of industry-leading experts dedicated to pushing the boundaries of what's possible with artificial intelligence.
                  </p>
                  <p className="text-lg text-gray-300">
                    Our journey has been marked by continuous innovation, strategic partnerships, and a relentless pursuit of excellence. Today, we're proud to work with clients across the globe, transforming businesses through our cutting-edge AI solutions.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="relative z-10 border-8 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
                    <img
                      src="/images/company-image.jpg"
                      alt="Company Journey"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="absolute top-10 -right-5 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg -z-10" />
                </motion.div>
              </div>
              
              {/* Timeline */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="mt-24"
              >
                <motion.h3 
                  variants={fadeInUp}
                  className="text-3xl font-bold text-center mb-12"
                >
                  Our Timeline
                </motion.h3>
                
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
                  
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="relative mb-16 flex items-center"
                    >
                      {/* Timeline Point */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-blue-500 border-4 border-gray-900 z-10" />
                      
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 ml-auto'}`}>
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                          <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-500/20 text-blue-300 rounded-full mb-2">
                            {milestone.year}
                          </span>
                          <h4 className="text-xl font-bold text-white mb-2">{milestone.title}</h4>
                          <p className="text-gray-300">{milestone.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Our Vision Section */}
          <div className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Our Vision</h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed">
                  To pioneer the frontier of artificial intelligence by creating solutions that empower businesses to achieve unprecedented success and drive technological advancement across industries worldwide.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-blue-700 rounded-lg shadow-lg font-medium"
                >
                  Learn More About Our Approach
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Team Section */}
          <div ref={teamRef} className="py-20 bg-gray-900">
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
                  className="text-blue-400 uppercase tracking-wider mb-2"
                >
                  The Minds Behind Our Success
                </motion.h6>
                <motion.h2 
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Meet Our Team
                </motion.h2>
                <motion.div 
                  variants={fadeInUp}
                  className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
                />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-xl"
                  >
                    <div className="h-80 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-80" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                      <p className="text-blue-300 mb-2">{member.role}</p>
                      <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="py-20 bg-gradient-to-b from-blue-900 to-gray-900">
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
                  className="text-blue-400 uppercase tracking-wider mb-2"
                >
                  What Drives Us
                </motion.h6>
                <motion.h2 
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  Our Core Values
                </motion.h2>
                <motion.div 
                  variants={fadeInUp}
                  className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
                />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                    className="bg-gray-800 rounded-xl overflow-hidden p-8 shadow-lg border border-gray-700"
                  >
                    <div className="h-16 w-16 mb-6 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                      <img
                        src={value.icon}
                        alt={value.title}
                        className="w-8 h-8"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 text-center">{value.title}</h3>
                    <p className="text-gray-300 text-center">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="py-20 bg-gray-900">
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
                  className="text-blue-400 uppercase tracking-wider mb-2"
                >
                  Client Feedback
                </motion.h6>
                <motion.h2 
                  variants={fadeInUp}
                  className="text-4xl md:text-5xl font-bold mb-4"
                >
                  What Our Clients Say
                </motion.h2>
                <motion.div 
                  variants={fadeInUp}
                  className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"
                />
              </motion.div>
              
              <div className="relative overflow-hidden py-10 max-w-4xl mx-auto">
                <div className="relative h-64">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: currentTestimonial === index ? 1 : 0,
                        x: currentTestimonial === index ? 0 : currentTestimonial > index ? -100 : 100
                      }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex flex-col items-center text-center"
                    >
                      <div className="mb-6 h-20 w-20 overflow-hidden rounded-full border-4 border-blue-500 shadow-lg">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xl md:text-2xl text-gray-200 mb-6 italic">
                        "{testimonial.quote}"
                      </p>
                      <h4 className="text-lg font-semibold text-white">{testimonial.author}</h4>
                      <p className="text-blue-400">{testimonial.position}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentTestimonial === index ? "w-8 bg-blue-500" : "w-2 bg-gray-600"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="py-20 bg-gradient-to-b from-gray-900 to-blue-900">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <CountUp end={5} label="Years in Business" />
                <CountUp end={100} label="Clients Served" />
                <CountUp end={50} label="AI Projects Delivered" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white rounded-full"
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
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Ready to Transform Your Business with AI?
                </h2>
                <p className="text-xl text-blue-100 mb-10">
                  Let's discuss how our AI solutions can help you achieve unprecedented growth and efficiency.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-blue-700 rounded-lg shadow-xl font-bold text-lg"
                >
                  Schedule a Consultation
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>
      );
    };

    export default AboutUs;