import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBarChart, FiX, FiRefreshCw, FiDownload, FiUpload, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ClaimUploadStats = ({ uploadStats, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (!uploadStats) {
    return null;
  }

  const { presignedUrl, s3Upload } = uploadStats;

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusColor = (rate) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'presigned', label: 'Presigned URLs', icon: FiDownload },
    { id: 'uploads', label: 'S3 Uploads', icon: FiUpload },
    { id: 'recent', label: 'Recent Activity', icon: FiClock }
  ];

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Stats Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-lg p-3 shadow-lg hover:bg-gray-700/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiBarChart className="text-xl text-blue-400" />
      </motion.button>

      {/* Expanded Stats Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 w-96 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Upload Statistics</h3>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={onRefresh}
                  className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiRefreshCw className="text-sm" />
                </motion.button>
                <motion.button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                >
                  <FiX className="text-sm" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/10'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="text-sm" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {/* Overall Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <FiCheckCircle />
                          <span className="text-sm font-medium">Success Rate</span>
                        </div>
                        <div className={`text-2xl font-bold ${getStatusColor(presignedUrl.successRate)}`}>
                          {presignedUrl.successRate}%
                        </div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-blue-400">
                          <FiClock />
                          <span className="text-sm font-medium">Avg Time</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {formatDuration(parseFloat(presignedUrl.avgRequestTime))}
                        </div>
                      </div>
                    </div>

                    {/* Request Counts */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Request Summary</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-800/30 rounded p-2 text-center">
                          <div className="text-blue-400 font-semibold">{presignedUrl.totalRequests}</div>
                          <div className="text-gray-400">Total</div>
                        </div>
                        <div className="bg-gray-800/30 rounded p-2 text-center">
                          <div className="text-green-400 font-semibold">{presignedUrl.successCount}</div>
                          <div className="text-gray-400">Success</div>
                        </div>
                        <div className="bg-gray-800/30 rounded p-2 text-center">
                          <div className="text-red-400 font-semibold">{presignedUrl.failureCount}</div>
                          <div className="text-gray-400">Failed</div>
                        </div>
                      </div>
                    </div>

                    {/* Upload Stats */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Upload Summary</h4>
                      <div className="bg-gray-800/30 rounded p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Uploads:</span>
                          <span className="text-white font-medium">{s3Upload.totalUploads}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Success Rate:</span>
                          <span className={`font-medium ${getStatusColor(s3Upload.successRate)}`}>
                            {s3Upload.successRate}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Avg Upload Time:</span>
                          <span className="text-white font-medium">
                            {formatDuration(parseFloat(s3Upload.avgUploadTime))}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Data:</span>
                          <span className="text-white font-medium">{s3Upload.totalDataUploaded}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'presigned' && (
                  <motion.div
                    key="presigned"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Presigned URL Statistics</h4>
                      <div className="bg-gray-800/30 rounded p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Requests</span>
                          <span className="text-white font-semibold">{presignedUrl.totalRequests}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Success Count</span>
                          <span className="text-green-400 font-semibold">{presignedUrl.successCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Failure Count</span>
                          <span className="text-red-400 font-semibold">{presignedUrl.failureCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Duplicate Requests</span>
                          <span className="text-yellow-400 font-semibold">{presignedUrl.duplicateCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Success Rate</span>
                          <span className={`font-semibold ${getStatusColor(presignedUrl.successRate)}`}>
                            {presignedUrl.successRate}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Average Request Time</span>
                          <span className="text-white font-semibold">
                            {formatDuration(parseFloat(presignedUrl.avgRequestTime))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'uploads' && (
                  <motion.div
                    key="uploads"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">S3 Upload Statistics</h4>
                      <div className="bg-gray-800/30 rounded p-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Uploads</span>
                          <span className="text-white font-semibold">{s3Upload.totalUploads}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Successful Uploads</span>
                          <span className="text-green-400 font-semibold">{s3Upload.successCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Failed Uploads</span>
                          <span className="text-red-400 font-semibold">{s3Upload.failureCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Success Rate</span>
                          <span className={`font-semibold ${getStatusColor(s3Upload.successRate)}`}>
                            {s3Upload.successRate}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Average Upload Time</span>
                          <span className="text-white font-semibold">
                            {formatDuration(parseFloat(s3Upload.avgUploadTime))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Data Uploaded</span>
                          <span className="text-white font-semibold">{s3Upload.totalDataUploaded}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'recent' && (
                  <motion.div
                    key="recent"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Recent Activity</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {presignedUrl.recentRequests.length > 0 ? (
                          presignedUrl.recentRequests.map((request, index) => (
                            <div key={index} className="bg-gray-800/30 rounded p-2 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-white font-medium truncate flex-1">
                                  {request.fileName}
                                </span>
                                <span className="text-gray-400 ml-2">
                                  {new Date(request.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-gray-400 mt-1">
                                {request.contentType}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm text-center py-4">
                            No recent activity
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClaimUploadStats; 