import axios from 'axios';
import { getLanguageLocale } from '../../utils/languageUtils';

const API_BASE_URL = 'https://aadybackend.site/api';

const buildPayload = (messageData = {}, languageHint) => {
  const resolvedLanguage = getLanguageLocale(languageHint ?? messageData.language);
  return {
    ...messageData,
    language: resolvedLanguage,
  };
};

const getSystemPrompt = (language) => {
  switch (language) {
    case 'hi':
      return "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";
    case 'te':
      return "మీరు ఒక పెద్ద టెక్నాలజీ కంపెనీకి వృత్తిపరమైన, సహాయక సహాయకులు. తెలుగు లో సమాధానం ఇవ్వండి.";
    default:
      return "You are a professional, helpful assistant for a large technology company. Respond in English.";
  }
};

export const chatService = {
  sendMessage: async (messageData, language) => {
    try {
      const payload = buildPayload(messageData, language);
      const response = await axios.post(`${API_BASE_URL}/chat`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send message');
    }
  },

  getSystemPrompt,
};
