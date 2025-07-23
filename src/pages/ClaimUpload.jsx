import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import ClaimUploadForm from '../components/claims/ClaimUploadForm';
import ClaimResults from '../components/claims/ClaimResults';
import ClaimUploadStats from '../components/claims/ClaimUploadStats';
import { useS3Upload } from '../hooks/useS3Upload';
import { generateClaimReport } from '../utils/pdfGenerator';
import { useCognitoAuth } from '../hooks/useCognitoAuth';
import { authenticatedApiService } from '../services/api/authenticatedApiService';

const ClaimUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  
  // Use the S3 upload hook
  const { uploadFileToS3, uploadStatus, uploadProgress, uploadStats, resetUpload, getUploadStats } = useS3Upload();
  const [fileFormat, setFileFormat] = useState(null);
  const [damageLabel, setDamageLabel] = useState(null);
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [damagedParts, setDamagedParts] = useState([]);
  const [costEstimates, setCostEstimates] = useState([]);
  const [damageImageUrl, setDamageImageUrl] = useState(null);
  const [partsImageUrl, setPartsImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { signOut } = useCognitoAuth();
  const navigate = useNavigate();
  const [claimResults, setClaimResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [model1ImageUrl, setModel1ImageUrl] = useState(null);
  const [model2ImageUrl, setModel2ImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !carMake.trim() || !carModel.trim()) return;
    if (uploadStatus === 'uploading') {
      return;
    }
    resetResults();
    setClaimResults(null);
    setResultsError(null);
    setResultsLoading(false);
    try {
      const data = await uploadFileToS3(selectedFile, carMake, carModel);
      // Expecting: { claimId, status, success }
      if (data && data.claimId && data.success) {
        setResultsLoading(true);
        try {
          const results = await authenticatedApiService.claims.getClaimResults(data.claimId);
          setClaimResults(results);
          // Fetch images using new endpoints
          const [originalBlob, model1Blob, model2Blob] = await Promise.all([
            authenticatedApiService.claims.getOriginalImage(data.claimId),
            authenticatedApiService.claims.getModel1Image(data.claimId),
            authenticatedApiService.claims.getModel2Image(data.claimId)
          ]);
          setOriginalImageUrl(URL.createObjectURL(originalBlob));
          setModel1ImageUrl(URL.createObjectURL(model1Blob));
          setModel2ImageUrl(URL.createObjectURL(model2Blob));
        } catch (err) {
          setResultsError('Failed to fetch claim results or images.');
        } finally {
          setResultsLoading(false);
        }
      } else {
        setResultsError('Processing error, try again.');
      }
    } catch (error) {
      setTimeout(() => {
        resetUpload();
      }, 3000);
    }
  };

  const processClaimResponse = (data) => {
    
    // Handle model1_output - damage detection
    if (data.model1_output && data.model1_output.length > 0) {
      // First object contains damage detection info
      const damageInfo = data.model1_output.find(item => item.label);
      if (damageInfo) {
        if (damageInfo.confidence) {
          setConfidenceScore((damageInfo.confidence * 100).toFixed(2));
        }
        setFileFormat(damageInfo.file_format);
        setDamageLabel(damageInfo.label);
      }
      
      // Second object contains image data
      const damageImageData = data.model1_output.find(item => item.output_image_base64);
      if (damageImageData && damageImageData.output_image_base64 && damageImageData.output_image_base64 !== 'undefined') {
        const damageImage = damageImageData.output_image_base64;
        setDamageImageUrl(damageImage.startsWith('data') 
          ? damageImage 
          : `data:image/${damageInfo?.file_format || 'png'};base64,${damageImage}`);
      }
    }

    // Handle model2_output - parts detection
    if (data.model2_output && data.model2_output.length > 0) {
      // Extract parts from objects with labels
      const partsData = data.model2_output.filter(item => item.label);
      
      // Extract parts image data
      const partsImageData = data.model2_output.find(item => item.output2_image_base64);
      if (partsImageData && partsImageData.output2_image_base64 && partsImageData.output2_image_base64 !== 'undefined') {
        const partsImage = partsImageData.output2_image_base64;
        setPartsImageUrl(partsImage.startsWith('data')
          ? partsImage
          : `data:image/${fileFormat || 'png'};base64,${partsImage}`);
      }
    }

    // Handle costing data
    if (data.costing && Array.isArray(data.costing)) {
      
      // Extract parts from costing array
      const parts = data.costing.map(item => item.part).filter(part => part !== 'Unknown');
      setDamagedParts(parts);
      
      // Extract prices from costing array
      const costs = data.costing.map(item => item.price).filter(Boolean);
      setCostEstimates(costs);
    }
  };

  const resetResults = () => {
    setClaimResults(null);
    setResultsError(null);
    setResultsLoading(false);
    setConfidenceScore(null);
    setFileFormat(null);
    setDamageLabel(null);
    setDamagedParts([]);
    setCostEstimates([]);
    setDamageImageUrl(null);
    setPartsImageUrl(null);
    setOriginalImageUrl(null);
    setModel1ImageUrl(null);
    setModel2ImageUrl(null);
  };

  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCarMake("");
    setCarModel("");
  };

  const handleNewUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    resetUpload();
    resetResults();
    setCarMake("");
    setCarModel("");
  };

  const handleDownloadPDF = () => {
    if (!previewUrl || !damageLabel) return;
    
    try {
      const doc = generateClaimReport({
        carMake,
        carModel,
        damageLabel,
        confidenceScore,
        damagedParts,
        costEstimates,
        previewUrl,
        damageImageUrl,
        partsImageUrl
      });
      
      doc.save(`mira-sita-damage-report-${carMake}-${carModel}.pdf`);
    } catch (error) {
      alert("There was an error generating the PDF. Please try again.");
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
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleRefreshStats = () => {
    // Force refresh of stats by calling getUploadStats
    const stats = getUploadStats();
  };

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>AI-Powered Claim Upload & Verification | Miraista</title>
        <meta name="description" content="Upload and process your insurance claims with Miraista's advanced AI system. Get instant analysis, accurate damage assessment, and detailed cost estimates for vehicle repairs. Our AI-powered verification ensures fast, reliable claim processing." />
        <meta name="keywords" content="claim upload, insurance claims, AI claim processing, damage assessment, claim analysis, Miraista claims, vehicle damage verification, AI damage detection, automated claim processing, insurance verification" />
        <meta property="og:title" content="AI-Powered Claim Upload & Verification | Miraista" />
        <meta property="og:description" content="Upload and process your insurance claims with our advanced AI system. Get instant analysis, accurate damage assessment, and detailed cost estimates for vehicle repairs." />
        <meta property="og:url" content="https://www.miraista.com/claim-upload" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.miraista.com/images/claim-upload-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI-Powered Claim Upload & Verification | Miraista" />
        <meta name="twitter:description" content="Upload and process your insurance claims with our advanced AI system. Get instant analysis and accurate damage assessment." />
        <meta name="twitter:image" content="https://www.miraista.com/images/claim-upload-preview.jpg" />
        <link rel="canonical" href="https://www.miraista.com/claim-upload" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Miraista" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Miraista Claim Upload",
            "description": "AI-powered insurance claim processing and verification system",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "AI-powered damage assessment",
              "Instant claim verification",
              "Cost estimation",
              "PDF report generation"
            ]
          })}
        </script>
      </Helmet>

      <motion.div
        className="relative min-h-screen overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
        
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

        <motion.div
          className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-4 pt-32 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span 
            className="mb-1.5 inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-600/10 rounded-full backdrop-blur-sm border border-green-200/20 hover:scale-105 transition-transform duration-300"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 text-sm font-medium">INSTANT AI VERIFICATION</span>
          </motion.span>
          
          <motion.h1 
            className="max-w-3xl text-center text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl"
          >
            Got a dent? Get a diagnosis.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mt-2 hover:scale-105 transition-transform duration-300">
              Upload your car photos for an AI-powered check-up
            </span>
          </motion.h1>
          
          
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 mb-8 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/assessments-dashboard"
              className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 border border-gray-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View All Reports
            </Link>
            
            <button
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </motion.div>
          
          <motion.div
            className="w-full max-w-4xl p-8 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700"
            style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {uploadStatus === "success" ? (
              resultsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-lg">Loading claim results...</p>
                </div>
              ) : resultsError ? (
                <div className="text-center py-12 text-red-400">{resultsError}</div>
              ) : claimResults ? (
                <ClaimResults
                  claimResults={claimResults}
                  originalImageUrl={originalImageUrl}
                  model1ImageUrl={model1ImageUrl}
                  model2ImageUrl={model2ImageUrl}
                  handleDownloadPDF={handleDownloadPDF}
                  handleNewUpload={handleNewUpload}
                />
              ) : (
                <div className="text-center py-12 text-gray-400">No results to display.</div>
              )
            ) : (
              <ClaimUploadForm
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                carMake={carMake}
                carModel={carModel}
                fileInputRef={fileInputRef}
                handleFileChange={handleFileChange}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                setCarMake={setCarMake}
                setCarModel={setCarModel}
                uploadStatus={uploadStatus}
                handleSubmit={handleSubmit}
                handleClearSelection={handleClearSelection}
              />
            )}
              
              {/* Status message for uploading */}
              {uploadStatus === "uploading" && (
                <motion.div 
                  className="w-full mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="h-2 w-full bg-gray-700 rounded-full overflow-hidden"
                    >
                      <motion.div 
                        className="h-full rounded-full bg-blue-500"
                        initial={{ width: "0%" }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ 
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      />
                    </motion.div>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {uploadProgress < 30 ? "Getting upload URL..." :
                       uploadProgress < 70 ? "Uploading to cloud..." :
                       uploadProgress < 90 ? "Processing..." :
                       "Finalizing..."}
                    </span>
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
                  transition={{ 
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <div className="flex items-center gap-3">
                  <div className="text-red-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-red-400 font-medium">
                    Upload failed. Please try again.
                  </span>
                  </div>
                </motion.div>
              )}
          </motion.div>
              
          {/* How Our Verification Works Section */}
          <motion.div 
            className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {/* Step 1 */}
            <motion.div 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Upload Document</h3>
              <p className="text-gray-300">Upload your claim document or image in seconds</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Analysis</h3>
              <p className="text-gray-300">Our advanced AI analyzes the content with high accuracy</p>
            </motion.div>
          
            {/* Step 3 */}
            <motion.div
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800/80 backdrop-blur-sm border border-gray-700"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Verification</h3>
              <p className="text-gray-300">Get instant verification results and recommended next steps</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Upload Statistics Component */}
      <ClaimUploadStats 
        uploadStats={uploadStats} 
        onRefresh={handleRefreshStats}
      />
    </div>
  );
};

export default ClaimUpload;