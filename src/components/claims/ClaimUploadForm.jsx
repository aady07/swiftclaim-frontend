import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCamera } from 'react-icons/fi';

const ClaimUploadForm = ({
  selectedFile,
  previewUrl,
  carMake,
  carModel,
  fileInputRef,
  handleFileChange,
  handleDragOver,
  handleDrop,
  setCarMake,
  setCarModel,
  uploadStatus,
  handleSubmit,
  handleClearSelection
}) => {
  return (
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
            <span className="text-lg text-gray-200 font-medium">Ready to submit</span>
            <span className="text-sm text-gray-400 mt-1">Click "Submit Image" below to continue</span>
          </div>
        ) : (
          <>
            <div className="h-24 w-24 rounded-full bg-gray-800/70 flex items-center justify-center mb-4">
              <FiUpload className="text-5xl text-gray-200" />
            </div>
            <span className="text-xl text-gray-200 font-medium mb-2">
              Drag and drop your file here
            </span>
            <span className="text-sm text-gray-400">
              Supports JPG and PNG images
            </span>
            <motion.span
              className="mt-4 rounded-full bg-gray-800/50 backdrop-blur-sm px-5 py-2 text-sm inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
          accept="image/jpeg,image/png"
        />
      </div>
      
      {/* Car details input fields */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="carMake" className="text-sm text-gray-400 mb-1">Car Make</label>
          <input
            id="carMake"
            type="text"
            value={carMake}
            onChange={(e) => setCarMake(e.target.value)}
            placeholder="e.g. Toyota, Honda, Maruti"
            className="px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="carModel" className="text-sm text-gray-400 mb-1">Car Model</label>
          <input
            id="carModel"
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            placeholder="e.g. Swift, Venue, City"
            className="px-4 py-3 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
        <motion.button
          type="button"
          onClick={handleClearSelection}
          className="flex-1 px-6 py-3 rounded-lg border border-gray-600 text-gray-300 transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selectedFile || uploadStatus === "uploading"}
        >
          Clear Selection
        </motion.button>
        
        <motion.button
          type="submit"
          onClick={handleSubmit}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-800/50 px-6 py-3 text-gray-50 transition-colors hover:bg-gray-800/80 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedFile || !carMake.trim() || !carModel.trim() || uploadStatus === "uploading"}
        >
          {uploadStatus === "uploading" ? "Uploading & Processing..." : "Submit Image"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClaimUploadForm; 