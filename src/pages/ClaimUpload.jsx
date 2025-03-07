import { useState, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { FiUpload, FiArrowRight, FiCamera, FiFileText, FiCheckCircle, FiDownload, FiAlertTriangle } from "react-icons/fi";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const ClaimUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [scrollY, setScrollY] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [fileFormat, setFileFormat] = useState(null);
  const [damageLabel, setDamageLabel] = useState(null);
  const [rawResponse, setRawResponse] = useState(null);
  const color = useMotionValue(COLORS_TOP[0]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  useEffect(() => {
    // Clean up the object URL when component unmounts or when a new file is selected
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the selected image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploadStatus("uploading");
    // Reset previous results
    setConfidenceScore(null);
    setFileFormat(null);
    setDamageLabel(null);

    // Log the file being uploaded
    console.log("Uploading file:", selectedFile.name, selectedFile.size);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Send the file to the API endpoint
      const response = await fetch("https://aadybackend.site/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Parse and log the complete response
      const data = await response.json();
      console.log("Complete API response:", data);
      setRawResponse(data); // Store raw response for debugging
      
      // Handle different response formats
      if (Array.isArray(data)) {
        // Handle array format response
        data.forEach(item => {
          if (item.hasOwnProperty("Confidence") || item.hasOwnProperty("confidence")) {
            const confidence = (item.Confidence || item.confidence) * 100;
            setConfidenceScore(confidence.toFixed(2));
          }
          
          if (item.hasOwnProperty("Label") || item.hasOwnProperty("label")) {
            setDamageLabel(item.Label || item.label);
          }
          
          if (item.hasOwnProperty("fileformat") || item.hasOwnProperty("file_format")) {
            setFileFormat(item.fileformat || item.file_format);
          }
          
          if (item.hasOwnProperty("output_image_base64") || item.hasOwnProperty("file_data")) {
            const base64Data = item.output_image_base64 || item.file_data;
            if (base64Data && typeof base64Data === 'string') {
              setPreviewUrl(`data:image/${fileFormat || 'png'};base64,${base64Data}`);
            }
          }
        });
      } else if (typeof data === 'object') {
        // Handle object format response
        if (data.hasOwnProperty("Confidence") || data.hasOwnProperty("confidence")) {
          const confidence = (data.Confidence || data.confidence) * 100;
          setConfidenceScore(confidence.toFixed(2));
        }
        
        if (data.hasOwnProperty("Label") || data.hasOwnProperty("label")) {
          setDamageLabel(data.Label || data.label);
        }
        
        if (data.hasOwnProperty("fileformat") || data.hasOwnProperty("file_format")) {
          setFileFormat(data.fileformat || data.file_format);
        }
        
        if (data.hasOwnProperty("output_image_base64") || data.hasOwnProperty("file_data")) {
          const base64Data = data.output_image_base64 || data.file_data;
          if (base64Data && typeof base64Data === 'string') {
            setPreviewUrl(`data:image/${data.file_format || 'png'};base64,${base64Data}`);
          }
        }
      }
      
      setUploadStatus("success");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      setTimeout(() => {
        setUploadStatus("idle");
      }, 3000);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      // Create a preview URL for the dropped image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleDownloadPDF = () => {
    // Create a new jsPDF instance
    if (!previewUrl) return;
    
    // In a real application, you would generate a PDF here
    // For now, we'll just simulate a download by creating a link to the image
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = `verified-claim.${fileFormat || 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
  const progressBg = useMotionTemplate`linear-gradient(90deg, ${color}, #020617)`;

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

  // Accuracy gauge calculation
  const getAccuracyColor = (score) => {
    if (score === null) return "#4b5563"; // gray default
    const numScore = parseFloat(score);
    return numScore > 90 ? "#22c55e" : // green for high accuracy
           numScore > 70 ? "#eab308" : // yellow for medium
           "#ef4444"; // red for low
  };

  const accuracyColor = getAccuracyColor(confidenceScore);

  const getDamageStatusColor = (label) => {
    if (!label) return "#4b5563"; // gray default
    return label.toLowerCase() === "damage" ? "#ef4444" : "#22c55e"; // red for damage, green for no damage
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-nile-900 px-4 py-16 text-gray-200"
      style={{
        backgroundImage,
        backgroundPosition: `center ${scrollY * 0.5}px`,
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
          INSTANT AI VERIFICATION
        </motion.span>
        
        <motion.h1 
          variants={fadeInUp}
          className="max-w-3xl bg-gradient-to-br from-gray-200 to-gray-400 bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl"
        >
          Upload & Verify Your Claim
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="my-6 max-w-xl text-center text-lg leading-relaxed md:text-xl text-gray-300"
        >
          Upload an image of your claim document and our AI will analyze it in seconds, providing verification with high accuracy.
        </motion.p>
        
        <motion.form 
          variants={fadeInUp}
          onSubmit={handleSubmit} 
          className="w-full max-w-4xl"
        >
          <motion.div
            className="flex flex-col items-center p-8 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
            style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Result display area - visible after successful upload */}
            {uploadStatus === "success" && (
              <motion.div
                className="w-full mb-8 rounded-lg overflow-hidden bg-gray-900/80 border border-gray-700"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center">
                  <FiCheckCircle className="text-green-400 text-xl mr-2" />
                  <h3 className="text-xl font-medium text-gray-200">AI Verification Results</h3>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image result */}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 mb-2">Processed Image</span>
                    <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800/30 h-64 flex items-center justify-center">
                      <motion.img 
                        src={previewUrl} 
                        alt="Processed" 
                        className="max-h-full max-w-full object-contain" 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      />
                    </div>
                    {fileFormat && (
                      <div className="mt-2 flex items-center justify-center">
                        <span className="text-sm text-gray-400">
                          File format: <span className="text-gray-200 font-medium">{fileFormat.toUpperCase()}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Metrics and data */}
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 mb-2">Analysis Metrics</span>
                    <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-6 flex-1 flex flex-col space-y-6">
                      {/* Confidence score gauge */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Verification Confidence</span>
                          <span className="font-bold" style={{ color: accuracyColor }}>
                            {confidenceScore !== null ? `${confidenceScore}%` : "N/A"}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                          {confidenceScore !== null && (
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                backgroundColor: accuracyColor,
                                width: `${confidenceScore}%`,
                                transition: "width 1s ease-in-out"
                              }}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Damage assessment */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-300 font-medium">Assessment Result</span>
                          {damageLabel ? (
                            <span className="font-bold px-2 py-0.5 rounded-full text-sm" 
                              style={{ 
                                backgroundColor: getDamageStatusColor(damageLabel) + '33',
                                color: getDamageStatusColor(damageLabel) 
                              }}>
                              {damageLabel.toUpperCase()}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not Available</span>
                          )}
                        </div>
                        <div className="p-3 bg-gray-800/50 rounded-lg text-sm">
                          {damageLabel ? (
                            damageLabel.toLowerCase() === "damage" ? 
                              "Damage detected in the uploaded document. Review recommended." :
                              "No damage detected in the uploaded document."
                          ) : (
                            "Assessment data not available for this document."
                          )}
                        </div>
                      </div>
                      
                      {/* Action button */}
                      <motion.button
                        type="button"
                        onClick={handleDownloadPDF}
                        style={{
                          border,
                          boxShadow,
                        }}
                        className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-gray-800/70 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-800/90"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Download Verified Image <FiDownload />
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Debug info - only for development, remove in production */}
                {/* 
                <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                  <details className="text-xs text-gray-400">
                    <summary className="cursor-pointer">Response Details</summary>
                    <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto max-h-40">
                      {JSON.stringify(rawResponse, null, 2)}
                    </pre>
                  </details>
                </div>
                */}
              </motion.div>
            )}
            
            {/* Upload area - hidden after successful upload if showing result */}
            {uploadStatus !== "success" && (
              <motion.div
                className="w-full mb-8"
                initial={{ width: "100%" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`flex flex-col items-center justify-center border-2 border-dashed ${selectedFile ? 'border-gray-600' : 'border-gray-700'} rounded-lg p-8 cursor-pointer hover:bg-gray-800/30 transition-colors`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="relative mb-4 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img 
                          src={previewUrl} 
                          alt="Document preview" 
                          className="max-h-64 max-w-full object-contain rounded-lg border border-gray-600" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                      </motion.div>
                      <span className="text-lg text-gray-200 font-medium">Ready to verify</span>
                      <span className="text-sm text-gray-400 mt-1">Click "Verify Claim" below to process</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-24 w-24 rounded-full bg-gray-800/70 flex items-center justify-center mb-4"
                           style={{ boxShadow }}
                      >
                        <FiUpload className="text-5xl text-gray-200" />
                      </div>
                      <span className="text-xl text-gray-200 font-medium mb-2">
                        Drag and drop your file here
                      </span>
                      <span className="text-sm text-gray-400">
                        Supports JPG, PNG, and PDF documents
                      </span>
                      <motion.span
                        className="mt-4 rounded-full bg-gray-800/50 backdrop-blur-sm px-5 py-2 text-sm inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ border }}
                      >
                        <FiCamera className="text-gray-300" />
                        Browse Files
                      </motion.span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                </div>
              </motion.div>
            )}
            
            {/* Status message for uploading */}
            {uploadStatus === "uploading" && (
              <motion.div 
                className="w-full mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="h-2 w-full bg-gray-700 rounded-full overflow-hidden"
                  >
                    <motion.div 
                      className="h-full rounded-full"
                      style={{ backgroundImage: progressBg }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </motion.div>
                  <span className="text-sm font-medium whitespace-nowrap">Processing your claim...</span>
                </div>
              </motion.div>
            )}
            
            {/* Error message */}
            {uploadStatus === "error" && (
              <motion.div 
                className="w-full mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <FiAlertTriangle className="text-red-400 text-xl" />
                  <span className="text-sm font-medium">There was an error processing your claim. Please try again.</span>
                </div>
              </motion.div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {uploadStatus === "success" ? (
                <motion.button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setUploadStatus("idle");
                    setConfidenceScore(null);
                    setFileFormat(null);
                    setDamageLabel(null);
                  }}
                  className="w-full px-6 py-3 rounded-lg border border-gray-600 text-gray-300 transition-colors hover:bg-gray-800 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUpload className="mr-1" /> Upload New Document
                </motion.button>
              ) : (
                <>
                  <motion.button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedFile || uploadStatus === "uploading"}
                  >
                    Clear Selection
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    style={{
                      border,
                      boxShadow,
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-800/50 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-800/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!selectedFile || uploadStatus === "uploading"}
                  >
                    {uploadStatus === "uploading" ? "Verifying..." : "Verify Claim"}
                    <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.form>
        
        {/* How it works section */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 text-center w-full"
        >
          <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            How Our Verification Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[
              { 
                title: "Upload Document", 
                description: "Upload your claim document or image in seconds", 
                icon: <FiUpload className="text-4xl mb-2 text-blue-400" />
              },
              { 
                title: "AI Analysis", 
                description: "Our advanced AI analyzes the content with high accuracy", 
                icon: <FiFileText className="text-4xl mb-2 text-purple-400" />
              },
              { 
                title: "Instant Verification", 
                description: "Get instant verification results and recommended next steps", 
                icon: <FiCheckCircle className="text-4xl mb-2 text-green-400" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-lg border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.2) }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  borderColor: COLORS_TOP[index % COLORS_TOP.length],
                }}
              >
                <div className="flex flex-col items-center">
                  {step.icon}
                  <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Footer content remains the same... */}
      </motion.div>
      
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              opacity: [0.7, 0.1, 0.7],
              scale: [1, Math.random() * 2, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ClaimUpload;