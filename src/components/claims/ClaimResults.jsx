import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiDownload } from 'react-icons/fi';

const ClaimResults = ({
  claimResults,
  originalImageUrl,
  model1ImageUrl,
  model2ImageUrl,
  handleDownloadPDF,
  handleNewUpload
}) => {
  if (!claimResults) return null;
  const { modelOutputs = [], costings = [], claimId } = claimResults;

  // Find model 1 and model 2 outputs
  const model1 = modelOutputs.find(m => m.modelNumber === 1) || modelOutputs[0] || {};
  const model2 = modelOutputs.find(m => m.modelNumber === 2) || {};

  // Helper to format confidence as percent
  const formatConfidence = (conf) =>
    conf !== undefined && conf !== null ? `${(parseFloat(conf) * 100).toFixed(2)}%` : 'N/A';

  // Helper to format part name
  const formatPartName = (part) => {
    if (!part) return "";
    return part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to get label tag color
  const getLabelColor = (label) =>
    label && label.toLowerCase().includes('dent') ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30';

  return (
    <motion.div
      className="w-full mb-8 rounded-lg overflow-hidden bg-gray-900/80 border border-gray-700"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4 border-b border-gray-700 bg-gray-800/50 flex items-center">
        <h3 className="text-xl font-medium text-gray-200">AI Claim Results for #{claimId}</h3>
      </div>
      <div className="p-6 flex flex-col gap-6">
        {/* Main tags at the top */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="inline-block px-5 py-2 rounded-full text-lg font-bold border bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Confidence: {formatConfidence(model1.confidence)}
          </span>
          <span className={`inline-block px-4 py-1 rounded-full text-base font-bold border ${getLabelColor(model1.label)}`}>
            Damage Type: {model1.label || 'No Dent'}
          </span>
          {model2 && model2.label && (
            <span className="inline-block px-4 py-1 rounded-full text-base font-medium border bg-blue-500/20 text-blue-400 border-blue-500/30">
              Damage Part: {formatPartName(model2.label)}
            </span>
          )}
        </div>
        {/* Images section: processed images side by side, then original */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-1">Processed Image 1</span>
            {model1ImageUrl ? (
              <img src={model1ImageUrl} alt="Processed 1" className="w-full max-h-64 object-contain rounded border border-gray-600" />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-gray-600 rounded">No image</div>
            )}
          </div>
          <div className="flex-1 flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-1">Processed Image 2</span>
            {model2ImageUrl ? (
              <img src={model2ImageUrl} alt="Processed 2" className="w-full max-h-64 object-contain rounded border border-gray-600" />
            ) : (
              <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-gray-600 rounded">No image</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mb-4">
          <span className="text-sm text-gray-400 mb-1">Original Image</span>
          {originalImageUrl ? (
            <img src={originalImageUrl} alt="Original" className="w-full max-h-64 object-contain rounded border border-gray-600" />
          ) : (
            <div className="w-full h-64 flex items-center justify-center text-gray-500 border border-gray-600 rounded">No image</div>
          )}
        </div>
        {/* Costings */}
        <div>
          <span className="text-lg font-semibold text-gray-300 mb-2 block">Costings</span>
          {costings.length === 0 ? (
            <div className="text-gray-400">No costings available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {costings.map((cost, idx) => (
                <div key={cost.id || idx} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-200">{formatPartName(cost.part)}</span>
                    <span className="text-sm text-gray-400">Confidence: {cost.confidence || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Price:</span>
                    <span className="font-bold text-green-400">₹{cost.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            Download Report
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