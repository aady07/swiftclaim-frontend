import axios from 'axios';
import { getLanguageLocale } from '../utils/languageUtils';

export const useMessageService = (language) => {
  const getSystemPrompt = () => {
    switch (language) {
      case "hi":
        return "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";
      case "te":
        return "మీరు ఒక పెద్ద టెక్నాలజీ కంపెనీకి వృత్తిపరమైన, సహాయక సహాయకులు. తెలుగు లో సమాధానం ఇవ్వండి.";
      default:
        return "You are a professional, helpful assistant for a large technology company. Respond in English.";
    }
  };

  const getFallbackResponse = () => {
    switch (language) {
      case "hi":
        return "मुझे जवाब देना नहीं आता।";
      case "te":
        return "నేను ఎలా ప్రతిస్పందించాలో తెలియడం లేదు.";
      default:
        return "I'm not sure how to respond.";
    }
  };

  const getErrorResponse = () => {
    switch (language) {
      case "hi":
        return "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।";
      case "te":
        return "క్షమించండి, నేను ఆ వినతిని ప్రాసెస్ చేయలేకపోయాను. దయచేసి మళ్లీ ప్రయత్నించండి.";
      default:
        return "Sorry, I couldn't process that request. Please try again.";
    }
  };

  const isClaimRelatedQuery = (text) => {
    const claimKeywords = [
      'claim', 'accident', 'damage', 'car damage', 'vehicle damage',
      'insurance claim', 'file claim', 'raise claim', 'report damage'
    ];
    const lowerText = text.toLowerCase();
    return claimKeywords.some(keyword => lowerText.includes(keyword));
  };

  const sendMessage = async (messages, messageToSend) => {
    try {
      console.log('Sending message to backend:', { messages, messageToSend });
      
      const response = await axios.post(
        "https://uat-api.miraista.com/api/chat",  
        {
          systemPrompt: getSystemPrompt(),
          messages: messages, 
          messageToSend: messageToSend,
          language: getLanguageLocale(language)
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      console.log('Received response from backend:', response.data);

      let botMessage;

      if (response.data && response.data.response) {
        const responseString = response.data.response;
        console.log('Response string:', responseString);
        
        const contentStart = responseString.indexOf("content=") + 8;
        const refusalStart = responseString.indexOf(", refusal=");
        
        if (contentStart !== -1 && refusalStart !== -1) {
          botMessage = responseString.substring(contentStart, refusalStart);
          console.log('Extracted bot message:', botMessage);
        } else {
          console.log('Could not parse response string, using default message');
          botMessage = getFallbackResponse();
        }
      } else {
        console.log('No response data or response field found');
        botMessage = getFallbackResponse();
      }

      return botMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return getErrorResponse();
    }
  };

  return {
    isClaimRelatedQuery,
    sendMessage
  };
}; 