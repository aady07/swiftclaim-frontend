import { useChatState } from './useChatState';
import { useFileUpload } from './useFileUpload';
import { useCustomSpeechRecognition } from './useSpeechRecognition';
import { useSpeechService } from '../services/speechService';
import { useEmotionService } from '../services/emotionService';
import { useMessageService } from '../services/messageService';
import { useUIStateService } from '../services/uiStateService';

export const useChatLogic = (language) => {
  const {
    messages,
    setMessages,
    input,
    setInput,
    messagesEndRef,
    addMessage,
    clearInput
  } = useChatState();

  const {
    isMuted,
    setIsMuted,
    isTalking,
    setIsTalking,
    isListening,
    setIsListening,
    isTyping,
    setIsTyping,
    showImageUpload,
    setShowImageUpload,
    showCarInput,
    setShowCarInput,
    toggleMute
  } = useUIStateService();

  const { speak } = useSpeechService(language);
  const { detectEmotion } = useEmotionService(language);
  const { isClaimRelatedQuery, sendMessage } = useMessageService(language);

  const {
    selectedFile,
    setSelectedFile,
    carInput,
    setCarInput,
    uploadStatus,
    setUploadStatus,
    fileInputRef,
    handleCarDetails
  } = useFileUpload(language, { 
    addMessage, 
    speak, 
    setIsTyping, 
    setIsTalking, 
    isMuted,
    setShowImageUpload 
  });

  const handleSend = async (messageToSend = input) => {
    if (!messageToSend.trim()) return;

    // Clear any existing timeouts or intervals
    if (window.currentResponseInterval) {
      clearInterval(window.currentResponseInterval);
      window.currentResponseInterval = null;
    }

    // Prevent duplicate messages within a short time window
    const currentTime = Date.now();
    const isDuplicate = window.lastSentMessage === messageToSend.trim() && 
        window.lastSentTime && 
        currentTime - window.lastSentTime < 2000;

    // Only update last sent message if this is not a duplicate
    if (!isDuplicate) {
      window.lastSentMessage = messageToSend.trim();
      window.lastSentTime = currentTime;
    } else {
      console.log('Duplicate message detected, ignoring');
      return;
    }

    setShowImageUpload(false);
    setShowCarInput(false);
    setSelectedFile(null);
    setCarInput("");

    // Add user message
    addMessage(messageToSend, false);
    clearInput();

    // Handle claim-related queries
    if (isClaimRelatedQuery(messageToSend)) {
      const uploadMessage = language === "en"
        ? "I understand you want to file a claim for your vehicle. I'll help you with that. Please upload a clear photo of the damage using one of the buttons below."
        : "मैं समझता हूं कि आप अपने वाहन के लिए दावा दर्ज करना चाहते हैं। मैं आपकी मदद करूंगा। कृपया नीचे दिए गए बटनों में से किसी एक का उपयोग करके क्षति की एक स्पष्ट तस्वीर अपलोड करें।";
      
      setIsTyping(true);
      setIsTalking(false);

      await new Promise(resolve => setTimeout(resolve, 500));

      setIsTyping(false);
      setIsTalking(true);
      speak(uploadMessage, isMuted);

      // Clear any existing interval
      if (window.currentResponseInterval) {
        clearInterval(window.currentResponseInterval);
        window.currentResponseInterval = null;
      }

      let displayedText = "";
      let i = 0;
      addMessage("", true);

      // Create a new interval for streaming
      window.currentResponseInterval = setInterval(() => {
        if (i < uploadMessage.length) {
          displayedText += uploadMessage[i];
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
        } else {
          // Ensure we clear the interval and update state
          clearInterval(window.currentResponseInterval);
          window.currentResponseInterval = null;
          setIsTalking(false);
          setShowImageUpload(true);
          
          // Final update to ensure complete message is displayed
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: uploadMessage, fromBot: true };
            return newMessages;
          });
        }
      }, 30);
      return;
    }

    // Handle regular messages
    setIsTalking(false);
    setIsTyping(true);

    try {
      const botMessage = await sendMessage(messages, messageToSend);
      if (!botMessage) {
        throw new Error('No response received');
      }

      const detectedEmotion = detectEmotion(botMessage);

      setIsTyping(false);
      setIsTalking(true);
      speak(botMessage, isMuted);

      // Add bot message and stream it
      addMessage("", true);
      let displayedText = "";
      let i = 0;

      // Clear any existing interval
      if (window.currentResponseInterval) {
        clearInterval(window.currentResponseInterval);
        window.currentResponseInterval = null;
      }

      // Create a new interval for streaming
      window.currentResponseInterval = setInterval(() => {
        if (i < botMessage.length) {
          displayedText += botMessage[i];
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
        } else {
          // Ensure we clear the interval and update state
          clearInterval(window.currentResponseInterval);
          window.currentResponseInterval = null;
          setIsTalking(false);
          
          // Final update to ensure complete message is displayed
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: botMessage, fromBot: true };
            return newMessages;
          });
        }
      }, 30);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setIsTalking(false);
      
      const errorMessage = language === "en"
        ? "I apologize, but I'm having trouble processing your request right now. Please try again."
        : "मैं क्षमा चाहता हूं, लेकिन मुझे आपके अनुरोध को संसाधित करने में परेशानी हो रही है। कृपया पुनः प्रयास करें।";
      
      addMessage(errorMessage, true);
      speak(errorMessage, isMuted);
    }
  };

  const { startListening, stopListening } = useCustomSpeechRecognition(language, {
    setInput,
    handleSend,
    setIsListening
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleSend();
    }
  };

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    const carDetailsMessage = language === "en"
      ? "Please provide your car's make and model separated by a comma. For example: Maruti,Swift"
      : "कृपया अपनी कार का मेक और मॉडल कॉमा से अलग करके प्रदान करें। उदाहरण के लिए: Maruti,Swift";

    setIsTyping(true);
    setIsTalking(false);

    setTimeout(() => {
      setIsTyping(false);
      setIsTalking(true);
      speak(carDetailsMessage, isMuted);

      let displayedText = "";
      let i = 0;
      addMessage("", true);

      const interval = setInterval(() => {
        if (i < carDetailsMessage.length) {
          displayedText += carDetailsMessage[i];
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
        } else {
          clearInterval(interval);
          setIsTalking(false);
          setShowCarInput(true);
        }
      }, 30);
    }, 500);
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    isMuted,
    setIsMuted,
    isTalking,
    isListening,
    emotion: "neutral",
    isTyping,
    showImageUpload,
    selectedFile,
    setSelectedFile,
    showCarInput,
    carInput,
    setCarInput,
    uploadStatus,
    fileInputRef,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    startListening,
    stopListening,
    handleCarDetails,
    handleImageSelect,
    toggleMute,
    setShowCarInput,
    setShowImageUpload
  };
}; 