import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";
import ClaimUploadForm from '../components/claims/ClaimUploadForm';
import ClaimResults from '../components/claims/ClaimResults';
import { claimService } from '../services/api/claimService';
import { generateClaimReport } from '../utils/pdfGenerator';

const ClaimUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [fileFormat, setFileFormat] = useState(null);
  const [damageLabel, setDamageLabel] = useState(null);
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [damagedParts, setDamagedParts] = useState([]);
  const [costEstimates, setCostEstimates] = useState([]);
  const [damageImageUrl, setDamageImageUrl] = useState(null);
  const [partsImageUrl, setPartsImageUrl] = useState(null);
  const fileInputRef = useRef(null);

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

    setUploadStatus("uploading");
    resetResults();

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("carMake", carMake);
    formData.append("carModel", carModel);

    try {
      const data = await claimService.uploadClaim(formData);
      processClaimResponse(data);
      setUploadStatus("success");
    } catch {
      setUploadStatus("error");
      setTimeout(() => {
        setUploadStatus("idle");
      }, 3000);
    }
  };

  const processClaimResponse = (data) => {
    if (data.model1_output?.[0]) {
      const model1Data = data.model1_output[0];
      if (model1Data.confidence) {
        setConfidenceScore((model1Data.confidence * 100).toFixed(2));
      }
      setFileFormat(model1Data.file_format);
      setDamageLabel(model1Data.label);
      setDamageImageUrl(model1Data.output_image_base64?.startsWith('data') 
        ? model1Data.output_image_base64 
        : `data:image/${model1Data.file_format || 'png'};base64,${model1Data.output_image_base64}`);
    }

    if (data.model2_output?.[0]) {
      const model2Data = data.model2_output[0];
      setPartsImageUrl(model2Data.output2_image_base64?.startsWith('data')
        ? model2Data.output2_image_base64
        : `data:image/${fileFormat || 'png'};base64,${model2Data.output2_image_base64}`);
    }

    if (data.parts) setDamagedParts(data.parts);
    if (data.cost) setCostEstimates(data.cost);
  };

  const resetResults = () => {
    setConfidenceScore(null);
    setFileFormat(null);
    setDamageLabel(null);
    setDamagedParts([]);
    setCostEstimates([]);
    setDamageImageUrl(null);
    setPartsImageUrl(null);
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
    setUploadStatus("idle");
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

  return (
    <div className="bg-gray-950 text-gray-200 overflow-hidden">
      <Helmet>
        <title>AI-Powered Claim Upload & Verification | MiraIsta</title>
        <meta name="description" content="Upload and process your insurance claims with MiraIsta's advanced AI system. Get instant analysis, accurate damage assessment, and detailed cost estimates for vehicle repairs. Our AI-powered verification ensures fast, reliable claim processing." />
        <meta name="keywords" content="claim upload, insurance claims, AI claim processing, damage assessment, claim analysis, MiraIsta claims, vehicle damage verification, AI damage detection, automated claim processing, insurance verification" />
        <meta property="og:title" content="AI-Powered Claim Upload & Verification | MiraIsta" />
        <meta property="og:description" content="Upload and process your insurance claims with our advanced AI system. Get instant analysis, accurate damage assessment, and detailed cost estimates for vehicle repairs." />
        <meta property="og:url" content="https://www.miraista.com/claim-upload" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.miraista.com/images/claim-upload-preview.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI-Powered Claim Upload & Verification | MiraIsta" />
        <meta name="twitter:description" content="Upload and process your insurance claims with our advanced AI system. Get instant analysis and accurate damage assessment." />
        <meta name="twitter:image" content="https://www.miraista.com/images/claim-upload-preview.jpg" />
        <link rel="canonical" href="https://www.miraista.com/claim-upload" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="MiraIsta" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MiraIsta Claim Upload",
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
            className="mb-1.5 inline-block rounded-full bg-gray-800/70 backdrop-blur-md px-4 py-1.5 text-sm font-medium tracking-wider"
          >
            INSTANT AI VERIFICATION
          </motion.span>
          
          <motion.h1 
            className="max-w-3xl bg-gradient-to-br from-gray-200 to-gray-400 bg-clip-text text-center text-4xl font-bold leading-tight text-transparent sm:text-5xl md:text-6xl"
          >
            Upload & Verify Your Claim
          </motion.h1>
          
          <motion.p 
            className="my-6 max-w-xl text-center text-lg leading-relaxed md:text-xl text-gray-300"
          >
            Upload an image of your damaged vehicle and our AI will analyze it in seconds, providing verification with high accuracy.
          </motion.p>
          
          <motion.div
            className="w-full max-w-4xl p-8 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
            style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {uploadStatus === "success" ? (
              <ClaimResults
                confidenceScore={confidenceScore}
                damageLabel={damageLabel}
                damagedParts={damagedParts}
                costEstimates={costEstimates}
                damageImageUrl={damageImageUrl}
                partsImageUrl={partsImageUrl}
                handleDownloadPDF={handleDownloadPDF}
                handleNewUpload={handleNewUpload}
                            />
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
                        animate={{ width: "100%" }}
                        transition={{ 
                          duration: 2,
                          ease: [0.4, 0, 0.2, 1]
                        }}
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
                  transition={{ 
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">There was an error processing your claim. Please try again.</span>
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
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Upload Document</h3>
              <p className="text-gray-400">Upload your claim document or image in seconds</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">AI Analysis</h3>
              <p className="text-gray-400">Our advanced AI analyzes the content with high accuracy</p>
            </motion.div>
          
            {/* Step 3 */}
            <motion.div
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
              whileHover={{ 
                scale: 1.01,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.99,
                transition: { duration: 0.1 }
              }}
            >
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                  </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-200">Instant Verification</h3>
              <p className="text-gray-400">Get instant verification results and recommended next steps</p>
                </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClaimUpload;