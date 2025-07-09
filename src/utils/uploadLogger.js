// Upload Logger Utility for exporting and analyzing upload data

export const uploadLogger = {
  // Export current logging statistics
  exportStats: () => {
    try {
      // Get stats from claimService if available
      if (typeof window !== 'undefined' && window.claimService) {
        return window.claimService.getLoggingStats();
      }
      
      // Fallback to localStorage if available
      const storedStats = localStorage.getItem('uploadStats');
      if (storedStats) {
        return JSON.parse(storedStats);
      }
      
      return null;
    } catch (error) {
      console.error('Failed to export upload stats:', error);
      return null;
    }
  },

  // Save stats to localStorage for persistence
  saveStats: (stats) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('uploadStats', JSON.stringify(stats));
        localStorage.setItem('uploadStatsTimestamp', new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to save upload stats:', error);
    }
  },

  // Clear stored stats
  clearStats: () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('uploadStats');
        localStorage.removeItem('uploadStatsTimestamp');
      }
    } catch (error) {
      console.error('Failed to clear upload stats:', error);
    }
  },

  // Get stats from localStorage
  getStoredStats: () => {
    try {
      if (typeof window !== 'undefined') {
        const stats = localStorage.getItem('uploadStats');
        const timestamp = localStorage.getItem('uploadStatsTimestamp');
        
        if (stats && timestamp) {
          return {
            stats: JSON.parse(stats),
            timestamp: timestamp,
            age: Date.now() - new Date(timestamp).getTime()
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get stored upload stats:', error);
      return null;
    }
  },

  // Export stats as JSON file
  downloadStats: (stats) => {
    try {
      const dataStr = JSON.stringify(stats, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `upload-stats-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Failed to download upload stats:', error);
    }
  },

  // Generate a summary report
  generateReport: (stats) => {
    if (!stats) return null;
    
    const { presignedUrl, s3Upload } = stats;
    
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalRequests: presignedUrl.totalRequests,
        totalUploads: s3Upload.totalUploads,
        overallSuccessRate: presignedUrl.successRate,
        uploadSuccessRate: s3Upload.successRate,
        totalDataUploaded: s3Upload.totalDataUploaded,
        averageRequestTime: presignedUrl.avgRequestTime,
        averageUploadTime: s3Upload.avgUploadTime
      },
      presignedUrl: {
        totalRequests: presignedUrl.totalRequests,
        successCount: presignedUrl.successCount,
        failureCount: presignedUrl.failureCount,
        duplicateCount: presignedUrl.duplicateCount,
        successRate: presignedUrl.successRate,
        avgRequestTime: presignedUrl.avgRequestTime,
        recentRequests: presignedUrl.recentRequests
      },
      s3Upload: {
        totalUploads: s3Upload.totalUploads,
        successCount: s3Upload.successCount,
        failureCount: s3Upload.failureCount,
        successRate: s3Upload.successRate,
        avgUploadTime: s3Upload.avgUploadTime,
        totalDataUploaded: s3Upload.totalDataUploaded
      }
    };
  },

  // Log performance metrics to console
  logPerformanceMetrics: (stats) => {
    if (!stats) return;
    
    const { presignedUrl, s3Upload } = stats;
    
    console.group('📊 Upload Performance Metrics');
    console.log('🔗 Presigned URL Requests:', {
      total: presignedUrl.totalRequests,
      success: presignedUrl.successCount,
      failed: presignedUrl.failureCount,
      duplicates: presignedUrl.duplicateCount,
      successRate: `${presignedUrl.successRate}%`,
      avgTime: `${presignedUrl.avgRequestTime}ms`
    });
    
    console.log('📤 S3 Uploads:', {
      total: s3Upload.totalUploads,
      success: s3Upload.successCount,
      failed: s3Upload.failureCount,
      successRate: `${s3Upload.successRate}%`,
      avgTime: `${s3Upload.avgUploadTime}ms`,
      totalData: s3Upload.totalDataUploaded
    });
    
    console.log('📈 Overall Performance:', {
      totalOperations: presignedUrl.totalRequests + s3Upload.totalUploads,
      overallSuccessRate: `${((presignedUrl.successCount + s3Upload.successCount) / (presignedUrl.totalRequests + s3Upload.totalUploads) * 100).toFixed(1)}%`,
      totalDataProcessed: s3Upload.totalDataUploaded
    });
    console.groupEnd();
  },

  // Monitor upload performance in real-time
  startMonitoring: (callback) => {
    if (typeof window === 'undefined') return;
    
    const monitor = setInterval(() => {
      try {
        const stats = uploadLogger.exportStats();
        if (stats && callback) {
          callback(stats);
        }
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 5000); // Check every 5 seconds
    
    return monitor;
  },

  // Stop monitoring
  stopMonitoring: (monitorId) => {
    if (monitorId) {
      clearInterval(monitorId);
    }
  }
};

// Make claimService available globally for debugging
if (typeof window !== 'undefined') {
  window.uploadLogger = uploadLogger;
} 