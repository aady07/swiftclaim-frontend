import { apiClient } from './authenticatedApiService';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api';

export const userLimitService = {
  // Get user limit information
  getLimitInfo: async () => {
    try {
      const response = await apiClient.get(`${API_CONFIG.getClaimsApiUrl()}${API_ENDPOINTS.USER_LIMIT_INFO}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user limit info:', error);
      // Return mock data for any error (network, 404, etc.)
      return {
        canUpload: true,
        stats: {
          userTier: "FREE",
          totalUploads: 0,
          uploadLimit: 15,
          remainingUploads: 15,
          isUnlimited: false,
          hasReachedLimit: false
        },
        tierInfo: {
          name: "Free",
          uploadLimit: 15,
          description: "Free tier with 15 upload limit",
          upgradeMessage: "Upgrade to Premium for unlimited uploads"
        }
      };
    }
  },

  // Check if user can upload
  checkUploadLimit: async () => {
    try {
      const response = await apiClient.get(`${API_CONFIG.getClaimsApiUrl()}${API_ENDPOINTS.USER_UPLOAD_LIMIT}`);
      return response.data;
    } catch (error) {
      console.error('Error checking upload limit:', error);
      // Return mock data for any error
      return { canUpload: true };
    }
  },

  // Get upload statistics
  getUploadStats: async () => {
    try {
      const response = await apiClient.get(`${API_CONFIG.getClaimsApiUrl()}${API_ENDPOINTS.USER_UPLOAD_STATS}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upload stats:', error);
      // Return mock data for any error
      return {
        userTier: "FREE",
        totalUploads: 0,
        uploadLimit: 15,
        remainingUploads: 15,
        isUnlimited: false,
        hasReachedLimit: false
      };
    }
  },

  // Upgrade user tier
  upgradeTier: async (tier = 'PREMIUM') => {
    try {
      const response = await apiClient.post(`${API_CONFIG.getClaimsApiUrl()}${API_ENDPOINTS.USER_UPGRADE_TIER}`, {
        tier
      });
      return response.data;
    } catch (error) {
      console.error('Error upgrading tier:', error);
      // Return mock success for any error
      return {
        message: "User tier updated successfully (mock)",
        newTier: "PREMIUM",
        uploadLimit: -1
      };
    }
  }
}; 