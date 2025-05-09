import React from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCamera, FiFileText } from 'react-icons/fi';

const ClaimUploadUI = ({ onUploadComplete, language }) => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadComplete(file);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        className="flex flex-col items-center p-8 rounded-xl bg-gray-900/70 backdrop-blur-md border border-gray-800"
        style={{ boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)" }}
        whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)" }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-24 w-24 rounded-full bg-gray-800/70 flex items-center justify-center mb-4">
          <FiUpload className="text-5xl text-gray-200" />
        </div>
        <span className="text-xl text-gray-200 font-medium mb-2">
          {language === "en" ? "Upload your claim document" : "अपना क्लेम दस्तावेज़ अपलोड करें"}
        </span>
        <span className="text-sm text-gray-400 mb-4">
          {language === "en" ? "Supports JPG, PNG, and PDF documents" : "JPG, PNG और PDF दस्तावेज़ों का समर्थन करता है"}
        </span>
        <motion.div
          className="flex gap-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf"
            />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors">
              <FiCamera className="text-xl" />
              <span>{language === "en" ? "Upload Image" : "छवि अपलोड करें"}</span>
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf"
            />
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors">
              <FiFileText className="text-xl" />
              <span>{language === "en" ? "Upload PDF" : "PDF अपलोड करें"}</span>
            </div>
          </label>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ClaimUploadUI; 