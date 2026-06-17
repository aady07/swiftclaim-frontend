import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiCode, FiCopy, FiCheck, FiChevronDown, FiChevronUp, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import { Helmet } from "react-helmet";
  
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

const APIDocumentation = () => {
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [expandedEndpoint, setExpandedEndpoint] = useState(null);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 100]);

  const endpoints = [
    {
      id: "claim-upload",
      title: "Claim Upload",
      method: "POST",
      path: "/api/claims/upload",
      description: "Upload a new insurance claim for processing. This endpoint accepts claim documents and returns analysis results.",
      parameters: [
        { name: "file", type: "File", required: true, description: "The claim document to upload (JPG, PNG, PDF format)" },
        { name: "claimType", type: "String", required: true, description: "Type of insurance claim (e.g., 'health', 'auto', 'property')" },
        { name: "policyNumber", type: "String", required: true, description: "Policy number associated with the claim" },
        { name: "claimantName", type: "String", required: true, description: "Name of the claimant" },
        { name: "incidentDate", type: "String", required: true, description: "Date of the incident (YYYY-MM-DD format)" },
        { name: "description", type: "String", required: false, description: "Additional details about the claim" }
      ],
      example: `curl -X POST "https://uat-api.miraista.com/api/claims/upload" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@claim_document.pdf" \\
  -F "claimType=health" \\
  -F "policyNumber=POL123456" \\
  -F "claimantName=John Doe" \\
  -F "incidentDate=2024-03-15" \\
  -F "description=Medical expenses for emergency treatment"`,
      response: {
        success: `{
  "status": "success",
  "claimId": "CLM123456",
  "analysis": {
    "documentType": "medical_bill",
    "confidence": 0.98,
    "extractedData": {
      "provider": "City General Hospital",
      "amount": "2,500.00",
      "date": "2024-03-15",
      "services": ["Emergency Room", "X-Ray", "Medication"]
    },
    "verification": {
      "policyMatch": true,
      "dateValid": true,
      "amountWithinLimits": true
    }
  },
  "nextSteps": ["Review claim details", "Process payment", "Update policy status"]
}`,
        error: `{
  "status": "error",
  "code": "INVALID_FILE_FORMAT",
  "message": "Unsupported file format. Please upload JPG, PNG, or PDF files only.",
  "details": {
    "supportedFormats": ["jpg", "png", "pdf"],
    "maxSize": "10MB"
  }
}`
      },
      statusCodes: [
        { code: "200", description: "Success - Claim uploaded and processed" },
        { code: "400", description: "Bad Request - Invalid input parameters" },
        { code: "401", description: "Unauthorized - Invalid or missing API key" },
        { code: "413", description: "Payload Too Large - File size exceeds limit" },
        { code: "415", description: "Unsupported Media Type - Invalid file format" },
        { code: "500", description: "Internal Server Error - Processing failed" }
      ]
    },
    {
      id: "claim-status",
      title: "Get Claim Status",
      method: "GET",
      path: "/api/claims/{claimId}/status",
      description: "Retrieve the current status of a claim",
      parameters: [
        { name: "claimId", type: "String", required: true, description: "Unique identifier of the claim" }
      ],
      example: `curl -X GET "https://uat-api.miraista.com/api/claims/CLAIM123/status" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());
  };

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>API Documentation</title>
        <meta name="description" content="Comprehensive API documentation for Miraista's AI-powered claim processing system. Integrate our advanced AI solutions into your applications with detailed endpoints, examples, and guides." />
        <meta name="keywords" content="API documentation, AI integration, claim processing API, Miraista API, developer resources, AI endpoints" />
        <meta property="og:title" content="API Documentation | Miraista" />
        <meta property="og:description" content="Access comprehensive API documentation for Miraista's AI-powered claim processing system. Detailed guides, endpoints, and integration examples." />
        <meta property="og:url" content="https://www.miraista.com/api-documentation" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.miraista.com/api-documentation" />
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
              <span className="block mb-2">API Documentation</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Developer Resources
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Integrate our AI-powered claim processing system into your applications with our comprehensive API documentation.
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
                View Services
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/contacts")}
                className="px-8 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                Get API Key
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
      <div className="bg-gradient-to-b from-gray-900 to-black">
        <div className="relative z-10 container mx-auto px-4 py-16 pb-32">
          {/* API Overview Section */}
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium text-sm tracking-wider mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              DEVELOPER RESOURCES
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              API Endpoints
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg">
              Explore our comprehensive API documentation to integrate our AI-powered claim processing system into your applications.
            </p>
          </motion.div>

          {/* API Endpoints List */}
          <div className="max-w-4xl mx-auto space-y-8">
            {endpoints.map((endpoint) => (
              <motion.div
                key={endpoint.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      endpoint.method === 'GET' ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      <FiCode className={`text-xl ${
                        endpoint.method === 'GET' ? 'text-green-400' : 'text-blue-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{endpoint.title}</h3>
                      <p className="text-gray-400">{endpoint.path}</p>
                    </div>
                  </div>
                  {expandedEndpoint === endpoint.id ? (
                    <FiChevronUp className="text-gray-400" />
                  ) : (
                    <FiChevronDown className="text-gray-400" />
                  )}
                </div>

                {expandedEndpoint === endpoint.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-700/50"
                  >
                    <div className="p-6 space-y-6">
                      <div>
                        <h4 className="text-lg font-medium text-white mb-2">Description</h4>
                        <p className="text-gray-300">{endpoint.description}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium text-white mb-2">Parameters</h4>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="w-24">
                                <span className={`px-2 py-1 rounded text-sm ${
                                  param.required ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/50 text-gray-400'
                                }`}>
                                  {param.required ? 'Required' : 'Optional'}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{param.name}</p>
                                <p className="text-gray-400 text-sm">{param.type}</p>
                                <p className="text-gray-300 mt-1">{param.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {endpoint.statusCodes && (
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">Status Codes</h4>
                          <div className="space-y-2">
                            {endpoint.statusCodes.map((status, index) => (
                              <div key={index} className="flex items-start gap-4">
                                <div className="w-20">
                                  <span className="px-2 py-1 rounded text-sm bg-gray-700/50 text-gray-400">
                                    {status.code}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-gray-300">{status.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-medium text-white">Example Request</h4>
                          <button
                            onClick={() => handleCopy(endpoint.example)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
                          </button>
                        </div>
                        <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-gray-300">
                          <code>{endpoint.example}</code>
                        </pre>
                      </div>

                      {endpoint.response && (
                        <div>
                          <h4 className="text-lg font-medium text-white mb-2">Example Response</h4>
                          <div className="space-y-4">
                            <div>
                              <h5 className="text-md font-medium text-green-400 mb-2">Success Response</h5>
                              <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-gray-300">
                                <code>{endpoint.response.success}</code>
                              </pre>
                            </div>
                            <div>
                              <h5 className="text-md font-medium text-red-400 mb-2">Error Response</h5>
                              <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-gray-300">
                                <code>{endpoint.response.error}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
</div>
   </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Back to Home Button */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
            >
              <FiArrowLeft />
              Back to Home
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
 );
};

export default APIDocumentation;