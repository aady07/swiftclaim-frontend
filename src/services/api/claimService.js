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
    
    console.log(`🔗 [PRESIGNED URL REQUEST #${presignedUrlLogger.requestCount}]`, {
      fileName,
      contentType,
      timestamp: logEntry.timestamp,
      totalRequests: presignedUrlLogger.requestCount,
      successRate: presignedUrlLogger.successCount / Math.max(1, presignedUrlLogger.requestCount - presignedUrlLogger.failureCount) * 100
    });
    
    return logEntry;
  },
  
  logSuccess: (logEntry, presignedUrl, fileKey, s3Url, duration) => {
    presignedUrlLogger.successCount++;
    presignedUrlLogger.totalRequestTime += duration;
    
    const avgRequestTime = presignedUrlLogger.totalRequestTime / presignedUrlLogger.successCount;
    
    console.log(`✅ [PRESIGNED URL SUCCESS #${logEntry.id}]`, {
      fileName: logEntry.fileName,
      duration: `${duration.toFixed(2)}ms`,
      avgRequestTime: `${avgRequestTime.toFixed(2)}ms`,
      presignedUrl: presignedUrl.substring(0, 100) + '...',
      fileKey,
      s3Url,
      successRate: `${(presignedUrlLogger.successCount / presignedUrlLogger.requestCount * 100).toFixed(1)}%`,
      totalRequests: presignedUrlLogger.requestCount
    });
  },
  
  logFailure: (logEntry, error, duration) => {
    presignedUrlLogger.failureCount++;
    
    console.log(`❌ [PRESIGNED URL FAILURE #${logEntry.id}]`, {
      fileName: logEntry.fileName,
      error: error.message || error,
      duration: `${duration.toFixed(2)}ms`,
      failureRate: `${(presignedUrlLogger.failureCount / presignedUrlLogger.requestCount * 100).toFixed(1)}%`,
      totalRequests: presignedUrlLogger.requestCount
    });
  },
  
  logDuplicate: (requestKey) => {
    presignedUrlLogger.duplicateRequestCount++;
    
    console.log(`🔄 [DUPLICATE REQUEST DETECTED]`, {
      requestKey,
      duplicateCount: presignedUrlLogger.duplicateRequestCount,
      totalRequests: presignedUrlLogger.requestCount,
      duplicateRate: `${(presignedUrlLogger.duplicateRequestCount / presignedUrlLogger.requestCount * 100).toFixed(1)}%`
    });
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
    
    console.log(`📤 [S3 UPLOAD START #${s3UploadLogger.uploadCount}]`, {
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      fileType: file.type,
      presignedUrl: presignedUrl.substring(0, 100) + '...',
      timestamp: new Date().toISOString(),
      totalUploads: s3UploadLogger.uploadCount,
      totalDataUploaded: `${(s3UploadLogger.totalFileSize / 1024 / 1024).toFixed(2)}MB`
    });
    
    return { startTime, fileSize: file.size };
  },
  
  logUploadSuccess: (logData, duration) => {
    s3UploadLogger.successCount++;
    s3UploadLogger.totalUploadTime += duration;
    
    const avgUploadTime = s3UploadLogger.totalUploadTime / s3UploadLogger.successCount;
    const avgFileSize = s3UploadLogger.totalFileSize / s3UploadLogger.uploadCount;
    
    console.log(`✅ [S3 UPLOAD SUCCESS]`, {
      duration: `${duration.toFixed(2)}ms`,
      avgUploadTime: `${avgUploadTime.toFixed(2)}ms`,
      avgFileSize: `${(avgFileSize / 1024 / 1024).toFixed(2)}MB`,
      successRate: `${(s3UploadLogger.successCount / s3UploadLogger.uploadCount * 100).toFixed(1)}%`,
      totalUploads: s3UploadLogger.uploadCount,
      totalDataUploaded: `${(s3UploadLogger.totalFileSize / 1024 / 1024).toFixed(2)}MB`
    });
  },
  
  logUploadFailure: (logData, error, duration) => {
    s3UploadLogger.failureCount++;
    
    console.log(`❌ [S3 UPLOAD FAILURE]`, {
      error: error.message || error,
      duration: `${duration.toFixed(2)}ms`,
      failureRate: `${(s3UploadLogger.failureCount / s3UploadLogger.uploadCount * 100).toFixed(1)}%`,
      totalUploads: s3UploadLogger.uploadCount
    });
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
        console.log('🔄 Using result from existing request');
        return result;
      } catch (error) {
        // If existing request failed, remove it and continue
        claimService.activeRequests.delete(requestKey);
        console.log('🔄 Existing request failed, proceeding with new request');
      }
    }

    // Create a new request promise
    const requestPromise = (async () => {
      const logEntry = presignedUrlLogger.logRequest(fileName, contentType, startTime);
      
      try {
        console.log(`🔗 [PRESIGNED URL REQUEST] Making API call to: ${API_BASE_URL}/get-upload-url`);
        
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
        
        console.log(`🔗 [PRESIGNED URL RESPONSE]`, {
          presignedUrl: response.data.presignedUrl.substring(0, 100) + '...',
          fileKey: response.data.fileKey,
          s3Url: response.data.s3Url,
          expirationTime: response.data.expirationTime ? new Date(response.data.expirationTime).toISOString() : 'N/A'
        });
        
        // Log the exact fileKey received from backend
        console.log('🔑 [BACKEND RESPONSE] fileKey received from backend:', response.data.fileKey);
        console.log('🔑 [BACKEND RESPONSE] Full response data:', JSON.stringify(response.data, null, 2));
        
        return response.data;
      } catch (error) {
        const duration = performance.now() - startTime;
        presignedUrlLogger.logFailure(logEntry, error, duration);
        
        console.error('❌ [PRESIGNED URL ERROR]', {
          error: error.response?.data || error.message,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
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
      console.log(`📤 [S3 UPLOAD] Starting upload to: ${presignedUrl.substring(0, 100)}...`);
      
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
      
      console.log(`✅ [S3 UPLOAD SUCCESS] File uploaded successfully in ${duration.toFixed(2)}ms`);
      return true;
    } catch (error) {
      const duration = performance.now() - startTime;
      s3UploadLogger.logUploadFailure(logData, error, duration);
      
      console.error('❌ [S3 UPLOAD ERROR]', {
        error: error.message,
        presignedUrl: presignedUrl.substring(0, 100) + '...',
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
      });
      
      throw new Error('Failed to upload file to S3');
    }
  },

  // Submit claim with S3 image URL instead of file
  submitClaim: async (claimData) => {
    const startTime = performance.now();
    
    console.log(`📋 [CLAIM SUBMISSION] Starting claim submission`, {
      carMake: claimData.carMake,
      carModel: claimData.carModel,
      fileKey: claimData.fileKey,
      imageUrl: claimData.imageUrl.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });
    
    // Log the exact fileKey being sent to backend
    console.log('🔑 [BACKEND REQUEST] fileKey being sent to backend:', claimData.fileKey);
    console.log('🔑 [BACKEND REQUEST] Full claim data being sent:', JSON.stringify(claimData, null, 2));
    
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
          console.error('❌ [CLAIM SUBMISSION] Failed to parse response body:', parseError);
        }
      }
      
      console.log(`✅ [CLAIM SUBMISSION SUCCESS]`, {
        duration: `${duration.toFixed(2)}ms`,
        responseSize: JSON.stringify(responseData).length,
        hasModel1Output: !!responseData.model1_output,
        hasModel2Output: !!responseData.model2_output,
        hasCosting: !!responseData.costing
      });
      
      return responseData;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      console.error('❌ [CLAIM SUBMISSION ERROR]', {
        error: error.response?.data || error.message,
        duration: `${duration.toFixed(2)}ms`,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
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
          console.error('Failed to parse response body:', parseError);
        }
      }
      
      console.log('Upload Claim Response:', responseData);
      return responseData;
    } catch (error) {
      console.error('Upload Claim Error:', error.response?.data || error.message);
      // Silently handle the error without logging
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
          console.error('Failed to parse response body:', parseError);
        }
      }
      
      console.log('Process Claim Response:', responseData);
      return responseData;
    } catch (error) {
      console.error('Process Claim Error:', error.response?.data || error.message);
      // Silently handle the error without logging
      throw new Error('Failed to process claim');
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