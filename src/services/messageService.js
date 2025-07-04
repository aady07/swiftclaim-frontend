import axios from 'axios';

export const useMessageService = (language) => {
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
      
      const systemPrompt = language === "en"
        ? "You are a professional, helpful assistant for a large technology company. Respond in English."
        : "आप एक बड़ी प्रौद्योगिकी कंपनी के लिए एक पेशेवर, सहायक सहायक हैं। हिंदी में जवाब दें।";

      const response = await axios.post(
        "https://aadybackend.site/api/chat",  
        {
          systemPrompt: systemPrompt,
          messages: messages, 
          messageToSend: messageToSend
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
          botMessage = language === "en" ? "I'm not sure how to respond." : "मुझे जवाब देना नहीं आता।";
        }
      } else {
        console.log('No response data or response field found');
        botMessage = language === "en" ? "I'm not sure how to respond." : "मुझे जवाब देना नहीं आता।";
      }

      return botMessage;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return language === "en"
        ? "Sorry, I couldn't process that request. Please try again."
        : "क्षमा करें, मैं आपके अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।";
    }
  };

  return {
    isClaimRelatedQuery,
    sendMessage
  };
}; 