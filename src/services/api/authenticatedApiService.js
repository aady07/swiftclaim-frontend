import axios from 'axios';
import { cognitoService } from '../cognitoService';

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add JWT token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get the access token from Cognito
      const accessToken = await cognitoService.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        // Logging removed
      }
    } catch (error) {
      // Logging removed
      // Don't throw error here, let the request proceed without token
      // The backend will handle unauthorized requests
    }
    return config;
  },
  (error) => {
    // Logging removed
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Only redirect to /login if chatbot is NOT active
      if (!window.__CHATBOT_ACTIVE__) {
        window.location.href = '/login';
      } else {
        // Logging removed
      }
    }
    return Promise.reject(error);
  }
);

// Base API URLs
const CLAIMS_API_BASE_URL = 'https://testing.aadybackend.site/api';
const CHAT_API_BASE_URL = 'https://aadybackend.site/api';

export const authenticatedApiService = {
  // Claims API methods
  claims: {
    // Get all claims for the authenticated user
    getAllClaims: async () => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims`);
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to fetch claims');
      }
    },

    // Get a specific claim by ID
    getClaimById: async (claimId) => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims/${claimId}`);
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to fetch claim');
      }
    },

    // Get pre-signed URL for S3 upload
    getUploadUrl: async (fileName, contentType) => {
      try {
        const response = await apiClient.post(
          `${CLAIMS_API_BASE_URL}/get-upload-url`,
          `fileName=${encodeURIComponent(fileName)}&contentType=${encodeURIComponent(contentType)}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to get upload URL');
      }
    },

    // Submit a new claim
    submitClaim: async (claimData) => {
      try {
        // Get the user ID from Cognito token
        const userId = await cognitoService.getUserId();
        
        // Add user ID to claim data
        const claimWithUserId = {
          ...claimData,
          userId: userId
        };

        // Logging removed
        
        const response = await apiClient.post(`${CLAIMS_API_BASE_URL}/s3upload`, claimWithUserId, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Handle the response format
        let responseData = response.data;
        if (responseData.body && typeof responseData.body === 'string') {
          try {
            responseData = JSON.parse(responseData.body);
          } catch (parseError) {
            // Logging removed
          }
        }

        return responseData;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to submit claim');
      }
    },

    // Get original image for a claim
    getOriginalImage: async (claimId) => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims/${claimId}/original-image`, {
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to get original image');
      }
    },

    // Get processed image for a claim
    getProcessedImage: async (claimId) => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims/${claimId}/processed-image`, {
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to get processed image');
      }
    },

    // Get processed image for model 1
    getModel1Image: async (claimId) => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims/${claimId}/model1-image`, {
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to get model1 image');
      }
    },

    // Get processed image for model 2
    getModel2Image: async (claimId) => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims/${claimId}/model2-image`, {
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to get model2 image');
      }
    },

    // Upload file directly to S3 using pre-signed URL
    uploadToS3: async (presignedUrl, file) => {
      try {
        // Logging removed
        
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
        
        // Logging removed
        return true;
      } catch (error) {
        // Logging removed
        
        throw new Error('Failed to upload file to S3');
      }
    },

    // Legacy upload method (for backward compatibility)
    uploadClaim: async (formData) => {
      try {
        const response = await apiClient.post(`${CLAIMS_API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        let responseData = response.data;
        if (responseData.body && typeof responseData.body === 'string') {
          try {
            responseData = JSON.parse(responseData.body);
          } catch (parseError) {
            // Logging removed
          }
        }

        return responseData;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to upload claim');
      }
    },

    // Process claim
    processClaim: async (claimData) => {
      try {
        const response = await apiClient.post(`${CLAIMS_API_BASE_URL}/process-claim`, claimData);

        let responseData = response.data;
        if (responseData.body && typeof responseData.body === 'string') {
          try {
            responseData = JSON.parse(responseData.body);
          } catch (parseError) {
            // Logging removed
          }
        }

        return responseData;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to process claim');
      }
    },

    // Get logging statistics (placeholder for compatibility)
    getLoggingStats: () => {
      return {
        presignedUrl: {
          totalRequests: 0,
          successCount: 0,
          failureCount: 0,
          successRate: '0.0',
          avgRequestTime: '0.00',
          recentRequests: []
        },
        s3Upload: {
          totalUploads: 0,
          successCount: 0,
          failureCount: 0,
          successRate: '0.0',
          avgUploadTime: '0.00',
          totalDataUploaded: '0.00MB'
        }
      };
    },

    // Get claim results (model outputs and costings)
    getClaimResults: async (claimId) => {
      try {
        const response = await apiClient.get(`${CLAIMS_API_BASE_URL}/claims/${claimId}/results`);
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to fetch claim results');
      }
    },
  },

  // Chat API methods
  chat: {
    // Send a chat message
    sendMessage: async (messageData) => {
      try {
        const response = await apiClient.post(`${CHAT_API_BASE_URL}/chat`, messageData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to send message');
      }
    },

    // Get system prompt for different languages
    getSystemPrompt: (language) => {
      return language === "en"
        ? "You are a professional, helpful assistant for a large technology company. Respond in English."
        : "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";
    },
  },

  // Speech API methods
  speech: {
    // Speech-to-text conversion
    speechToText: async (audioBlob) => {
      try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');
        
        const response = await apiClient.post(`${CHAT_API_BASE_URL}/speech/stt`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        // Logging removed
        throw new Error('Failed to convert speech to text');
      }
    },
  },

  // Utility methods
  utils: {
    // Check if user is authenticated
    isAuthenticated: async () => {
      return await cognitoService.isAuthenticated();
    },

    // Get current user ID
    getCurrentUserId: async () => {
      return await cognitoService.getUserId();
    },

    // Get current user email
    getCurrentUserEmail: async () => {
      return await cognitoService.getUserEmail();
    },

    // Get access token (for debugging)
    getAccessToken: async () => {
      return await cognitoService.getAccessToken();
    },
  },
};

// Export the axios instance for direct use if needed
export { apiClient };

// Make the service available globally for debugging
if (typeof window !== 'undefined') {
  window.authenticatedApiService = authenticatedApiService;
} 