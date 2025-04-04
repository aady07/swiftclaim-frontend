import React, { useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { 
  FiFile, 
  FiCode, 
  FiDownload, 
  FiCopy, 
  FiChevronDown, 
  FiChevronRight,
  FiServer,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo
} from "react-icons/fi";

const APIDocumentation = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState("requestParams");
  const [copiedText, setCopiedText] = useState("");
  
  const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];
  const color = useMotionValue(COLORS_TOP[0]);
  
 /* useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);*/

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`linear-gradient(to bottom, #0f172a, #1e293b)`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const requestSample = `curl -X POST https://aadybackend.site/api/upload \\
  -F "file=@damage_photo.jpg" \\
  -F "carMake=Toyota" \\
  -F "carModel=Camry"`;

  const responseSample = `{
  "model1_output": [
    {
      "confidence": 0.9991,
      "file_format": "jpg",
      "label": "damage",
      "output_image_base64": "data:image/jpg;base64,..."
    }
  ],
  "model2_output": [
    {
      "output2_image_base64": "data:image/jpg;base64,..."
    }
  ],
  "parts": ["boot-dent", "rear-bumper-dent"],
  "cost": ["5,000 - 15,000", "3,000 - 7,000"]
}`;

  const nodeJsSample = `const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadDamageImage() {
  const formData = new FormData();
  formData.append('file', fs.createReadStream('damage_photo.jpg'));
  formData.append('carMake', 'Toyota');
  formData.append('carModel', 'Camry');

  try {
    const response = await axios.post(
      'https://aadybackend.site/api/upload',
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

uploadDamageImage();`;

  const pythonSample = `import requests

def upload_damage_image():
    url = 'https://aadybackend.site/api/upload'
    
    # Prepare the form data
    files = {'file': open('damage_photo.jpg', 'rb')}
    data = {
        'carMake': 'Toyota',
        'carModel': 'Camry'
    }
    
    # Make the POST request
    response = requests.post(url, files=files, data=data)
    
    # Check if the request was successful
    if response.status_code == 200:
        print('Success!')
        return response.json()
    else:
        print(f'Error: {response.status_code}')
        print(response.text)

result = upload_damage_image()
print(result)`;

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-nile-900 px-4 py-16 text-gray-200"
      style={{
        backgroundImage,
        backgroundPosition: `center`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center max-w-5xl mx-auto"
      >
        <motion.span 
          variants={fadeInUp}
          className="mb-1.5 inline-block rounded-full bg-gray-800/70 backdrop-blur-md px-4 py-1.5 text-sm font-medium tracking-wider"
        >
          DEVELOPER RESOURCES
        </motion.span>
        
        <motion.h1 
          variants={fadeInUp}
          className="max-w-3xl bg-gradient-to-br from-gray-200 to-gray-400 bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl"
        >
          Car Damage Verification API
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="my-6 max-w-xl text-center text-lg leading-relaxed md:text-xl text-gray-300"
        >
          Integrate our AI-powered damage detection and cost estimation API into your insurance workflow.
        </motion.p>

        {/* API Documentation Tabs */}
        <motion.div 
          variants={fadeInUp}
          className="w-full max-w-4xl mb-8 flex flex-wrap justify-center border-b border-gray-700"
        >
          {[
            { id: "overview", label: "Overview" },
            { id: "authentication", label: "Authentication" },
            { id: "endpoints", label: "Endpoints" },
            { id: "examples", label: "Code Examples" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id 
                ? "border-b-2 text-blue-400 border-blue-400" 
                : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>
                
        {/* Main Documentation Area */}
        <motion.div 
          variants={fadeInUp}
          className="w-full max-w-4xl"
        >
          <motion.div
            className="p-8 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
            style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }}
          >
            {/* Overview Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                    <FiInfo size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">About the API</h3>
                    <p className="text-gray-300 mb-4">
                      Our Car Damage Verification API leverages advanced AI models to analyze images of damaged vehicles.
                      The API detects damage presence, identifies affected parts, and provides repair cost estimates
                      to streamline the insurance claims process.
                    </p>
                  </div>
                </div>

                <motion.div
                  className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
                  style={{ transition: "all 0.3s ease" }}
                >
                  <h4 className="font-medium text-lg mb-2">Base URL</h4>
                  <div className="flex items-center justify-between bg-gray-900 p-3 rounded-md">
                    <code className="font-mono text-green-400">https://aadybackend.site/api/upload</code>
                    <button 
                      onClick={() => handleCopyCode("https://aadybackend.site/api/upload")}
                      className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                    >
                      {copiedText === "https://aadybackend.site/api/upload" ? 
                        <FiCheckCircle className="text-green-500" /> : 
                        <FiCopy className="text-gray-400" />
                      }
                    </button>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="p-3 rounded-full bg-green-500/20 text-green-400 mb-3">
                        <FiCheckCircle size={24} />
                      </div>
                      <h4 className="font-medium mb-2">Damage Detection</h4>
                      <p className="text-sm text-gray-400">
                        Identify if there is damage present and get confidence scores.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 mb-3">
                        <FiServer size={24} />
                      </div>
                      <h4 className="font-medium mb-2">Parts Identification</h4>
                      <p className="text-sm text-gray-400">
                        Automatically identify damaged car parts with precision.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <div className="flex flex-col items-center text-center p-4">
                      <div className="p-3 rounded-full bg-yellow-500/20 text-yellow-400 mb-3">
                        <FiDownload size={24} />
                      </div>
                      <h4 className="font-medium mb-2">Cost Estimation</h4>
                      <p className="text-sm text-gray-400">
                        Get repair cost estimates for each damaged part.
                      </p>
                    </div>
                  </motion.div>
                </div>
                
                <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-3">
                    <FiAlertTriangle className="text-yellow-400 mr-2" />
                    <h4 className="font-medium">Rate Limits</h4>
                  </div>
                  <ul className="list-disc pl-5 text-gray-300 space-y-1 text-sm">
                    <li>Free tier: 50 requests per day</li>
                    <li>Professional tier: 1,000 requests per day</li>
                    <li>Enterprise tier: Custom limits available</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Authentication Content */}
            {activeTab === "authentication" && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                    <FiCode size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Authentication</h3>
                    <div className="text-gray-300 mb-4">
                      <p className="mb-4">
                        Currently, the API does not require authentication. This will be implemented in future versions.
                      </p>
                      <p className="mb-4">
                        When authentication is implemented, you will need to include an API key in the request headers:
                      </p>
                      <div className="bg-gray-800/50 p-4 rounded-lg font-mono text-sm mb-4">
                        <code className="text-green-400">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                      <p>
                        To obtain an API key, please contact our support team at <span className="text-blue-400">api-support@aadybackend.site</span>.
                      </p>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                  whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)" }}
                  style={{ transition: "all 0.3s ease" }}
                >
                  <h4 className="font-medium text-lg mb-2">API Key Management</h4>
                  <p className="text-gray-300 mb-4">
                    When authentication is implemented, you will be able to manage your API keys through our developer dashboard.
                  </p>
                  <div className="bg-gray-900 p-4 rounded-md">
                    <ul className="list-disc pl-5 text-gray-300 space-y-2 text-sm">
                      <li>Generate and revoke API keys</li>
                      <li>Monitor API usage and rate limits</li>
                      <li>Set permissions and access controls</li>
                      <li>View billing information</li>
                    </ul>
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* Endpoints Content */}
            {activeTab === "endpoints" && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                    <FiServer size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">API Endpoints</h3>
                    <p className="text-gray-300 mb-2">
                      Currently, our API provides a single endpoint for vehicle damage analysis.
                    </p>
                  </div>
                </div>
                
                <motion.div
                  className="border border-gray-700 rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-gray-800 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="inline-block px-3 py-1 mr-3 rounded-md bg-green-500/20 text-green-400 text-sm font-medium">POST</span>
                      <span className="font-mono text-gray-200">/api/upload</span>
                    </div>
                    <span className="text-sm text-gray-400">Upload & Analyze Vehicle Images</span>
                  </div>
                  <div className="bg-gray-900/50 p-4">
                    <p className="text-gray-300 mb-4">
                      Submits a vehicle damage image for AI analysis and verification.
                    </p>
                    
                    {/* Request Parameters */}
                    <div className="mb-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer mb-2"
                        onClick={() => setExpandedSection(expandedSection === "requestParams" ? "" : "requestParams")}
                      >
                        <h4 className="text-lg font-medium">Request Parameters</h4>
                        {expandedSection === "requestParams" ? 
                          <FiChevronDown className="text-gray-400" /> : 
                          <FiChevronRight className="text-gray-400" />
                        }
                      </div>
                      
                      {expandedSection === "requestParams" && (
                        <div className="bg-gray-800/70 rounded-lg overflow-hidden mb-2">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="p-3 text-sm font-medium text-gray-300">Parameter</th>
                                <th className="p-3 text-sm font-medium text-gray-300">Type</th>
                                <th className="p-3 text-sm font-medium text-gray-300">Required</th>
                                <th className="p-3 text-sm font-medium text-gray-300">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-700">
                                <td className="p-3 font-mono text-sm">file</td>
                                <td className="p-3 text-sm">File</td>
                                <td className="p-3 text-sm">Yes</td>
                                <td className="p-3 text-sm">Image file of the damaged vehicle (JPG, PNG format)</td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="p-3 font-mono text-sm">carMake</td>
                                <td className="p-3 text-sm">String</td>
                                <td className="p-3 text-sm">Yes</td>
                                <td className="p-3 text-sm">Manufacturer of the vehicle (e.g., "Toyota")</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-mono text-sm">carModel</td>
                                <td className="p-3 text-sm">String</td>
                                <td className="p-3 text-sm">Yes</td>
                                <td className="p-3 text-sm">Model of the vehicle (e.g., "Camry")</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    
                    {/* Response Format */}
                    <div className="mb-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer mb-2"
                        onClick={() => setExpandedSection(expandedSection === "responseFormat" ? "" : "responseFormat")}
                      >
                        <h4 className="text-lg font-medium">Response Format</h4>
                        {expandedSection === "responseFormat" ? 
                          <FiChevronDown className="text-gray-400" /> : 
                          <FiChevronRight className="text-gray-400" />
                        }
                      </div>
                      
                      {expandedSection === "responseFormat" && (
                        <div className="bg-gray-800/70 rounded-lg mb-2">
                          <div className="p-4">
                            <p className="mb-3 text-sm text-gray-300">
                              The API returns a JSON object with the following structure:
                            </p>
                            <div className="relative">
                              <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto font-mono text-sm">
                                <code className="text-green-400">
                                  {JSON.stringify({
                                    model1_output: [{
                                      confidence: 0.9991,
                                      file_format: "jpg",
                                      label: "damage",
                                      output_image_base64: "data:image/jpg;base64,..."
                                    }],
                                    model2_output: [{
                                      output2_image_base64: "data:image/jpg;base64,..."
                                    }],
                                    parts: ["boot-dent", "rear-bumper-dent"],
                                    cost: ["5,000 - 15,000", "3,000 - 7,000"]
                                  }, null, 2)}
                                </code>
                              </pre>
                              <button 
                                onClick={() => handleCopyCode(responseSample)}
                                className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-md transition-colors"
                              >
                                {copiedText === responseSample ? 
                                  <FiCheckCircle className="text-green-500" /> : 
                                  <FiCopy className="text-gray-400" />
                                }
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 border-t border-gray-700">
                            <h5 className="font-medium mb-2">Response Fields</h5>
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="p-2 text-sm font-medium text-gray-300">Field</th>
                                  <th className="p-2 text-sm font-medium text-gray-300">Description</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm">
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">model1_output</td>
                                  <td className="p-2">Array containing damage detection results</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">└─ confidence</td>
                                  <td className="p-2">Confidence score for damage detection (0-1)</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">└─ file_format</td>
                                  <td className="p-2">Format of the processed image</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">└─ label</td>
                                  <td className="p-2">"damage" or "no-damage"</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">└─ output_image_base64</td>
                                  <td className="p-2">Base64 encoded image with damage detection</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">model2_output</td>
                                  <td className="p-2">Array containing parts detection results</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">└─ output2_image_base64</td>
                                  <td className="p-2">Base64 encoded image with parts detection</td>
                                </tr>
                                <tr className="border-b border-gray-700">
                                  <td className="p-2 font-mono">parts</td>
                                  <td className="p-2">Array of identified damaged parts</td>
                                </tr>
                                <tr>
                                  <td className="p-2 font-mono">cost</td>
                                  <td className="p-2">Array of cost estimates for each damaged part</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status Codes */}
                    <div>
                      <div 
                        className="flex items-center justify-between cursor-pointer mb-2"
                        onClick={() => setExpandedSection(expandedSection === "statusCodes" ? "" : "statusCodes")}
                      >
                        <h4 className="text-lg font-medium">Status Codes</h4>
                        {expandedSection === "statusCodes" ? 
                          <FiChevronDown className="text-gray-400" /> : 
                          <FiChevronRight className="text-gray-400" />
                        }
                      </div>
                      
                      {expandedSection === "statusCodes" && (
                        <div className="bg-gray-800/70 rounded-lg overflow-hidden">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="p-3 text-sm font-medium text-gray-300">Code</th>
                                <th className="p-3 text-sm font-medium text-gray-300">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-700">
                                <td className="p-3 font-mono text-sm">200 OK</td>
                                <td className="p-3 text-sm">Request successful</td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="p-3 font-mono text-sm">400 Bad Request</td>
                                <td className="p-3 text-sm">Missing required parameters or invalid file format</td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="p-3 font-mono text-sm">413 Payload Too Large</td>
                                <td className="p-3 text-sm">File size exceeds the maximum limit (10MB)</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-mono text-sm">500 Internal Server Error</td>
                                <td className="p-3 text-sm">Server error processing the request</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* Code Examples Content */}
            {activeTab === "examples" && (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-500/20 text-blue-400">
                    <FiCode size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Code Examples</h3>
                    <p className="text-gray-300 mb-2">
                      Implement our API using the examples below for various programming languages.
                    </p>
                  </div>
                </div>
                
                {/* Code Example Tabs */}
                <div className="flex flex-wrap border-b border-gray-700 mb-4">
                  {[
                    { id: "curl", label: "cURL" },
                    { id: "javascript", label: "JavaScript" },
                    { id: "python", label: "Python" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setExpandedSection(lang.id)}
                      className={`px-4 py-2 text-sm transition-colors ${
                        expandedSection === lang.id 
                        ? "border-b-2 text-blue-400 border-blue-400" 
                        : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
                
                {/* cURL Example */}
                {expandedSection === "curl" && (
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                      <code className="text-green-400">
                        {requestSample}
                      </code>
                    </pre>
                    <button 
                     onClick={() => handleCopyCode(requestSample)}
                     className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-md transition-colors"
                   >
                     {copiedText === requestSample ? 
                       <FiCheckCircle className="text-green-500" /> : 
                       <FiCopy className="text-gray-400" />
                     }
                   </button>
                 </motion.div>
               )}
               
               {/* JavaScript Example */}
               {expandedSection === "javascript" && (
                 <motion.div
                   className="relative"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                 >
                   <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                     <code className="text-green-400">
                       {nodeJsSample}
                     </code>
                   </pre>
                   <button 
                     onClick={() => handleCopyCode(nodeJsSample)}
                     className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-md transition-colors"
                   >
                     {copiedText === nodeJsSample ? 
                       <FiCheckCircle className="text-green-500" /> : 
                       <FiCopy className="text-gray-400" />
                     }
                   </button>
                 </motion.div>
               )}
               
               {/* Python Example */}
               {expandedSection === "python" && (
                 <motion.div
                   className="relative"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                 >
                   <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                     <code className="text-green-400">
                       {pythonSample}
                     </code>
                   </pre>
                   <button 
                     onClick={() => handleCopyCode(pythonSample)}
                     className="absolute top-2 right-2 p-2 hover:bg-gray-800 rounded-md transition-colors"
                   >
                     {copiedText === pythonSample ? 
                       <FiCheckCircle className="text-green-500" /> : 
                       <FiCopy className="text-gray-400" />
                     }
                   </button>
                 </motion.div>
               )}
               
               <div className="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                 <h4 className="font-medium mb-2 flex items-center">
                   <FiInfo className="mr-2 text-blue-400" />
                   Implementation Notes
                 </h4>
                 <ul className="list-disc pl-5 text-gray-300 space-y-2 text-sm">
                   <li>All requests must be sent as <code className="bg-gray-900 px-1 py-0.5 rounded text-xs">multipart/form-data</code> to properly upload the image file.</li>
                   <li>Maximum image size is 10MB.</li>
                   <li>Supported image formats: JPG, PNG.</li>
                   <li>For optimal results, ensure the image clearly shows the damaged areas.</li>
                   <li>Response processing time may vary based on image complexity and API load.</li>
                 </ul>
               </div>
               
               <div className="flex items-center justify-center mt-8">
                 <a 
                   href="#" 
                   className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
                 >
                   <FiDownload className="mr-2" />
                   Download API Documentation
                 </a>
               </div>
             </div>
           )}
         </motion.div>
       </motion.div>
     </motion.div>
     
     {/* 3D Background Effect */}
     {/* 3D Background Effect - Fixed Position */}
{/* 3D Background Effect - Fixed Position */}
<div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
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
</div>
   </motion.div>
 );
};

export default APIDocumentation;