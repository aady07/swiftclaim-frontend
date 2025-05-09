import axios from 'axios';

const API_BASE_URL = 'https://aadybackend.site/api';

export const claimService = {
  uploadClaim: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      // Silently handle the error without logging
      throw new Error('Failed to upload claim');
    }
  },

  processClaim: async (claimData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/process-claim`, claimData);
      return response.data;
    } catch (error) {
      // Silently handle the error without logging
      throw new Error('Failed to process claim');
    }
  }
}; 