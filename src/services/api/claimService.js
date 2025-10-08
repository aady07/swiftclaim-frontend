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
      // Silently handle the error without loggingimage.png
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