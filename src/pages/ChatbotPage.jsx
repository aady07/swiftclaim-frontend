import React from "react";
import { Link } from "react-router-dom";
import Chatbot3D from "../components/chatbot/Chatbot3D";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const ChatbotPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      <Helmet>
        <title>AI Chatbot Assistant | Miraista - Intelligent Virtual Support</title>
        <meta name="description" content="Experience Miraista's advanced AI chatbot powered by cutting-edge technology. Our intelligent virtual assistant provides instant support, answers queries, and helps streamline your business processes with natural language understanding and real-time responses." />
        <meta name="keywords" content="AI chatbot, virtual assistant, intelligent chatbot, Miraista chatbot, AI support, business automation, conversational AI, natural language processing, virtual support, automated assistance" />
        <meta property="og:title" content="AI Chatbot Assistant | Miraista - Intelligent Virtual Support" />
        <meta property="og:description" content="Experience our advanced AI chatbot powered by cutting-edge technology. Get instant support and streamline your business processes with our intelligent virtual assistant." />
        <meta property="og:url" content="https://www.miraista.com/chatbot" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.miraista.com/images/chatbot-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Chatbot Assistant | Miraista - Intelligent Virtual Support" />
        <meta name="twitter:description" content="Experience our advanced AI chatbot powered by cutting-edge technology. Get instant support and streamline your business processes." />
        <meta name="twitter:image" content="https://www.miraista.com/images/chatbot-preview.jpg" />
        <link rel="canonical" href="https://www.miraista.com/chatbot" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Miraista" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Miraista AI Chatbot",
            "description": "Advanced AI-powered virtual assistant for business support and automation",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Natural language processing",
              "Real-time responses",
              "Business process automation",
              "24/7 availability",
              "Multi-language support"
            ]
          })}
        </script>
      </Helmet>
      
      {/* Background Gradient - Matched exactly with Service page */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
      
      {/* Animated Particles - Matched with Service page */}
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


      {/* Chatbot Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl mx-auto pt-24 pb-16 px-4 flex justify-center items-center min-h-screen text-black"
      >
        <Chatbot3D isFullPage={true} />
      </motion.div>
      
      {/* Bottom Wave SVG - Similar to Services page */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#111827"
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default ChatbotPage;