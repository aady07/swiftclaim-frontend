import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const claimService = {
  // Track active requests to prevent duplicates
  activeRequests: new Map(),

  // Get pre-signed URL for S3 upload
  getUploadUrl: async (fileName, contentType) => {
    const requestKey = `${fileName}-${contentType}`;
    const requestId = `${fileName}-${contentType}-${Date.now()}-${Math.random()}`;
    
    // Check if there's already a pending request
    if (claimService.activeRequests.has(requestKey)) {
      const existingRequest = claimService.activeRequests.get(requestKey);
      console.log(`Duplicate request detected for: ${requestKey}, waiting for existing request`);
      
      // Wait for the existing request to complete
      try {
        const result = await existingRequest;
        console.log('Using result from existing request');
        return result;
      } catch (error) {
        // If existing request failed, remove it and continue
        claimService.activeRequests.delete(requestKey);
        console.log('Existing request failed, proceeding with new request');
      }
    }

    // Create a new request promise
    const requestPromise = (async () => {
      try {
        console.log(`Requesting pre-signed URL for: ${fileName} (${contentType})`);
        
        const response = await axios.post(`${API_BASE_URL}/get-upload-url`, 
          `fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        
        console.log('Pre-signed URL Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Get Upload URL Error:', error.response?.data || error.message);
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
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
      
      if (!response.ok) {
        throw new Error(`S3 upload failed: ${response.status}`);
      }
      
      console.log('S3 upload successful');
      return true;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new Error('Failed to upload file to S3');
    }
  },

  // Submit claim with S3 image URL instead of file
  submitClaim: async (claimData) => {
    try {
      console.log('Submitting claim with fileKey:', claimData.fileKey);
      const response = await axios.post(`${API_BASE_URL}/s3upload`, claimData, {
        headers: {
          'Content-Type': 'application/json',
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
      
      console.log('Submit Claim Response:', responseData);
      return responseData;
    } catch (error) {
      console.error('Submit Claim Error:', error.response?.data || error.message);
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
  }
}; 