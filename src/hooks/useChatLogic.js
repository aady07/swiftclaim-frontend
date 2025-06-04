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

    setShowImageUpload(false);
    setShowCarInput(false);
    setSelectedFile(null);
    setCarInput("");

    addMessage(messageToSend, false);
    clearInput();

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

      let displayedText = "";
      let i = 0;
      addMessage("", true);

      const interval = setInterval(() => {
        if (i < uploadMessage.length) {
          displayedText += uploadMessage[i];
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
            return newMessages;
          });
          i++;
        } else {
          clearInterval(interval);
          setIsTalking(false);
          setShowImageUpload(true);
        }
      }, 30);
      return;
    }

    setIsTalking(false);
    setIsTyping(true);

    const botMessage = await sendMessage(messages, messageToSend);
    const detectedEmotion = detectEmotion(botMessage);

    setIsTyping(false);
    setIsTalking(true);
    speak(botMessage, isMuted);

    addMessage("", true);

    let displayedText = "";
    let i = 0;
    const interval = setInterval(() => {
      if (i < botMessage.length) {
        displayedText += botMessage[i];
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = { text: displayedText, fromBot: true };
          return newMessages;
        });
        i++;
      } else {
        clearInterval(interval);
        setIsTalking(false);
      }
    }, 30);
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