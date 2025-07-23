import axios from 'axios';

const API_BASE_URL = 'https://testing.aadybackend.site/api';

// Enhanced logging system for presigned URL operations
const presignedUrlLogger = {
  requestCount: 0,
  successCount: 0,
  failureCount: 0,
  totalRequestTime: 0,
  requestHistory: [],
  duplicateRequestCount: 0,
  
  logRequest: (fileName, contentType, startTime) => {
    presignedUrlLogger.requestCount++;
    const logEntry = {
      id: presignedUrlLogger.requestCount,
      fileName,
      contentType,
      timestamp: new Date().toISOString(),
      startTime
    };
    presignedUrlLogger.requestHistory.push(logEntry);
    
    return logEntry;
  },
  
  logSuccess: (logEntry, presignedUrl, fileKey, s3Url, duration) => {
    presignedUrlLogger.successCount++;
    presignedUrlLogger.totalRequestTime += duration;
  },
  
  logFailure: (logEntry, error, duration) => {
    presignedUrlLogger.failureCount++;
  },
  
  logDuplicate: (requestKey) => {
    presignedUrlLogger.duplicateRequestCount++;
  },
  
  getStats: () => {
    return {
      totalRequests: presignedUrlLogger.requestCount,
      successCount: presignedUrlLogger.successCount,
      failureCount: presignedUrlLogger.failureCount,
      duplicateCount: presignedUrlLogger.duplicateRequestCount,
      successRate: presignedUrlLogger.requestCount > 0 ? (presignedUrlLogger.successCount / presignedUrlLogger.requestCount * 100).toFixed(1) : 0,
      avgRequestTime: presignedUrlLogger.successCount > 0 ? (presignedUrlLogger.totalRequestTime / presignedUrlLogger.successCount).toFixed(2) : 0,
      recentRequests: presignedUrlLogger.requestHistory.slice(-10) // Last 10 requests
    };
  }
};

// S3 Upload Logger
const s3UploadLogger = {
  uploadCount: 0,
  successCount: 0,
  failureCount: 0,
  totalUploadTime: 0,
  totalFileSize: 0,
  
  logUpload: (file, presignedUrl, startTime) => {
    s3UploadLogger.uploadCount++;
    s3UploadLogger.totalFileSize += file.size;
    
    return { startTime, fileSize: file.size };
  },
  
  logUploadSuccess: (logData, duration) => {
    s3UploadLogger.successCount++;
    s3UploadLogger.totalUploadTime += duration;
  },
  
  logUploadFailure: (logData, error, duration) => {
    s3UploadLogger.failureCount++;
  }
};

export const claimService = {
  // Track active requests to prevent duplicates
  activeRequests: new Map(),

  // Get pre-signed URL for S3 upload
  getUploadUrl: async (fileName, contentType) => {
    const requestKey = `${fileName}-${contentType}`;
    const requestId = `${fileName}-${contentType}-${Date.now()}-${Math.random()}`;
    const startTime = performance.now();
    
    // Check if there's already a pending request
    if (claimService.activeRequests.has(requestKey)) {
      const existingRequest = claimService.activeRequests.get(requestKey);
      presignedUrlLogger.logDuplicate(requestKey);
      
      // Wait for the existing request to complete
      try {
        const result = await existingRequest;
        return result;
      } catch (error) {
        // If existing request failed, remove it and continue
        claimService.activeRequests.delete(requestKey);
      }
    }

    // Create a new request promise
    const requestPromise = (async () => {
      const logEntry = presignedUrlLogger.logRequest(fileName, contentType, startTime);
      
      try {
        const response = await axios.post(`${API_BASE_URL}/get-upload-url`, 
          `fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        
        const duration = performance.now() - startTime;
        presignedUrlLogger.logSuccess(logEntry, response.data.presignedUrl, response.data.fileKey, response.data.s3Url, duration);
        
        return response.data;
      } catch (error) {
        const duration = performance.now() - startTime;
        presignedUrlLogger.logFailure(logEntry, error, duration);
        
        throw new Error('Failed to get upload URL');
      }
    })();

    // Store the request promise
    claimService.activeRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up the request from the map
      claimService.activeRequests.delete(requestKey);
    }
  },

  // Upload file directly to S3 using pre-signed URL
  uploadToS3: async (presignedUrl, file) => {
    const startTime = performance.now();
    const logData = s3UploadLogger.logUpload(file, presignedUrl, startTime);
    
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      if (!response.ok) {
        throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`);
      }
      
      const duration = performance.now() - startTime;
      s3UploadLogger.logUploadSuccess(logData, duration);
      
      return true;
    } catch (error) {
      const duration = performance.now() - startTime;
      s3UploadLogger.logUploadFailure(logData, error, duration);
      
      throw new Error('Failed to upload file to S3');
    }
  },

  // Submit claim with S3 image URL instead of file
  submitClaim: async (claimData) => {
    const startTime = performance.now();
    
    try {
      const response = await axios.post(`${API_BASE_URL}/s3upload`, claimData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const duration = performance.now() - startTime;
      
      // Handle the new response format with nested body
      let responseData = response.data;
      if (responseData.body && typeof responseData.body === 'string') {
        try {
          responseData = JSON.parse(responseData.body);
        } catch (parseError) {
        }
      }
      
      return responseData;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      throw new Error('Failed to submit claim');
    }
  },

  // Legacy method for backward compatibility
  uploadClaim: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle the new response format with nested body
      let responseData = response.data;
      if (responseData.body && typeof responseData.body === 'string') {
        try {
          responseData = JSON.parse(responseData.body);
        } catch (parseError) {
        }
      }
      
      return responseData;
    } catch (error) {
      throw new Error('Failed to upload claim');
    }
  },

  processClaim: async (claimData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/process-claim`, claimData);
      
      // Handle the new response format with nested body
      let responseData = response.data;
      if (responseData.body && typeof responseData.body === 'string') {
        try {
          responseData = JSON.parse(responseData.body);
        } catch (parseError) {
        }
      }
      
      return responseData;
    } catch (error) {
      throw new Error('Failed to process claim');
    }
  },

  // Fetches all AI model outputs and costings for a specific claim
  getClaimResults: async (claimId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/claims/${claimId}/results`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch claim results');
    }
  },

  // Get comprehensive logging statistics
  getLoggingStats: () => {
    return {
      presignedUrl: presignedUrlLogger.getStats(),
      s3Upload: {
        totalUploads: s3UploadLogger.uploadCount,
        successCount: s3UploadLogger.successCount,
        failureCount: s3UploadLogger.failureCount,
        successRate: s3UploadLogger.uploadCount > 0 ? (s3UploadLogger.successCount / s3UploadLogger.uploadCount * 100).toFixed(1) : 0,
        avgUploadTime: s3UploadLogger.successCount > 0 ? (s3UploadLogger.totalUploadTime / s3UploadLogger.successCount).toFixed(2) : 0,
        totalDataUploaded: `${(s3UploadLogger.totalFileSize / 1024 / 1024).toFixed(2)}MB`
  }
    };
  }
};

// Make claimService available globally for debugging
if (typeof window !== 'undefined') {
  window.claimService = claimService;
} 