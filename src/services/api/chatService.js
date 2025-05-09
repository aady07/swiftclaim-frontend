import axios from 'axios';

const API_BASE_URL = 'https://aadybackend.site/api';

export const chatService = {
  sendMessage: async (messageData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, messageData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  },

  getSystemPrompt: (language) => {
    return language === "en"
      ? "You are a professional, helpful assistant for a large technology company. Respond in English."
      : "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";
  }
}; 