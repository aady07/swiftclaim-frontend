import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userLimitService } from '../../services/api/userLimitService';

const UserTierInfo = ({ onLimitReached, onUpgradeSuccess, refreshTrigger }) => {
  const [limitInfo, setLimitInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    fetchLimitInfo();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  const fetchLimitInfo = async () => {
    try {
      setLoading(true);
      const data = await userLimitService.getLimitInfo();
      setLimitInfo(data);
      setError(null);
      
      // Notify parent if limit is reached
      if (!data.canUpload && onLimitReached) {
        onLimitReached(data);
      }
    } catch (err) {
      console.error('Error fetching limit info:', err);
      setError('Failed to load tier information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Navigate to contact us page instead of making backend call
    window.location.href = '/contacts';
  };

  if (loading) {
    return (
      <motion.div 
        className="w-full p-4 rounded-lg bg-gray-800/50 border border-gray-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-400">Loading tier information...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="w-full p-4 rounded-lg bg-red-500/10 border border-red-500/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center text-red-400">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </motion.div>
    );
  }

  if (!limitInfo) {
    return null;
  }

  const { stats, tierInfo } = limitInfo;
  const isUnlimited = stats.isUnlimited;
  const hasReachedLimit = stats.hasReachedLimit;

  return (
    <motion.div 
      className="w-full p-6 rounded-lg bg-gray-800/50 border border-gray-700 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Tier Information */}
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            stats.userTier === 'PREMIUM' 
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30'
              : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30'
          }`}>
            {stats.userTier === 'PREMIUM' ? '⭐ Premium' : '🆓 Free'}
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">Upload Limit</span>
            <span className="text-lg font-semibold text-white">
              {isUnlimited ? (
                <span className="text-green-400">Unlimited</span>
              ) : (
                `${stats.totalUploads}/${stats.uploadLimit} uploads`
              )}
            </span>
          </div>
          
          {!isUnlimited && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Remaining</span>
              <span className={`text-lg font-semibold ${
                stats.remainingUploads <= 3 ? 'text-red-400' : 'text-green-400'
              }`}>
                {stats.remainingUploads} uploads
              </span>
            </div>
          )}
        </div>

        {/* Upgrade Button for Free Users */}
        {stats.userTier === 'FREE' && (
          <motion.button
            onClick={handleUpgrade}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center">
              <span>📞 Contact Us for Premium</span>
            </div>
          </motion.button>
        )}
      </div>

      {/* Progress Bar for Free Users */}
      {!isUnlimited && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Upload Progress</span>
            <span>{Math.round((stats.totalUploads / stats.uploadLimit) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full ${
                hasReachedLimit ? 'bg-red-500' : 
                stats.remainingUploads <= 3 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(stats.totalUploads / stats.uploadLimit) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Warning for users near limit */}
      {!isUnlimited && stats.remainingUploads <= 3 && stats.remainingUploads > 0 && (
        <motion.div 
          className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center text-yellow-400">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              Only {stats.remainingUploads} upload{stats.remainingUploads === 1 ? '' : 's'} remaining. 
              Consider upgrading to Premium for unlimited uploads.
            </span>
          </div>
        </motion.div>
      )}

      {/* Limit reached warning */}
      {hasReachedLimit && (
        <motion.div 
          className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center text-red-400">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              Upload limit reached! You've used all {stats.uploadLimit} uploads in your Free tier. 
              Upgrade to Premium for unlimited uploads.
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserTierInfo; 