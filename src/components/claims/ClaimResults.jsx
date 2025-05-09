import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';

const ClaimResults = ({
  confidenceScore,
  damageLabel,
  damagedParts,
  costEstimates,
  damageImageUrl,
  partsImageUrl,
  handleDownloadPDF,
  handleNewUpload
}) => {
  const getAccuracyColor = (score) => {
    if (score === null) return "#4b5563";
    const numScore = parseFloat(score);
    return numScore > 90 ? "#22c55e" :
           numScore > 70 ? "#eab308" :
           "#ef4444";
  };

  const getDamageStatusColor = (label) => {
    if (!label) return "#4b5563";
    return label.toLowerCase() === "damage" ? "#ef4444" : "#22c55e";
  };

  const formatPartName = (part) => {
    if (!part) return "";
    return part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
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
      
      <div className="p-6 flex flex-col gap-6">
        {/* Confidence and damage status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Confidence score gauge */}
          <div className="flex flex-col space-y-2 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-300 font-medium">Verification Confidence</span>
              <span className="font-bold" style={{ color: getAccuracyColor(confidenceScore) }}>
                {confidenceScore !== null ? `${confidenceScore}%` : "N/A"}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
              {confidenceScore !== null && (
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: getAccuracyColor(confidenceScore),
                    width: `${confidenceScore}%`,
                    transition: "width 1s ease-in-out"
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Damage assessment */}
          <div className="flex flex-col space-y-2 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
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
        </div>
        
        {/* Images section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Damage detection image */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-400 mb-2">Damage Detection</span>
            <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800/30 h-64 flex items-center justify-center">
              {damageImageUrl ? (
                <motion.img 
                  src={damageImageUrl} 
                  alt="Damage Detection" 
                  className="max-h-full max-w-full object-contain" 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              ) : (
                <span className="text-gray-500">No damage image available</span>
              )}
            </div>
          </div>
          
          {/* Parts detection image */}
          <div className="flex flex-col">
            <span className="text-sm text-gray-400 mb-2">Parts Detection</span>
            <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800/30 h-64 flex items-center justify-center">
              {partsImageUrl ? (
                <motion.img 
                  src={partsImageUrl} 
                  alt="Parts Detection" 
                  className="max-h-full max-w-full object-contain" 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                />
              ) : (
                <span className="text-gray-500">No parts image available</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Damaged parts and cost estimates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Damaged parts list */}
          <div className="flex flex-col bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <span className="text-gray-300 font-medium mb-3">Damaged Parts</span>
            {damagedParts && damagedParts.length > 0 ? (
              <ul className="space-y-2">
                {damagedParts.map((part, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    <span>{formatPartName(part)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                No damaged parts identified
              </div>
            )}
          </div>
          
          {/* Cost estimates */}
          <div className="flex flex-col bg-gray-800/30 p-4 rounded-lg border border-gray-700">
            <span className="text-gray-300 font-medium mb-3">Repair Cost Estimates</span>
            {costEstimates && costEstimates.length > 0 ? (
              <div className="space-y-3">
                {costEstimates.map((cost, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-sm">
                      {damagedParts && damagedParts[index] ? formatPartName(damagedParts[index]) : `Estimate ${index + 1}`}
                    </span>
                    <span className="font-medium text-green-400">₹{cost}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 mt-2 bg-gray-700/50 rounded-lg">
                  <span className="font-medium">Total Estimated Cost</span>
                  <span className="font-bold text-green-400">
                    ₹{costEstimates.reduce((total, cost) => {
                      const range = cost.split('-').map(val => parseInt(val.replace(/[^0-9]/g, '').trim()));
                      return total + range[0];
                    }, 0).toLocaleString()} - ₹{costEstimates.reduce((total, cost) => {
                      const range = cost.split('-').map(val => parseInt(val.replace(/[^0-9]/g, '').trim()));
                      return total + (range.length > 1 ? range[1] : range[0]);
                    }, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-800/50 rounded-lg text-sm text-gray-400">
                No cost estimates available
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 mt-2">
          <motion.button
            type="button"
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-800/70 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-800/90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Download Report <FiDownload />
          </motion.button>
          
          <motion.button
            type="button"
            onClick={handleNewUpload}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 transition-colors hover:bg-gray-800 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Upload New Vehicle Image
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ClaimResults; 