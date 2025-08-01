import { apiClient } from './authenticatedApiService';

export const userLimitService = {
  // Get user limit information
  getLimitInfo: async () => {
    try {
      const response = await apiClient.get('https://testing.aadybackend.site/api/user/limit-info');
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
      const response = await apiClient.get('https://testing.aadybackend.site/api/user/upload-limit');
      return response.data;
    } catch (error) {
      console.error('Error checking upload limit:', error);
      // Return mock data if backend is not ready yet
      if (error.response?.status === 404) {
        return { canUpload: true };
      }
      throw error;
    }
  },

  // Get upload statistics
  getUploadStats: async () => {
    try {
      const response = await apiClient.get('https://testing.aadybackend.site/api/user/upload-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching upload stats:', error);
      // Return mock data if backend is not ready yet
      if (error.response?.status === 404) {
        return {
          userTier: "FREE",
          totalUploads: 0,
          uploadLimit: 15,
          remainingUploads: 15,
          isUnlimited: false,
          hasReachedLimit: false
        };
      }
      throw error;
    }
  },

  // Upgrade user tier
  upgradeTier: async (tier = 'PREMIUM') => {
    try {
      const response = await apiClient.post('https://testing.aadybackend.site/api/user/upgrade-tier', {
        tier
      });
      return response.data;
    } catch (error) {
      console.error('Error upgrading tier:', error);
      // Return mock success if backend is not ready yet
      if (error.response?.status === 404) {
        return {
          message: "User tier updated successfully (mock)",
          newTier: "PREMIUM",
          uploadLimit: -1
        };
      }
      throw error;
    }
  }
}; 